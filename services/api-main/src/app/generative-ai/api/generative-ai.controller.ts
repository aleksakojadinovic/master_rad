import {
  Controller,
  ForbiddenException,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { GenerativeAIInterceptor } from '../infrastructure/interceptors/generative-ai.interceptor';
import { UsersService } from 'src/app/users/domain/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserInfo } from 'src/codebase/guards/user.guard';
import { GetUserInfo } from 'src/codebase/decorators/user.decorator';
import { User } from 'src/app/users/domain/entities/user.entity';

@UseInterceptors(GenerativeAIInterceptor)
@Controller('generative-ai')
export class GenerativeAIController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get('/summarize')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findOne(@GetUserInfo() user: User) {
    if (!user.canUseAI) {
      throw new ForbiddenException();
    }
    return { aaaaa: 'bbbbb' };
  }
}
