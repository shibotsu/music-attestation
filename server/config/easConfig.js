import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

// Initialize the SDK with the address of the EAS Attestation contract
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
//const provider = ethers.getDefaultProvider("sepolia"); this loads alchemy (monthly limit exceeded?)
const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/654c3c8fff2049099cb390b5c994a230"
);

// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
eas.connect(provider);

export { eas, provider }; // Export the `eas` instance and provider
