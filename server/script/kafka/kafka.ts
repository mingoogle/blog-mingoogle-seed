const { map } = require('lodash');
const { Kafka } = require('kafkajs');

const { KAFKA_HOST, KAFKA_TOPIC_PARTITIONS, KAFKA_TOPIC_REPLICATION_FACTOR } =
  process.env;

export const kafka = new Kafka({
  clientId: 'seed-kafka-topic-migrate',
  brokers: [KAFKA_HOST],
});

const admin = kafka.admin();

// 실제 Kafka Topic 생성을 위한 배열
const getTopicList = (topics) =>
  map(topics, (newTopic) => ({
    topic: newTopic.topic,
    numPartitions: newTopic.numPartitions || KAFKA_TOPIC_PARTITIONS,
    replicationFactor:
      newTopic.replicationFactor || KAFKA_TOPIC_REPLICATION_FACTOR,
  }));

export const adminConnect = async () => {
  await admin.connect();
};

// NOTE: 연결 종료는 현재 사용하지 않는다. 서버에서 자동 연결 종료되는 것으로 처리한다.
export const adminDisconnect = async () => {
  try {
    await admin.disconnect();
  } catch (err) {
    process.exit(0);
  }
};

export const createTopics = async (topics) => {
  const topicList = getTopicList(topics);
  try {
    await admin.createTopics({
      topics: topicList,
    });
  } catch (err) {
    console.log(err);
    // NOTE: 마이그레이션 실행 중 에러가 발생하면 프로그램을 종료한다. migrate 모듈에서는 에러를 무시하고 계속 실행한다.
    process.exit(0);
  }
};

export const deleteTopics = async (topics) => {
  try {
    await admin.deleteTopics({
      topics,
    });
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

export const listTopics = async (topics = {}) => {
  try {
    const results = await admin.fetchTopicMetadata(topics);
    console.log(results, 'topic list');
    return results;
  } catch (err) {
    console.log(err);
  }
};
