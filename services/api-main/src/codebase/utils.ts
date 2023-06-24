import { Request } from 'express';
import { parse } from 'accept-language-parser';

export function resolveLanguageCode(req: Request) {
  const cookieValue = req.cookies['language_code'];
  const headerValue = req.headers['accept-language'];

  if (cookieValue) {
    // Validate
    return cookieValue;
  }

  const parsedLanguages = parse(headerValue);
  if (parsedLanguages.length === 0) {
    return 'en';
  }
  return parsedLanguages[0].code;
}
