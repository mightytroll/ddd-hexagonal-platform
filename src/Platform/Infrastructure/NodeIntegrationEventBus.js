import { EventEmitter } from "events";
import { DomainEventBus } from "../Domain/DomainEventBus";
import { IntegrationEvent } from "../Domain/IntegrationEvent";
import { IntegrationEventBus } from "../Domain/IntegrationEventBus";

export class NodeIntegrationEventBus extends IntegrationEventBus {
    constructor() {
        super();
        this.emmitter = new EventEmitter();

        let eventSubscribers = require("../../../cache/cache").IntegrationEventSubscribers;
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
     * @param {IntegrationEvent} event
     */
    dispatch(event) {
        this.emmitter.emit(event.constructor.name, event);
    }
}