enum QueueState {
  Idle,
  Stopped,
  Queuing,
  Pending,
  Resolved,
  Error,
}

/**
 * A queue for async things. Calling Queue.enqueue will fire an async task immediately if no other
 * tasks are in the queue.
 */
export class Queue<T = any> {
  queue: QueueItem<T>[] = [];
  private _state: QueueState = QueueState.Idle;

  restart() {
    if (this.state === QueueState.Stopped) {
      this._state = QueueState.Idle;
    }
  }

  private rejectItem(reject: any, error: any) {
    if (this.stateIs(QueueState.Pending, QueueState.Queuing)) {
      this._state = this.isEmpty() ? QueueState.Error : QueueState.Queuing;
      reject(error);
      this.dequeue();
    }
  }

  private resolveItem(resolve: any, value: any) {
    if (this.stateIs(QueueState.Pending, QueueState.Queuing)) {
      this._state = this.isEmpty() ? QueueState.Resolved : QueueState.Queuing;
      resolve(value);
      this.dequeue();
    }
  }

  public get isBusy() {
    return this.state === QueueState.Queuing || this.state === QueueState.Pending;
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
    if (this.stateIs(QueueState.Error, QueueState.Resolved, QueueState.Idle, QueueState.Queuing)) {
      if (this.isEmpty()) {
        return;
      }
      const item = this.queue.shift()!;
      try {
        this._state = QueueState.Pending;
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
    if (this.stateIs(QueueState.Pending, QueueState.Queuing)) {
      this._state = QueueState.Stopped;
      this.queue = [];
    }
  }
}

type ValueOf<T> = T[keyof T];

type QueueItem<T> = {
  promise(): Promise<T>;
  resolve(value: T | PromiseLike<T>): void;
  reject(reason?: any): void;
};
