import { NAME } from '../../../../../constants/index';
const KAFKA_TOPICS = NAME.KAFKA.TOPICS;

/**,
 * workflow 가 없으면 어떤 토픽이 어디서 생성하고 어디서 컨슘하는지 한번에 확인하기 어려움
 * workflow 를 생성하여 핸들링 관점에서 만들어 놓음
 * 1. server type(name)
 * 2. producer/consumer type
 * 3. 토픽을 생성하거나 컨슘하는 곳의 모듈(폴더명)
 * 4. full file path ( 토픽 생성 및 컨슘하는 파일명)
 * 5. topic
 */
export const workflow = {
  auth: { // 1
    producer: {}, // 2
    consumer: { // 2
      app: { // 3
        '/app.kafka.controller': { // 4
          KAFKA_TOPIC_MESSAGE: KAFKA_TOPICS.KAFKA_TOPIC_MESSAGE, // 5
        },
      },
    },
  },
  main: {
    producer: {
      app: {
        '/app.controller': {
          KAFKA_TOPIC_MESSAGE: KAFKA_TOPICS.KAFKA_TOPIC_MESSAGE,
        },
      },
    },
    consumer: {
      user: {},
    },
  },
};
