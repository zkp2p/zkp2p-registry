import { ethers } from "ethers";

export const currencyKeccak256 = (inputString: string): string => {
  const bytes = ethers.utils.toUtf8Bytes(inputString);
  return ethers.utils.keccak256(bytes);
};
