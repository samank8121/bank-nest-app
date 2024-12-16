import { Injectable } from '@nestjs/common';

export const messages = {
  account: {
    accountInfo: 'Account: {iban}',
    create: 'create account.',
    deposit: 'deposit.',
    withdraw: 'withdraw',
    invalidIban: 'Invalid IBAN',
  },
  errors: {
    general: 'There is a problem, contact support service',
  },
} as const;

export type MessageKey = keyof typeof messages;
export type NestedMessageKey<T extends MessageKey> = keyof (typeof messages)[T];

@Injectable()
export class MessagesService {
  private static instance: MessagesService;

  private constructor() {}

  static getInstance(): MessagesService {
    if (!MessagesService.instance) {
      MessagesService.instance = new MessagesService();
    }
    return MessagesService.instance;
  }
  getMessage<T extends MessageKey>(
    category: T,
    key: NestedMessageKey<T>,
    params?: Record<string, string | number>
  ): string {
    let message = messages[category][key] as string;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, String(value));
      });
    }

    return message;
  }
}
export const messagesService = MessagesService.getInstance();