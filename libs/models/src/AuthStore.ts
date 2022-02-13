import { makeAutoObservable, toJS } from 'mobx';
import { AsyncValue, StateModel } from '.';

/**
 * Handles Authorization workflows
 */
export class AuthStore {
  constructor(
    private config: {
      data(): {
        tokenQuery: AsyncValue<
          AuthTokenResponse,
          { username: string; password: string }
        >;
        refreshQuery: AsyncValue<AuthTokenResponse, { refreshToken: string }>;
        loadFromCache?(): Promise<AuthTokenResponse | undefined | null>;
        saveToCache?(json: AuthTokenResponse): Promise<any>;
        removeFromCache?(): Promise<any>;
      };
    },
  ) {
    makeAutoObservable(this);
  }

  state = new StateModel<
    | { status: 'idle' }
    | { status: 'pending' }
    | { status: 'authed'; token: AuthTokenResponse }
    | { status: 'error'; reason?: string; input: LoginInput }
  >({ status: 'idle' });

  refreshTokenIntervalDelay = 1000 * 60 * 10;
  refreshTimer?: NodeJS.Timeout = undefined;

  get status() {
    return this.state.value.status;
  }

  get isAuthed() {
    return this.status === 'authed';
  }

  get token() {
    return this.state.value.status === 'authed'
      ? this.state.value.token
      : undefined;
  }

  get accessToken() {
    return this.token?.accessToken.token;
  }

  get data() {
    return this.config.data();
  }

  login = async (input: LoginInput) => {
    if (!input.username || !input.password) {
      this.state.set({
        status: 'error',
        reason: 'Invalid credentials',
        input,
      });

      return;
    }

    this.state.set({ status: 'pending' });

    try {
      const { value: token, error } = await this.data.tokenQuery.query(input);

      if (error) throw error;
      if (!token) throw new Error('Token not found');

      await this.setAuthorizedSession(token);
    } catch (err: any) {
      console.error(err);

      await this.logout();

      this.state.set({
        input,
        status: 'error',
        reason: err?.message,
      });
    }
  };

  loadCache = async () => {
    try {
      if (!this.data.loadFromCache) return;

      const session = await this.data.loadFromCache();

      if (!session) throw new Error('Cached session is invalid.');

      await this.setAuthorizedSession(session);
      await this.checkRefreshToken(session);
    } catch {
      await this.logout();
    }
  };

  saveCache = async () => {
    if (!this.data.saveToCache) return;
    if (this.state.value.status !== 'authed') return;

    const session = toJS(this.state.value.token);

    await this.data.saveToCache(session);
  };

  useRefreshToken = async () => {
    if (!this.token?.refreshToken.token) throw new Error('Expired token');

    try {
      const { value: token, error } = await this.data.refreshQuery.query({
        refreshToken: this.token.refreshToken.token,
      });

      if (error) throw error;

      await this.setAuthorizedSession(token);
    } catch {
      await this.logout();
    }
  };

  resetSession = async () => {
    this.state.set({ status: 'idle' });

    await this.data.removeFromCache?.();
  };

  logout = async () => {
    this.resetSession();
  };

  restartRefreshTimer = () => {
    this.stopRefreshTimer();

    this.refreshTimer = setInterval(
      () => this.useRefreshToken(),
      this.refreshTokenIntervalDelay,
    );
  };

  stopRefreshTimer = () => {
    clearInterval(this.refreshTimer!);
  };

  private checkRefreshToken = async (token: this['token']) => {
    if (!token) return;

    const expirationTime = new Date(token.accessToken.expiration).getTime();
    const expiresAt = expirationTime - this.refreshTokenIntervalDelay * 2;
    const shouldRefreshToken = expiresAt < Date.now();

    if (shouldRefreshToken) await this.useRefreshToken();
  };

  private setAuthorizedSession = async (token: this['token']) => {
    if (!token?.accessToken?.token) throw new Error('Invalid token');

    this.state.set({ status: 'authed', token });

    await this.saveCache();
    this.restartRefreshTimer();
  };
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: {
    token: string;
    expiration: string;
  };
  refreshToken: {
    token: string;
  };
}
