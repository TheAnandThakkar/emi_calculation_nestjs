import { Test, TestingModule } from '@nestjs/testing';
import { EmiService } from './emi.service';

describe('EmiService', () => {
  let service: EmiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmiService],
    }).compile();

    service = module.get<EmiService>(EmiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
