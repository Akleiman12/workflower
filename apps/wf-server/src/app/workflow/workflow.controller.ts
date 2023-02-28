import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WorkflowCreateDTO } from './dtos/workflow-create.dto';
import { WorkflowUpdateDTO } from './dtos/workflow-update.dto';
import { WorkflowService } from './workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}
  @Get()
  getAll() {
    return this.workflowService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.workflowService.findById(id);
  }

  @Post('create')
  create(@Body() body: WorkflowCreateDTO) {
    return this.workflowService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: WorkflowUpdateDTO) {
    return this.workflowService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.workflowService.delete(id);
  }
}
