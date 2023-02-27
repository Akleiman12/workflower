import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}
  @Get()
  getAll() {
    return this.workflowService.findAll()
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.workflowService.findById(id);
  }

  @Post('create')
  create(@Body() body) {
    // ...
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    // ...
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    // ...
  }
}
