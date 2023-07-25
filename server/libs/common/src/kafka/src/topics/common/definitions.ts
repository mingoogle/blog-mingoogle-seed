import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CommonKafkaSchema {
  @IsNumber()
  eventTime: number;

  @IsString()
  @IsOptional()
  traceId?: string;
}
