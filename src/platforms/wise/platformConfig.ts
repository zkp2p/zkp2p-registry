import { PaymentPlatform, PaymentPlatformConfig } from "../../types";
import { Currency, CurrencyType, currencyInfo } from "../../utils/currency";

// Helper function for links
const getFormattedSendLink = (
  recipientId: string,
  sendCurrency?: CurrencyType,
  amountFiatToSend?: string
) => `https://wise.com/pay/me/${recipientId}`;

// Helper function for deposit data
const getDepositData = (payeeDetails: string, telegramUsername?: string) => {
  return {
    wisetag: payeeDetails,
    telegramUsername: telegramUsername || ''
  };
};

// Helper function for payment warning
const sendPaymentWarning = (sendCurrency: CurrencyType, amountFiatToSend: string) => {
  return `You can send any currency. But ensure recipient gets ${currencyInfo[sendCurrency].currencyCode} ${amountFiatToSend} after fees.`;
};

// Helper function to parse extracted parameters
const parseExtractedParameters = (context: string) => {
  const contextObject = JSON.parse(context);
  const params = contextObject.extractedParameters;

  const date = new Date(Number(params.completedDate));
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const amount = (Number(params.amount.replace('-', '')) / 100).toString();

  return {
    amount: amount,
    date: formattedDate,
    currency: params.currency,
    paymentPlatform: PaymentPlatform.WISE,
    paymentId: params.id,
    recipient: params.username,
    intentHash: contextObject.contextMessage,
    providerHash: contextObject.providerHash
  };
};

export const wiseConfig: PaymentPlatformConfig = {
  platformId: PaymentPlatform.WISE,
  platformName: 'Wise',
  platformCurrencies: [
    Currency.USD,
    Currency.CNY,
    Currency.EUR,
    Currency.GBP,
    Currency.AUD,
    Currency.NZD,
    Currency.CAD,
    Currency.AED,
    Currency.CHF,
    Currency.ZAR,
    Currency.SGD,
    Currency.ILS,
    Currency.HKD,
    Currency.JPY,
    Currency.PLN,
    Currency.TRY,
    Currency.IDR,
    Currency.KES,
    Currency.MYR,
    Currency.MXN,
    Currency.THB,
    Currency.VND,
  ],
  authLink: 'https://wise.com/all-transactions?direction=OUTGOING',
  troubleScanningQRCodeLink: getFormattedSendLink,
  getFormattedSendLink,
  deposit: {
    payeeDetailInputPlaceholder: "Enter your Wisetag",
    payeeDetailInputHelperText: "This is your Wisetag. Do not include the @ symbol.",
    payeeDetailValidationFailureMessage: "Make sure there are no typos. Do not include the @ symbol.",
    getDepositData
  },
  sendPaymentWarning,
  parseExtractedParameters,
  localeTimeString: 'en-US',
  minFiatAmount: '0.1',   // 1 USD
  useCustomQRCode: true,
  supportsAppclip: false,
  numPaymentsFetched: 20,
  showAppclipOnWeb: false,
  depositRequiresApproval: true,
  supportsSendingPaymentOnWeb: true,
  minExtensionVersion: '0.1.6'
}