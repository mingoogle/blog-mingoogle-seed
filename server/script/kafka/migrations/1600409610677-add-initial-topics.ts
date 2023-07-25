import { createTopics, adminConnect, deleteTopics } from '../kafka';

import { NAME } from '../../../libs/constants';

const { NODE_ENV } = process.env;
const TOPIC_ENV = !NODE_ENV || NODE_ENV === 'local' ? 'development' : NODE_ENV;

function setTopicByEnvironment(topicName: string): string {
  const result =
    TOPIC_ENV === 'production' ? topicName : `${TOPIC_ENV}.${topicName}`;
  return result;
}

const topics = [
  {
    topic: setTopicByEnvironment(NAME.KAFKA.TOPICS.KAFKA_TOPIC_MESSAGE),
  },
];

export const up = async () => {
  await adminConnect();
  await createTopics(topics);
};

export const down = async () => {
  const deleteTopicList = topics.map((topic) => topic.topic);
  await deleteTopics(deleteTopicList);
};
