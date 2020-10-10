const STATES = {
  IDLE: 'IDLE',
  STOPPED: 'STOPPED',
  QUEUING: 'QUEUING',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  ERROR: 'ERROR',
} as const;

/**
 * A queue for async things. Calling Queue.enqueue will fire an async task immediately if no other
 * tasks are in the queue.
 */
export class Queue<T = any> {
  queue: QueueItem<T>[] = [];
  private _state: QueueState = STATES.IDLE;

  restart() {
    if (this.state === STATES.STOPPED) {
      this._state = STATES.IDLE;
    }
  }

  private rejectItem(reject: any, error: any) {
    if (this.stateIs(STATES.PENDING, STATES.QUEUING)) {
      this._state = this.isEmpty() ? STATES.ERROR : STATES.QUEUING;
      reject(error);
      this.dequeue();
    }
  }

  private resolveItem(resolve: any, value: any) {
    if (this.stateIs(STATES.PENDING, STATES.QUEUING)) {
      this._state = this.isEmpty() ? STATES.RESOLVED : STATES.QUEUING;
      resolve(value);
      this.dequeue();
    }
  }

  enqueue(promise: () => Promise<T>) {
    this.restart();
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.stateIs(STATES.ERROR, STATES.RESOLVED, STATES.IDLE, STATES.QUEUING)) {
      if (this.isEmpty()) {
        return;
      }
      const item = this.queue.shift()!;
      try {
        this._state = 'PENDING';
        item
          .promise()
          .then((value) => {
            this.resolveItem(item.resolve, value);
          })
          .catch((error) => {
            this.rejectItem(item.reject, error);
          });
      } catch (error) {
        this.rejectItem(item.reject, error);
      }
    }
  }

  get state() {
    return this._state;
  }

  stateIs(...states: QueueState[]) {
    return states.includes(this.state);
  }

  isEmpty() {
    return this.queue.length <= 0;
  }

  stop() {
    if (this.stateIs(STATES.PENDING, STATES.QUEUING)) {
      this._state = STATES.STOPPED;
      this.queue = [];
    }
  }
}

type ValueOf<T> = T[keyof T];

type QueueState = ValueOf<typeof STATES>;

type QueueItem<T> = {
  promise(): Promise<T>;
  resolve(value: T | PromiseLike<T>): void;
  reject(reason?: any): void;
};
