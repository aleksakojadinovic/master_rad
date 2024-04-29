import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/codebase/BaseService';

@Injectable()
export class GenerativeAIService extends BaseService {
  constructor() {
    super();
  }
}
