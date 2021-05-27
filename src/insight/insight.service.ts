import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeepDetectRequestAPI,
  DeepDetectResponseAPI,
  FileTypeEnum,
  InsightDocument,
  InsightSchema,
  INSIGHT_SCHEMA_NAME,
  LanguageEnum,
  ModelEnum,
} from 'fluentsearch-types';
import { Model } from 'mongoose';

@Injectable()
export class InsightService {
  constructor(
    private insightEndpoint: HttpService,
    @InjectModel(INSIGHT_SCHEMA_NAME)
    private readonly insightModel: Model<InsightDocument>,
  ) {}

  async createInsightDoc(data: Omit<InsightSchema, '_id'>) {
    return this.insightModel.create(data);
  }

  async predAllModel(fileId: string, uri: string) {
    const allModel: ModelEnum[] = [
      ModelEnum.classification_21k,
      ModelEnum.detection_600,
      ModelEnum.places,
      ModelEnum.ilsvrc_googlenet,
    ];
    for (const m of allModel) {
      await this.predict(fileId, uri, m);
    }
  }

  private async predict(fileId: string, uri: string, model: ModelEnum) {
    const MODEL_ENDPOINT = model;

    const payload: DeepDetectRequestAPI = {
      service: MODEL_ENDPOINT,
      parameters: {
        output: {
          confidence_threshold: 0.2,
          bbox: true,
        },
        mllib: {
          gpu: false,
        },
      },
      data: [uri],
    };

    try {
      const res = (
        await this.insightEndpoint.post('/predict', payload).toPromise()
      ).data as DeepDetectResponseAPI;
      const { body } = res;

      const now = new Date();
      const predictions = body.predictions;
      for (const pred of predictions) {
        Logger.verbose(
          pred.classes + '[' + MODEL_ENDPOINT + ']',
          'InsightService',
        );
        for (const classPred of pred.classes) {
          await this.createInsightDoc({
            fileId,
            keyword: classPred.cat,
            result: classPred.cat.toLocaleLowerCase(),
            model: MODEL_ENDPOINT,
            bbox: classPred.bbox,
            prob: classPred.prob,
            lang: LanguageEnum.enus,
            fileType: FileTypeEnum.Image,
            createAt: now,
            updateAt: now,
          });
        }
      }
    } catch (err) {
      Logger.error(err);
    }
    return;
  }
}
