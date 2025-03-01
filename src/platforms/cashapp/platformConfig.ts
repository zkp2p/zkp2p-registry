import { PaymentPlatform, PaymentPlatformConfig } from "../../types";
import { Currency, CurrencyType } from "../../utils/currency";

const getQRCodeLink = (
  recipientId: string,
  sendCurrency?: CurrencyType,
  amountFiatToSend?: string
): string => {
  const formattedId = recipientId.startsWith('$') ? recipientId : `$${recipientId}`;
  return `https://cash.app/qr/${formattedId.substring(1)}?size=288&margin=0`;
};

// Helper function for deposit data
const getDepositData = (payeeDetails: string, telegramUsername?: string) => {
  return {
    cashtag: payeeDetails,
    telegramUsername: telegramUsername || ''
  };
};

// Helper function to parse extracted parameters from Cash App proof of payment
const parseExtractedParameters = (context: string) => {
  const contextObject = JSON.parse(context);
  const params = contextObject.extractedParameters;

  const date = new Date(Number(params.date));
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return {
    amount: params.amount,
    date: formattedDate,
    currency: params.currency_code,
    paymentPlatform: PaymentPlatform.CASHAPP,
    paymentId: params.paymentId,
    recipient: params.receiverId,
    intentHash: contextObject.contextMessage,
    providerHash: contextObject.providerHash
  };
};

const validateDepositData = async (depositData: { [key: string]: string }) => {
  const cashtag = depositData.cashtag;

  try {
    const response = await fetch(`https://cash.app/$${cashtag}`);
    const html = await response.text();

    // Extract the user ID using regex
    // Letters and numbers only allowed in cashtag
    const match = html.match(/<title>Pay \$([A-Za-z0-9]+) on Cash App/);
    if (!match) {
      throw new Error("Invalid Cashapp ID");
    }

    return match[1];
  } catch (error) {
    throw new Error(`Failed to get Cashapp ID for ${cashtag}`);
  }
}


export const cashappConfig: PaymentPlatformConfig = {
  platformId: PaymentPlatform.CASHAPP,
  platformName: 'Cash App',
  platformCurrencies: [Currency.USD],
  authLink: 'https://cash.app/account/activity',
  troubleScanningQRCodeLink: getQRCodeLink,
  getFormattedSendLink: getQRCodeLink,
  deposit: {
    payeeDetailInputPlaceholder: "Enter your Cashtag",
    payeeDetailInputHelperText: "This is your Cashtag. Please ensure you have set your Cashtag as discoverable by others. Do not include the $ symbol.",
    payeeDetailValidationFailureMessage: "Make sure you have set your Cashtag as discoverable by others. Do not include the $ symbol.",
    payeeIdKey: 'cashtag',
    getDepositData,
    validateDepositData
  },
  parseExtractedParameters,
  minFiatAmount: '0.1',   // 1 USD
  localeTimeString: 'en-US',
  useCustomQRCode: false,
  supportsAppclip: false,
  numPaymentsFetched: 15,
  showAppclipOnWeb: false,
  depositRequiresApproval: false,
  supportsSendingPaymentOnWeb: false,
  minExtensionVersion: '0.1.6'
}