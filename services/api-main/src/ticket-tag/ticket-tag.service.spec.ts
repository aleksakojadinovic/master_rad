import { Test, TestingModule } from '@nestjs/testing';
import { TicketTagService } from './ticket-tag.service';

describe('TicketTagService', () => {
  let service: TicketTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketTagService],
    }).compile();

    service = module.get<TicketTagService>(TicketTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
