import { CurrencyType } from '../utils/currency';

export const PaymentPlatform = {
  VENMO: "venmo",
  CASHAPP: "cashapp",
  REVOLUT: "revolut",
  WISE: "wise",
  MERCADO_PAGO: "mercado_pago",
};

export const paymentPlatforms = [
  PaymentPlatform.VENMO,
  PaymentPlatform.CASHAPP,
  PaymentPlatform.REVOLUT,
  PaymentPlatform.WISE,
  PaymentPlatform.MERCADO_PAGO,
];

export interface ProofExtractedParameters {
  amount: string;
  recipient: string;
  currency: string;
  paymentPlatform: string;
  date: string;
  paymentId: string;
  intentHash: string;
  providerHash: string;
}

export type PaymentPlatformType = typeof PaymentPlatform[keyof typeof PaymentPlatform];

export interface PaymentPlatformConfig {
  platformId: PaymentPlatformType;
  platformName: string;
  platformCurrencies: CurrencyType[];
  authLink: string;
  troubleScanningQRCodeLink: (
    recipientId: string,
    sendCurrency?: CurrencyType,
    amountFiatToSend?: string
  ) => string;
  getFormattedSendLink: (
    recipientId: string,
    sendCurrency?: CurrencyType,
    amountFiatToSend?: string
  ) => string;
  deposit: {
    payeeDetailInputPlaceholder: string;
    payeeDetailInputHelperText: string;
    payeeDetailValidationFailureMessage: string;
    getDepositData: (payeeDetails: string, telegramUsername?: string) => { [key: string]: string };
  };
  sendPaymentWarning?: (sendCurrency: CurrencyType, amountFiatToSend: string) => string;
  parseExtractedParameters: (parameters: string) => ProofExtractedParameters;
  numPaymentsFetched: number;
  minFiatAmount: string;
  localeTimeString: string;
  useCustomQRCode: boolean;
  supportsAppclip: boolean;
  showAppclipOnWeb: boolean;
  depositRequiresApproval: boolean;
  supportsSendingPaymentOnWeb: boolean;
  minExtensionVersion: string;
};