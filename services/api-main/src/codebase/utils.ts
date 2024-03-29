import { Request } from 'express';
import { parse } from 'accept-language-parser';
import { PaginatedValue } from './types/PaginatedValue';

export function resolveLanguageCode(req: Request) {
  const headerValue = req.headers['accept-language'];

  const parsedLanguages = parse(headerValue);
  if (parsedLanguages.length === 0) {
    return 'en';
  }

  const code = parsedLanguages[0].code;

  if (!['en', 'sr'].includes(code)) {
    return 'en';
  }

  return parsedLanguages[0].code;
}

export function createPaginatedResponse<T>(
  entities: T[],
  page: number,
  perPage: number,
  count: number,
): PaginatedValue<T> {
  return {
    entities,
    page,
    perPage,
    totalEntities: count,
    totalPages: Math.ceil(count / perPage),
  };
}
