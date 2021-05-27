import { HttpService, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModelEnum } from 'fluentsearch-types';
import { INIT_ML } from './constant';

@Injectable()
export class InsightInitService implements OnModuleInit {
  constructor(private insightEndpoint: HttpService) {}
  async onModuleInit() {
    for (const ml of INIT_ML) {
      Logger.verbose('Init ML :' + ml.model, 'InsightInitService');
      await this.create(ml.model, ml.payload);
    }
  }

  private async create(model: ModelEnum, payload: any) {
    try {
      const res = await this.insightEndpoint
        .put('/services/' + model, payload)
        .toPromise();
      Logger.verbose(res.status, 'InsightInitService');
    } catch (err) {
      Logger.error(err);
    }
  }
}
