export const TOPICS = {
  KAFKA_TOPIC_MESSAGE: 'kafka-topic-message',
} as const;

export type TTopics = (typeof TOPICS)[keyof typeof TOPICS];
