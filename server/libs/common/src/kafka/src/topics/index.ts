import { NAME } from '../../../../../constants/index';

import { KafkaTopicMessage } from './kafka-topic-message';

const KAFKA_TOPICS = NAME.KAFKA.TOPICS;

export * from './kafka-topic-message';

export const TopicMessageMap = {
  [KAFKA_TOPICS.KAFKA_TOPIC_MESSAGE]: KafkaTopicMessage,
} as const;

export type TTopicMessageMap =
  (typeof TopicMessageMap)[keyof typeof TopicMessageMap];
