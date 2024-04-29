import {
  BadRequestException,
  Controller,
  Get,
  Query,
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
import { GenerativeAIService } from '../domain/generative-ai.service';
import { isValidObjectId } from 'mongoose';

@UseInterceptors(GenerativeAIInterceptor)
@Controller('generative-ai')
export class GenerativeAIController {
  constructor(
    private readonly usersService: UsersService,
    private readonly generativeAIService: GenerativeAIService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get('/summarize')
  @UseGuards(AuthGuard('jwt'), ExtractUserInfo)
  async findOne(
    @GetUserInfo() user: User,
    @Query('ticketId') ticketId: string,
  ) {
    if (!ticketId || !isValidObjectId(ticketId)) {
      throw new BadRequestException('Invalid ticket id');
    }

    const response = await this.generativeAIService.summarize(ticketId, user);

    return response;
  }
}
