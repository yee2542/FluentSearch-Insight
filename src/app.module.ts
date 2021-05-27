import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDatabaseService } from './config/config.database.service';
import { ConfigModule } from './config/config.module';
import { InsightModule } from './insight/insight.module';

@Module({
  imports: [
    ConfigModule,
    InsightModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ConfigDatabaseService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
