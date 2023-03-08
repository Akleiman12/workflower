import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe('getData', () => {
    it('should pass health check', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.ping()).toEqual('pong');
    });
  });
});
