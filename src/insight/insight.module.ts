import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { INSIGHT_SCHEMA_NAME } from 'fluentsearch-types';
import insightSchema from 'fluentsearch-types/dist/entity/insight.entity';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { InsightInitService } from './insight.init.service';
import { InsightService } from './insight.service';
const InsightEndpoint = HttpModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    timeout: 3000 * 1000,
    maxRedirects: 5,
    baseURL: configService.get().ml_endpoint,
    responseType: 'json',
  }),
});
@Module({
  imports: [
    InsightEndpoint,
    MongooseModule.forFeature([
      {
        name: INSIGHT_SCHEMA_NAME,
        schema: insightSchema,
      },
    ]),
  ],
  providers: [InsightService, InsightInitService],
  exports: [InsightEndpoint, InsightService],
})
export class InsightModule {}
