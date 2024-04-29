import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { NotAllowedToUseAIError } from '../../domain/errors/NotAllowedToUseAI';

@Injectable()
export class GenerativeAIInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotAllowedToUseAIError) {
          throw new ForbiddenException(error.getPayload());
        }

        throw error;
      }),
    );
  }
}
