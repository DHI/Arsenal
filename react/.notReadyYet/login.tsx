import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import styled from 'styled-components';

import { getParentOfType, types as t } from 'mobx-state-tree';

/**
 * This component serves to gate any wrapped components in a login form.
 *
 * @example <LoginGate>You are logged in if you see this.</LoginGate>
 */
export const LoginGate: React.FC = observer(({ children }) => {
  const { login } = useStore();

  if (login.isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <styles.LoginOverlay
        id="loginBox"
        container
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} md={4}>
          <Paper>
            {(() => {
              if (login.mode === 'reset') {
                return <ResetPasswordForm />;
              }

              return (
                <>
                  <LoginForm />
                  <ResetPasswordLink />
                </>
              );
            })()}
          </Paper>
        </Grid>
      </styles.LoginOverlay>
    </>
  );
});

const LoginForm: React.FC = observer(() => {
  const { login } = useStore();

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      p={5}
      onSubmit={(e) => {
        e.preventDefault();
        login.submitLogin();
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <TextField
        variant="outlined"
        onChange={(e) => login.set({ nameInput: e.target.value })}
        value={login.nameInput}
        label="Username"
        required
      />
      <styles.Divider />
      <TextField
        error={login.hasFailed}
        variant="outlined"
        onChange={(e) => login.set({ passwordInput: e.target.value })}
        value={login.passwordInput}
        label="Password"
        type="password"
        required
        helperText={login.failureMessage}
      />
      <styles.Divider />
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={login.loading}
        startIcon={login.loading && <CircularProgress size={16} />}
      >
        Login
      </Button>
    </Box>
  );
});

const ResetPasswordLink: React.FC = observer(() => {
  const { login } = useStore();

  return (
    <styles.ResetPasswordLinkBox>
      Forgot your password?
      <Button variant="outlined" onClick={() => login.set({ mode: 'reset' })}>
        Reset
      </Button>
    </styles.ResetPasswordLinkBox>
  );
});

const ResetPasswordForm: React.FC = observer(() => {
  const { login } = useStore();

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      p={5}
      onSubmit={(e) => {
        e.preventDefault();
        login.submitPasswordReset();
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Reset Password
      </Typography>
      <TextField
        variant="outlined"
        onChange={(e) => login.set({ passwordResetName: e.target.value })}
        value={login.passwordResetName}
        label="Username"
        required
      />
      <br />
      <Button type="submit" color="primary" variant="contained">
        Send me an email
      </Button>
      <br />
      <Button variant="outlined" onClick={() => login.set({ mode: 'login' })}>
        Cancel
      </Button>
    </Box>
  );
});

const styles = {
  LoginOverlay: styled(Grid)`
    /* margin-top: 64px; */
    height: 100vh; /* TODO: due to the fixed header, this should be pushed down with a wrapper around it with padding */
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: inset 0 0 100px 50px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;

    > div {
      max-width: 400px;
    }
  `,
  ResetPasswordLinkBox: styled.div`
    padding: 0 40px 20px;
    text-align: center;
    button {
      margin-left: 1em;
    }
  `,
  Divider: styled(Divider)`
    && {
      width: 25%;
      margin: 1em auto;
    }
  `,
};

const log = logger.extend('store').extend('login');

/**
 * TODO: Can be genericized where the API calls can be provided on construction, thus can support any auth protocol
 */
export const DhiLoginModel = t
  .model({
    username: '',
    tokenRefreshMinimum: 10 * 60 * 1000, // 10 mins
    tokenDetails: t.late(() => t.maybe(TokenDetails)),
  })
  .volatile(() => ({
    mode: 'login' as 'login' | 'reset',
    failureMessage: '',
    loading: false,
    nameInput: '',
    passwordInput: '',
    passwordResetName: '',
    refreshTokenTimeout: undefined as undefined | NodeJS.Timeout,
  }))
  .views((self) => ({
    get token() {
      return self.tokenDetails?.accessToken;
    },
    get hasFailed() {
      return !!self.failureMessage;
    },
  }))
  .views((self) => ({
    get isLoggedIn() {
      return !!self.token;
    },
  }))
  .actions((self) => {
    const actions = {
      set: SetterAction(self),
      async submitLogin() {
        self.loading = true;

        const { data, errors } = await GetAccessToken({
          variables: { id: self.nameInput, password: self.passwordInput },
        });

        self.loading = false;

        if (errors?.length) {
          self.failureMessage = `Failure to authenticate :(`;

          log('Login failure: %o %O', errors, data);

          return;
        }

        self.username = self.nameInput;
        self.passwordInput = '';

        self.tokenDetails = TokenDetails.create({
          accessToken: data.accessToken?.accessToken.token!,
          refreshToken: data.accessToken?.refreshToken.token!,
          refreshTokenExpiry: new Date(
            data.accessToken?.refreshToken.expiration!,
          ),
          accessTokenExpiry: new Date(
            data.accessToken?.accessToken.expiration!,
          ),
        });
      },
      submitLogout() {
        self.tokenDetails = undefined;
        self.username = '';
        clearTimeout(self.refreshTokenTimeout!);
      },
      async submitAccessTokenRefresh() {
        if (!self.tokenDetails) {
          return;
        }

        const { data, errors } = await RefreshAccessToken({
          variables: {
            accessToken: self.tokenDetails.accessToken,
            refreshToken: self.tokenDetails.refreshToken,
          },
        });

        log(`submitAccessTokenRefresh %O`, { data, errors });

        const isSuccessful = !!data?.refreshAccessToken;

        if (!isSuccessful) {
          log(`Failure to refresh access token!`);

          return actions.submitLogout();
        }

        // TODO: abstract to closure fn to set token
        self.tokenDetails = TokenDetails.create({
          accessToken: data.refreshAccessToken?.accessToken.token!,
          accessTokenExpiry: new Date(
            data.refreshAccessToken?.accessToken.expiration!,
          ),
          refreshToken: data.refreshAccessToken?.refreshToken.token!,
          refreshTokenExpiry: new Date(
            data.refreshAccessToken?.refreshToken.expiration!,
          ),
        });
      },
      restartTimerToRefreshAccessToken() {
        if (self.refreshTokenTimeout) {
          clearTimeout(self.refreshTokenTimeout);
        }

        if (!self.tokenDetails) {
          return;
        }

        const tokenExpiryTime = self.tokenDetails!.accessTokenExpiry.getTime();

        const durationToWait = (() => {
          const duration = (tokenExpiryTime - Date.now()) / 2;

          // Prevents recursion if the dates get messed up
          if (duration < self.tokenRefreshMinimum)
            return self.tokenRefreshMinimum;

          return duration;
        })();

        const tokenRefreshAtDate = new Date(Date.now() + durationToWait);

        log(
          `Access token refreshs in %o ms, at %o`,
          durationToWait,
          tokenRefreshAtDate.toString(),
        );

        self.refreshTokenTimeout = setTimeout(
          actions.submitAccessTokenRefresh,
          durationToWait,
        );
      },
      async submitPasswordReset() {
        self.loading = true;

        const result = await ops.ResetPassword({
          variables: { userId: self.passwordResetName },
        });

        self.loading = false;
        self.mode = 'login';

        log(`password reset res %o`, result);
      },
      /** [HOOK] https://mobx-state-tree.js.org/overview/hooks */
      beforeDestroy() {
        actions.submitLogout();
      },
    };

    return actions;
  });

const TokenDetails = t
  .model({
    accessToken: t.string,
    refreshToken: t.string,
    accessTokenExpiry: t.Date,
    refreshTokenExpiry: t.Date,
  })
  .actions((self) => ({
    /** [HOOK] https://mobx-state-tree.js.org/overview/hooks */
    afterAttach() {
      log('TokenDetailsModel AFTER ATTACH');
      const parent = getParentOfType(self, DhiLoginModel);

      // Wait for the node to be attached properly...
      delay(1000).then(() => parent.restartTimerToRefreshAccessToken());
    },
  }));
