class TimingService {
    subscriptions: Array<Function>
    interval: number | null

    constructor(){
        this.subscriptions = [];
        this.interval = null;
    }

    // Starts the timer and notifies subscriptions every updateInterval miliseconds
    start(updateInterval: number = 1000){
        // run subscriptions every second
        const handler = () => this.subscriptions.forEach(callback => callback());
        this.interval = window.setInterval(handler, updateInterval);
    }

    stop(){
        window.clearInterval(this.interval ?? -1);
        this.interval = null;
    }

    subscribe(callback: Function){
        return this.subscriptions.push(callback) - 1;
    }

    unsubscribe(id: number){
        const r = this.subscriptions.splice(id);
    }
}

export default new TimingService();