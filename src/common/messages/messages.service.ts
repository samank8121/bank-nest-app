import { Injectable } from '@nestjs/common';

export const messages = {
  account: {
    accountInfo: 'Account: {iban}',
    create: 'create account.',
    deposit: 'deposit',
    withdraw: 'withdraw',
    transfer: 'transfer',
    number: '{item} must be a number',
    string: '{item} must be a string',
    positive: '{item} must be a positive amount',
    balance: 'Balance',
    accountId: 'Account Id',
    userId: 'User Id',
    amount: 'Amount',
  },
  errors: {
    general: 'There is a problem, contact support service',
    notFound: 'Not found',
    required: 'This field is mandatory',
    credential: 'Credentials incorrect',
    failedTo: 'Failed to {name}',
    account:{
      insufficientFund: 'Insufficient funds',
      invalidIban: 'Invalid IBAN',
      sameAccount: 'You are sending to yourself!!',
    }
  },
  swagger: {
    account: {
      balance: "Balance of account",
      get: {
        summary: 'get an account',
        success: 'account found',
        failed: 'invalid data',
      },
      create: {
        summary: 'add an account',
        success: 'account added successfully',
        failed: 'invalid data',
      },
      deposit: {
        summary: 'deposit to an account',
        success: 'Deposit successful',
        failed: 'invalid data',
        amount: 'Deposit amount',
      },
      withdraw: {
        summary: 'withdraw from an account',
        success: 'Withdrawal successful',
        failed: 'invalid data',
        amount: 'Withdraw amount',        
      },
      transfer: {
        summary: 'transfer from one account to another',
        success: 'Transfered successfully',
        failed: 'invalid data',
        balance: "Balance of sender account",
        iban: 'Iban to which the amount will be transferred',
        transferAmount: 'Transfer amount',
      }
    }
  }
} as const;

export type MessageKey = keyof typeof messages;
export type NestedMessageKey<T extends MessageKey> = keyof (typeof messages)[T];
export type ThirdLevelKey<T extends MessageKey, U extends NestedMessageKey<T>> = keyof (typeof messages)[T][U];
export type FourthLevelKey<
  T extends MessageKey,
  U extends NestedMessageKey<T>,
  V extends ThirdLevelKey<T, U>
> = keyof (typeof messages)[T][U][V];

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
  ): string;
  getMessage<
    T extends MessageKey,
    U extends NestedMessageKey<T>,
    V extends ThirdLevelKey<T, U>
  >(
    category: T,
    subCategory: U,
    key: V,
    params?: Record<string, string | number>
  ): string;
  getMessage<
    T extends MessageKey,
    U extends NestedMessageKey<T>,
    V extends ThirdLevelKey<T, U>,
    W extends FourthLevelKey<T, U, V>
  >(
    category: T,
    subCategory: U,
    key: V,
    finalKey: W,
    params?: Record<string, string | number>
  ): string;
  getMessage<
    T extends MessageKey,
    U extends NestedMessageKey<T>,
    V extends ThirdLevelKey<T, U>,
    W extends FourthLevelKey<T, U, V>
  >(
    category: T,
    subCategoryOrKey: U | NestedMessageKey<T>,
    keyOrParams?: V | Record<string, string | number>,
    finalKeyOrParams?: W | Record<string, string | number>,
    params?: Record<string, string | number>
  ): string {
    let message: string;

    if (typeof keyOrParams === 'object' || keyOrParams === undefined) {
      // Two-level message
      message = messages[category][subCategoryOrKey as NestedMessageKey<T>] as string;
      params = keyOrParams as Record<string, string | number>;
    } else if (typeof finalKeyOrParams === 'object' || finalKeyOrParams === undefined) {
      // Three-level message
      message = messages[category][subCategoryOrKey as U][keyOrParams as V] as string;
      params = finalKeyOrParams as Record<string, string | number>;
    } else {
      // Four-level message
      message = messages[category][subCategoryOrKey as U][keyOrParams as V][finalKeyOrParams as W] as string;
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, String(value));
      });
    }

    return message;
  }
}

export const messagesService = MessagesService.getInstance();