import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //Health Check
  @Get('ping')
  ping() {
    return 'pong';
  }

  // Workflow endpoints

  @Get('workflows')
  getWorkflows() {
    // ...
  }

  @Get('workflows/:id')
  getWorkflowById(@Param('id') id: string) {
    // ...
  }

  @Post('workflows/create')
  createWorkflow(@Body() body) {
    // ...
  }

  @Put('workflows/:id')
  updateWorkflow(@Param('id') id: string, @Body() body) {
    // ...
  }

  @Delete('workflows/:id')
  deleteWorkflow(@Param('id') id: string) {
    // ...
  }
}
