import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './workflow.controller';
import { WorkflowEntity } from './workflow.entity';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowEntity])
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class AppModule {}
