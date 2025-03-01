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

const validateDepositData = async (processorIntentData: any) => {
  const cvu = processorIntentData.cvu as string;

  // Check if CVU is exactly 22 digits
  if (!/^\d{22}$/.test(cvu)) {
    throw new Error("Invalid Mercado Pago CVU: must be exactly 22 digits");
  }

  // Check if it starts with Mercado Pago prefix
  if (!cvu.startsWith("00000031")) {
    throw new Error("Invalid Mercado Pago CVU: must start with 00000031");
  }

  // Validate second block checksum (last 14 digits)
  const secondBlock = cvu.slice(8, 21);
  const secondChecksum = Number.parseInt(cvu[21]);
  if (!validateChecksum(secondBlock, secondChecksum, [3, 9, 7, 1, 3, 9, 7, 1, 3, 9, 7, 1, 3])) {
    throw new Error("Invalid Mercado Pago CVU: second block checksum failed");
  }

  return cvu;
}

const validateChecksum = (block: string, checksum: number, weights: number[]): boolean => {
  // Calculate weighted sum
  const weightedSum = block
    .split("")
    .map((digit, index) => Number.parseInt(digit) * weights[index])
    .reduce((sum, value) => sum + value, 0);

  // Calculate expected checksum: (10 - (weightedSum mod 10)) mod 10
  const expectedChecksum = (10 - (weightedSum % 10)) % 10;

  return checksum === expectedChecksum;
}

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
    getDepositData,
    validateDepositData
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