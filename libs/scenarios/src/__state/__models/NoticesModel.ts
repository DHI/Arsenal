import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

export interface NoticeInput<CONTENT> {
  timeout: number;
  content: CONTENT;
}

export interface NoticeItem<C> extends NoticeInput<C> {
  id: string;
  createdAt: number;
}

export class NoticesModel<CONTENT> {
  constructor() {
    makeAutoObservable(this);
  }

  ITEM_TYPE!: NoticeItemModel<CONTENT>;

  items = new Set<this['ITEM_TYPE']>();

  add = async (input: NoticeInput<CONTENT>) => {
    const id = nanoid();

    this.items.add(new NoticeItemModel<CONTENT>(input));

    await new Promise((resolve) => setTimeout(resolve, input.timeout));

    this.remove(id);
  };

  remove = (id: string) => {
    this.items.delete(
      Array.from(this.items.values()).find((v) => v.id === id)!,
    );
  };
}

export class NoticeItemModel<CONTENT> {
  constructor(input: NoticeInput<CONTENT>) {
    Object.assign(this, input);

    this.tickTimeout = setInterval(() => {
      this.incrTick();
    }, 100);

    makeAutoObservable(this);
  }

  id = nanoid();
  createdAt = Date.now();

  timeout = 5000;
  content = {} as CONTENT;

  private tickTimeout: NodeJS.Timeout;
  private tick = 0;

  private incrTick() {
    this.tick++;
  }

  get expiresAt() {
    return this.createdAt + this.timeout;
  }

  get timeoutRemaining() {
    this.tick; // Causes re-render every time

    const remaining = this.expiresAt - Date.now();

    return remaining < 0 ? 0 : remaining;
  }

  dispose() {
    clearTimeout(this.tickTimeout);
  }
}
