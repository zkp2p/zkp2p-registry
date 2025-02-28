import { PaymentPlatform, PaymentPlatformConfig } from "../../types";
import { Currency, CurrencyType } from "../../utils/currency";

// Helper function for links
const getFormattedLink = (
  recipientId: string,
  sendCurrency?: CurrencyType,
  amountFiatToSend?: string
) => `https://www.mercadopago.com.ar/money-out/transfer/`;

// Helper function for deposit data
const getDepositData = (payeeDetails: string, telegramUsername?: string) => {
  return {
    cvu: payeeDetails,
    telegramUsername: telegramUsername || ''
  };
};

// Helper function for payment warning
const sendPaymentWarning = (sendCurrency: CurrencyType, amountFiatToSend: string) => {
  return `Double check the CVU`;
};

// Helper function to parse extracted parameters
const parseExtractedParameters = (context: string) => {
  const contextObject = JSON.parse(context);
  const params = contextObject.extractedParameters;

  const date = new Date(params.date);
  const formattedDate = date.toLocaleString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'America/Argentina/Buenos_Aires'
  });

  const amount = (Number(params.amt.replace('-', ''))).toString();

  return {
    amount: amount,
    date: formattedDate,
    currency: params.curr,
    paymentPlatform: PaymentPlatform.MERCADO_PAGO,
    paymentId: params.paymentId,
    recipient: params.recipientId,
    intentHash: contextObject.contextMessage,
    providerHash: contextObject.providerHash
  };
};

export const mercadoPagoConfig: PaymentPlatformConfig = {
  platformId: PaymentPlatform.MERCADO_PAGO,
  platformName: 'Mercado Pago',
  platformCurrencies: [Currency.ARS],
  authLink: 'https://www.mercadopago.com.ar/home',
  troubleScanningQRCodeLink: getFormattedLink,
  getFormattedSendLink: getFormattedLink,
  deposit: {
    payeeDetailInputPlaceholder: "Enter your Mercado Pago CVU",
    payeeDetailInputHelperText: "This is your Mercado Pago CVU. You can find it in your Mercado Pago account.",
    payeeDetailValidationFailureMessage: "Make sure there are no typos.",
    getDepositData
  },
  sendPaymentWarning,
  parseExtractedParameters,
  minFiatAmount: '1',   // 1 ARS
  localeTimeString: 'es-AR',
  useCustomQRCode: true,
  supportsAppclip: true,
  showAppclipOnWeb: true,
  numPaymentsFetched: 20,
  depositRequiresApproval: false,
  supportsSendingPaymentOnWeb: true,
  minExtensionVersion: '0.1.10'
}