class Observer {
  subscriptions: Array<() => void>;

  constructor() {
    this.subscriptions = [];
  }

  subscribe(callback: () => void) {
    return this.subscriptions.push(callback) - 1;
  }

  unsubscribe(what: () => void) {
    this.subscriptions = this.subscriptions.filter((sub) => sub !== what);
  }

  notify() {
    this.subscriptions.forEach((callback) => {
      callback();
    });
  }
}

class TimingService extends Observer {
  interval: number | null;

  constructor() {
    super();
    this.interval = null;
  }

  // Starts the timer and notifies subscriptions every updateInterval miliseconds
  start(updateInterval = 1000) {
    // run subscriptions every second
    this.interval = window.setInterval(() => {
      this.notify();
    }, updateInterval);
  }

  stop() {
    window.clearInterval(this.interval ?? -1);
    this.interval = null;
  }
}

const instance = new TimingService();
export default instance;
