import { createTopics, adminConnect, deleteTopics } from '../kafka';

const topics = [
  {
    topic: 'kafka-topic-message',
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
