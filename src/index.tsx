import { cashappConfig } from './platforms/cashapp/platformConfig';
import { revolutConfig } from './platforms/revolut/platformConfig';
import { venmoConfig } from './platforms/venmo/platformConfig';
import { wiseConfig } from './platforms/wise/platformConfig';
import { 
  PaymentPlatform, 
  PaymentPlatformConfig, 
  PaymentPlatformType, 
  paymentPlatforms, 
  ProofExtractedParameters 
} from './types';

import { 
  Currency, 
  CurrencyType, 
  currencies, 
  currencyInfo, 
  getCurrencyInfoFromHash, 
  getCurrencyInfoFromCountryCode, 
  isSupportedCurrency 
} from './utils/currency';

const paymentPlatformInfo: Record<string, PaymentPlatformConfig> = {
  [PaymentPlatform.CASHAPP]: cashappConfig,
  [PaymentPlatform.REVOLUT]: revolutConfig,
  [PaymentPlatform.VENMO]: venmoConfig,
  [PaymentPlatform.WISE]: wiseConfig,
};

export {
  // Currency exports
  Currency,
  CurrencyType,
  currencies,
  currencyInfo,
  getCurrencyInfoFromHash,
  getCurrencyInfoFromCountryCode,
  isSupportedCurrency,
  
  // Payment platform exports
  PaymentPlatform,
  PaymentPlatformType,
  paymentPlatforms,
  paymentPlatformInfo,
  ProofExtractedParameters,
};
