import { Test, TestingModule } from '@nestjs/testing';
import { TicketTagController } from './ticket-tag.controller';
import { TicketTagService } from './ticket-tag.service';

describe('TicketTagController', () => {
  let controller: TicketTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketTagController],
      providers: [TicketTagService],
    }).compile();

    controller = module.get<TicketTagController>(TicketTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
