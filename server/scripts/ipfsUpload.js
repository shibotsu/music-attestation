import FormData from "form-data";
import { pinataAxiosInstance } from "../../server/config/ipfsConfig.js";

export async function uploadFileToIPFS(file) {
  try {
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    const response = await pinataAxiosInstance.post(
      "/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          // Don't use getHeaders() in a browser environment
          //...formData.getHeaders(),
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    );

    console.log(`File uploaded! CID: ${response.data.IpfsHash}`);
    return response.data.IpfsHash;
  } catch (error) {
    console.error(
      "Error uploading file to IPFS:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Example usage in a React component:
// const handleFileUpload = async (event) => {
//   const file = event.target.files[0];
//   const cid = await uploadFileToIPFS(file);
// }
