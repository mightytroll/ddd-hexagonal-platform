import { DomainEventBus } from "../src/Platform/Domain/DomainEventBus";
import { NodeDomainEventBus } from "../src/Platform/Infrastructure/NodeDomainEventBus";

let services = {};

services[DomainEventBus.name] = NodeDomainEventBus;

export default services;
