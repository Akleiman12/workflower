import { Controller, Get } from '@nestjs/common';


@Controller()
export class AppController {

  //Health Check
  @Get('ping')
  ping() {
    return 'pong';
  }
}
