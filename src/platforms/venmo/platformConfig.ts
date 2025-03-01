import { PaymentPlatform, PaymentPlatformConfig } from "../../types";
import { Currency, CurrencyType } from "../../utils/currency";

// Helper function for web links
const getTroubleScanningSendLink = (
  recipientId: string,
  sendCurrency?: CurrencyType,
  amountFiatToSend?: string
) => `https://account.venmo.com/pay?recipients=${recipientId}&note=💵&amount=${amountFiatToSend}`;

// Helper function for app links
const getFormattedSendLink = (
  recipientId: string,
  sendCurrency?: CurrencyType,
  amountFiatToSend?: string
) => `venmo://paycharge?txn=pay&recipients=${recipientId}&note=💵&amount=${amountFiatToSend}`;

// Helper function for deposit data
const getDepositData = (payeeDetails: string, telegramUsername?: string) => {
  return {
    venmoUsername: payeeDetails,
    telegramUsername: telegramUsername || ''
  };
};

// Helper function for payment warning
const sendPaymentWarning = (sendCurrency: CurrencyType, amountFiatToSend: string) => {
  return `Please do NOT toggle the "Turn on for purchases" option`;
};

// Helper function to parse extracted parameters
const parseExtractedParameters = (context: string) => {
  const contextObject = JSON.parse(context);
  const params = contextObject.extractedParameters;

  const date = new Date(params.date + 'Z');
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const amount = (Number(params.amount.replace('-', ''))).toString();

  return {
    amount: amount,
    date: formattedDate,
    currency: 'USD',
    paymentPlatform: PaymentPlatform.VENMO,
    paymentId: params.paymentId,
    recipient: params.receiverId,
    intentHash: contextObject.contextMessage,
    providerHash: contextObject.providerHash
  };
};

// Helper function to validate deposit data
const validateDepositData = async (depositData: { [key: string]: string }) => {
  const venmoHandle = depositData.venmoUsername;

  try {
    const response = await fetch(`https://account.venmo.com/u/${venmoHandle}`);
    const html = await response.text();

    // Extract the user ID using regex
    const match = html.match(/"user":\{"displayName":"[^"]*","id":"(\d+)"/);
    if (!match) {
      throw new Error("Invalid Venmo ID");
    }

    return match[1];
  } catch (error) {
    throw new Error(`Failed to get Venmo ID for ${venmoHandle}`);
  }
}

export const venmoConfig: PaymentPlatformConfig = {
  platformId: PaymentPlatform.VENMO,
  platformName: 'Venmo',
  platformCurrencies: [Currency.USD],
  troubleScanningQRCodeLink: getTroubleScanningSendLink,
  getFormattedSendLink,
  minFiatAmount: '0.1',   // 1 USD
  authLink: 'https://account.venmo.com/?feed=mine',
  localeTimeString: 'en-US',
  deposit: {
    payeeDetailInputPlaceholder: "Enter your Venmo username",
    payeeDetailInputHelperText: "This is your Venmo username",
    payeeDetailValidationFailureMessage: "Make sure there are no typos in your username. Do not include the @",
    getDepositData,
    validateDepositData
  },
  parseExtractedParameters,
  useCustomQRCode: true,
  numPaymentsFetched: 10,
  supportsAppclip: false,
  showAppclipOnWeb: false,
  depositRequiresApproval: false,
  supportsSendingPaymentOnWeb: true,
  sendPaymentWarning,
  minExtensionVersion: '0.1.6'
};