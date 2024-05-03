import { BaseError } from 'src/codebase/errors/BaseError';

export class AIServiceDownError extends BaseError {
  constructor() {
    super(
      'AI service is temporarily down, please contact the administrator or try again later',
    );
  }
}
