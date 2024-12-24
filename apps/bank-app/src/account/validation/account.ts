import { z } from 'zod';
import { isValidIBAN } from './valid-iban';

export const createAccountSchema = (getMessage) =>
  z.object({
    iban: z
      .string({ message: getMessage('account', 'invalidIban') })
      .min(1, { message: getMessage('account', 'invalidIban') })
      .refine((d) => isValidIBAN(d), {
        message: getMessage('account', 'invalidIban'),
      }),
    balance: z
      .number()
      .positive({ message: getMessage('account', 'positiveAmount') })
      .refine((value) => Number.isFinite(value), {
        message: getMessage('account', 'positiveAmount'),
      })
  });

export type CreateAccountDto = z.infer<ReturnType<typeof createAccountSchema>>;
