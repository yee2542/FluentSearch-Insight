import { Module } from '@nestjs/common';
import { InsightService } from './insight.service';

@Module({
  providers: [InsightService]
})
export class InsightModule {}
