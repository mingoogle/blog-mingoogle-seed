import { IsString } from 'class-validator';

import { CommonKafkaSchema } from './common/definitions';

export class KafkaTopicMessage extends CommonKafkaSchema {
  @IsString()
  name: string;

  @IsString()
  title: string;
}
