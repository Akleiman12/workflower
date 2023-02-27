import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [],
      synchronize: true,
    }),
    WorkflowModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
