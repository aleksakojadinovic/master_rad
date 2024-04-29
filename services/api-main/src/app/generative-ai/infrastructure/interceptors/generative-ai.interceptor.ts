import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { NotAllowedToUseAIError } from '../../domain/errors/NotAllowedToUseAI';
import { TicketNotFoundError } from '../../domain/errors/TicketNotFound';
import { BadTicketStatusError } from '../../domain/errors/BadTicketStatus';
import { TicketTooShortError } from '../../domain/errors/TicketTooShort';
import { TicketTooLongError } from '../../domain/errors/TicketTooLong';
import { AIServiceDownError } from '../../domain/errors/AIServiceDown';

@Injectable()
export class GenerativeAIInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotAllowedToUseAIError) {
          throw new ForbiddenException(error.getPayload());
        }

        if (error instanceof TicketNotFoundError) {
          throw new NotFoundException(error.getPayload());
        }

        if (error instanceof BadTicketStatusError) {
          throw new UnprocessableEntityException(error.getPayload());
        }

        if (error instanceof TicketTooShortError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof TicketTooLongError) {
          throw new BadRequestException(error.getPayload());
        }

        if (error instanceof AIServiceDownError) {
          throw new InternalServerErrorException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
