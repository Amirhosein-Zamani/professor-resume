import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('returns service health and the current application version', () => {
      const result = appController.health();

      expect(result.status).toBe('ok');
      expect(result.service).toBe('professor-resume-api');
      expect(result.version).toBe('1.1.0');
      expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
    });
  });
});
