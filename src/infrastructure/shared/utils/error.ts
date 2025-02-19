import type { ZodError, ZodFormattedError } from 'zod';

export const formatZodErrors = (error: ZodError): string => {
  const formattedErrors: string[] = [];

  const extractFirstError = (errorObj: ZodFormattedError<unknown>, path: string = ''): void => {
    if (errorObj._errors?.length) {
      const errorMessage = (
        path ? `${path}: ${errorObj._errors[0]}` : errorObj._errors[0]
      ) as string;
      formattedErrors.push(errorMessage);
      return;
    }

    for (const [key, value] of Object.entries(errorObj)) {
      if (key !== '_errors' && value && typeof value === 'object') {
        const nestedPath = path ? `${path}.${key}` : key;
        extractFirstError(value as unknown as ZodFormattedError<unknown>, nestedPath);
        if (formattedErrors.length) return;
      }
    }
  };

  const formattedError = error.format();
  extractFirstError(formattedError);

  return formattedErrors[0] || 'Validation error';
};
