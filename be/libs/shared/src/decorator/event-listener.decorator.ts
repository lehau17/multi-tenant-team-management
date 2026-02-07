import { SetMetadata } from "@nestjs/common";

export const EVENT_LISTENER_METADATA= "EVENT_LISTENER_METADATA"


export const OnEventConsumer = (topic :string) => SetMetadata(EVENT_LISTENER_METADATA, topic)
