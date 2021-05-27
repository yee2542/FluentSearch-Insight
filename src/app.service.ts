import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import amqplib from 'amqplib';
import {
  ACK_TASK_QUEUE,
  TaskDTO,
  WORKER_INSIGHT_QUEUE,
} from 'fluentsearch-types';
import { InsightService } from './insight/insight.service';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly insightService: InsightService,
  ) {}
  async onModuleInit() {
    const config = this.configService.get().rabbitmq;
    const connectionString = `amqp://${config.username}:${config.password}@${config.endpoint}:5672`;
    const mq = await amqplib.connect(connectionString);
    const channel = await mq.createChannel();
    channel.prefetch(1);

    channel.consume(
      WORKER_INSIGHT_QUEUE,
      async (msg) => {
        try {
          const payload = JSON.parse(msg?.content.toString() || '') as TaskDTO;
          if (!payload) throw Error('Bad queue parsing');
          Logger.verbose(payload, 'WORKER_INSIGHT_QUEUE');
          payload.uri &&
            payload.fileId &&
            (await this.insightService.predAllModel(
              payload.fileId,
              payload.uri,
            ));
          msg && channel.ack(msg);
          // send to ack queue
          channel.sendToQueue(
            ACK_TASK_QUEUE,
            Buffer.from(JSON.stringify(payload)),
          );
        } catch (err) {
          msg && channel.nack(msg);
          Logger.error(err);
        }
      },
      { noAck: false },
    );
  }

  getHello(): string {
    return 'Hello World!';
  }
}
