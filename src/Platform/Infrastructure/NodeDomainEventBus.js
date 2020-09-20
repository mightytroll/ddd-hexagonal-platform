import { EventEmitter } from "events";
import { DomainEventBus } from "../Domain/DomainEventBus";

export class NodeDomainEventBus extends DomainEventBus {
    constructor() {
        super();
        this.emmitter = new EventEmitter();

        let eventSubscribers = require("../../../cache/cache").DomainEventSubscribers;
        if (eventSubscribers) {
            eventSubscribers.forEach((subscriber) => {
                this.subscribe(subscriber);
            });
        }
    }

    subscribe(subscriber) {
        let instance = new subscriber();
        subscriber.subscribedTo().forEach((event) => {
            this.emmitter.on(event.name, instance.handle);
        });
    }

    /**
     * @param {DomainEvent} event
     */
    dispatch(event) {
        this.emmitter.emit(event.constructor.name, event);
    }
}