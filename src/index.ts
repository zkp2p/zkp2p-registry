// Group related imports together
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

// Import platform configs
import { cashappConfig } from './platforms/cashapp/platformConfig';
import { mercadoPagoConfig } from './platforms/mercado_pago/platformConfig';
import { revolutConfig } from './platforms/revolut/platformConfig';
import { venmoConfig } from './platforms/venmo/platformConfig';
import { wiseConfig } from './platforms/wise/platformConfig';

// Create platform info map
const paymentPlatformInfo: Record<string, PaymentPlatformConfig> = {
  [PaymentPlatform.CASHAPP]: cashappConfig,
  [PaymentPlatform.REVOLUT]: revolutConfig,
  [PaymentPlatform.VENMO]: venmoConfig,
  [PaymentPlatform.WISE]: wiseConfig,
  [PaymentPlatform.MERCADO_PAGO]: mercadoPagoConfig,
};

// Export everything in organized groups
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