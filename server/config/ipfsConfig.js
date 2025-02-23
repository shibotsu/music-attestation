import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_BASE_URL = "https://api.pinata.cloud";

console.log("Pinata API Key: ", PINATA_API_KEY);
console.log("Pinata API Secret: ", PINATA_API_SECRET);

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  console.error("Error: Missing API key or secret.");
}

const pinataAxiosInstance = axios.create({
  baseURL: PINATA_BASE_URL,
  headers: {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_API_SECRET,
  },
});

export { pinataAxiosInstance };
