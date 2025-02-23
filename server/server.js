import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { registerSchema } from "./scripts/schemaRegistry.js";
import { uploadFileToIPFS } from "./scripts/ipfsUpload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); // Allows frontend requests
app.use(express.json()); // Parses JSON bodies

// Multer setup to store files in memory (you can change this to disk if needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

console.log(process.env.PRIVATE_KEY);

// Endpoint to handle schema registration
app.get("/api/register-schema", async (req, res) => {
  try {
    const schemaUID = await registerSchema(process.env.PRIVATE_KEY);
    res.json({ schemaUID });
  } catch (error) {
    console.error("Error in schema registration", error);
    res.status(500).json({ error: "Failed to register schema" });
  }
});

// IPFS upload endpoint
app.post("/api/ipfs/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const ipfs_cid = await uploadFileToIPFS(req.file);
    res.json({ ipfs_cid });
  } catch (error) {
    console.error("Error in IPFS upload:", error);
    res.status(500).json({ error: "Failed to upload file to IPFS" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
