import { PaymentPlatform, PaymentPlatformConfig } from "../../types";
import { Currency, CurrencyType, currencyInfo } from "../../utils/currency";

// Helper function for links
const getFormattedSendLink = (
  recipientId: string,
  sendCurrency?: CurrencyType,
  amountFiatToSend?: string
) => `https://revolut.me/${recipientId}`;

// Helper function for deposit data
const getDepositData = (payeeDetails: string, telegramUsername?: string) => {
  return {
    revolutUsername: payeeDetails,
    telegramUsername: telegramUsername || ''
  };
};

// Helper function for payment warning
const sendPaymentWarning = (sendCurrency: CurrencyType, amountFiatToSend: string) => {
  return `Ensure you are sending ${currencyInfo[sendCurrency].currencyCode} and not performing a cross-currency swap.`;
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
    paymentPlatform: PaymentPlatform.REVOLUT,
    paymentId: params.id,
    recipient: params.username,
    intentHash: contextObject.contextMessage,
    providerHash: contextObject.providerHash
  };
};

const validateDepositData = async (depositData: { [key: string]: string }) => {
  const revolutHandle = depositData.revolutUsername;

  try {
    const response = await fetch(`https://revolut.me/api/web-profile/${revolutHandle}`);
    const json = await response.json();

    // Extract the user ID using regex
    if (json.username !== revolutHandle) {
      throw new Error("Invalid Revolut ID");
    }

    return json.username;
  } catch (error) {
    throw new Error(`Failed to get Revolut ID for ${revolutHandle}`);
  }
}

export const revolutConfig: PaymentPlatformConfig = {
  platformId: PaymentPlatform.REVOLUT,
  platformName: 'Revolut',
  platformCurrencies: [
    Currency.USD,
    Currency.EUR,
    Currency.GBP,
    Currency.SGD,
    Currency.NZD,
    Currency.AUD,
    Currency.CAD,
    Currency.HKD,
    Currency.MXN,
    Currency.SAR,
    Currency.AED,
    Currency.THB,
    Currency.TRY,
    Currency.PLN,
    Currency.CHF,
    Currency.ZAR,
  ],
  authLink: 'https://app.revolut.com/home',
  troubleScanningQRCodeLink: getFormattedSendLink,
  getFormattedSendLink,
  deposit: {
    payeeDetailInputPlaceholder: "Enter your Revtag",
    payeeDetailInputHelperText: "This is your Revtag. Make sure you have set your Revtag to be publicly discoverable.",
    payeeDetailValidationFailureMessage: "Make sure you have set your Revtag to be publicly discoverable and there are no typos.",
    getDepositData,
    validateDepositData
  },
  sendPaymentWarning,
  parseExtractedParameters,
  minFiatAmount: '0.1',   // 1 USD/EUR/GBP
  localeTimeString: 'en-US',
  useCustomQRCode: true,
  supportsAppclip: true,
  numPaymentsFetched: 20,
  showAppclipOnWeb: true,
  depositRequiresApproval: false,
  supportsSendingPaymentOnWeb: false,
  minExtensionVersion: '0.1.9'
}