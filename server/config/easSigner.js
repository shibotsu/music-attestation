import { ethers } from "ethers";
import { eas } from "./easConfig";

// Specify the network explicitly
const provider = new ethers.JsonRpcProvider(
  import.meta.env.VITE_EAS_PROVIDER_URL,
  "sepolia" // Explicitly specify the network
);

const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);
eas.connect(signer);
export { eas, signer };
