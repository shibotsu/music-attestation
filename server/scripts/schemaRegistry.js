import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { provider } from "../../server/config/easConfig.js";

export const schemaRegistryContractAddress =
  "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";

export async function registerSchema(privateKey) {
  const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  const signer = new ethers.Wallet(privateKey, provider);
  schemaRegistry.connect(signer);

  console.log("Wallet address:", signer.address);

  const schema =
    "string fileName, string ipfs_cid, string artistName, string albumName, string genre, string releaseDate, string rightsInfo";
  const resolverAddress = ethers.ZeroAddress;
  const revocable = true; // Attestations can be revoked

  try {
    console.log("Registering schema...");
    console.log("Schema to register: ", schema);

    const tx = await schemaRegistry.register({
      schema,
      resolverAddress, //paying the freelancer, minting the nft
      revocable,
    });
    console.log("Transaction details", tx);

    console.log("Schema registered. Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Full receipt:", receipt);

    // Retrieve the schema UID from transaction receipt
    const schemaUID = await schemaRegistry.getUIDFromReceipt(receipt);

    if (!schemaUID) {
      throw new Error("Schema UID not found in transaction receipt.");
    }

    console.log("Schema successfully registered with UID:", schemaUID);

    return schemaUID;
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error data:", error.data);
    throw error;
  }
}
