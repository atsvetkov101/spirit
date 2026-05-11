import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const appProviders = [
      {
        provide: AppService,
        useValue: {
          getHello: () => 'Hello World!',
        },
      },
    ];
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: appProviders,
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});