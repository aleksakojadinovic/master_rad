import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { GenerativeAIInterceptor } from '../infrastructure/interceptors/generative-ai.interceptor';
import { UsersService } from 'src/app/users/domain/users.service';

@UseInterceptors(GenerativeAIInterceptor)
@Controller('generative-ai')
export class GenerativeAIController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get('/summarize')
  async findOne() {
    return { aaaaa: 'bbbbb' };
  }
}
