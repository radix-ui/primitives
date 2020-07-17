// adapted from https://github.com/choojs/nanoscheduler
import { canUseDOM } from '@interop-ui/utils';

export class Scheduler {
  private hasWindow: boolean;
  private hasIdle: boolean;
  private scheduled: boolean;
  private queue: any[];
  private method: (<T extends (...args: any[]) => any>(cb: T) => void) &
    typeof window.requestIdleCallback;

  constructor(hasWindow?: boolean) {
    this.hasWindow = typeof hasWindow === 'undefined' ? canUseDOM() : hasWindow;
    this.hasIdle = !!(this.hasWindow && window.requestIdleCallback);
    this.method = this.hasIdle ? window.requestIdleCallback.bind(window) : this.setTimeout;
    this.scheduled = false;
    this.queue = [];
  }

  private setTimeout<T extends (...args: any[]) => any>(cb: T) {
    setTimeout(cb, 0, {
      timeRemaining() {
        return 1;
      },
    });
  }

  public push<T extends (...args: any[]) => any>(cb: T) {
    this.queue.push(cb);
    this.schedule();
  }

  public schedule() {
    if (this.scheduled) {
      return;
    }
    this.scheduled = true;
    this.method((idleDeadline) => {
      let cb;
      while (this.queue.length && idleDeadline.timeRemaining() > 0) {
        cb = this.queue.shift();
        cb(idleDeadline);
      }
      this.scheduled = false;
      if (this.queue.length) {
        this.schedule();
      }
    });
  }
}
