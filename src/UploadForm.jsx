import React, { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import "./index.css";

import { eas } from "../server/config/easSigner.js";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [genre, setGenre] = useState("");
  const [rightsInfo, setRightsInfo] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  //const [schemaUID, setSchemaUID] = useState(null);

  // // Fetch Schema UID when component mounts
  // useEffect(() => {
  //   async function fetchSchemaUID() {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:5001/api/register-schema"
  //       );
  //       if (!response.ok) {
  //         console.log(response);
  //         throw new Error("Failed to fetch schema UID");
  //       }
  //       const data = await response.json();
  //       setSchemaUID(data.schemaUID);
  //       console.log("Schema UID stored in state:", data.schemaUID);
  //     } catch (error) {
  //       console.error("Error fetching schema UID:", error);
  //     }
  //   }

  //   fetchSchemaUID();
  // }, []);

  // Use the registered Schema UID
  const schemaUID =
    "0xea17dc524f81a0e57aa367b41c0af1b3c1fe5c6d97554629065cc3bee52e87d0";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  async function handleAttestation(
    ipfs_cid,
    artistName,
    albumName,
    genre,
    releaseDate,
    rightsInfo
  ) {
    if (!schemaUID) {
      console.error("Schema UID is not available.");
      return;
    }

    // const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });
    // console.log(schemaRecord);

    // Encode metadata using SchemaEncoder
    const encoder = new SchemaEncoder(
      "string fileName,string ipfs_cid,string artistName,string albumName,string genre,string releaseDate,string rightsInfo"
    );

    const encodedData = encoder.encodeData([
      { name: "fileName", type: "string", value: file.name },
      { name: "ipfs_cid", type: "string", value: ipfs_cid },
      { name: "artistName", type: "string", value: artistName },
      { name: "albumName", type: "string", value: albumName || "N/A" },
      { name: "genre", type: "string", value: genre || "N/A" },
      { name: "releaseDate", type: "string", value: releaseDate },
      { name: "rightsInfo", type: "string", value: rightsInfo || "N/A" },
    ]);

    try {
      const tx = await eas.attest({
        schema: schemaUID, // The schema UID you registered earlier
        data: {
          recipient: "0x6AeF2aC11876c2E85Eed513136741cc2b6141dC6", // The recipient of the attestation
          data: encodedData, // The actual data you're attesting (typically encoded in a specific format)
          expirationTime: 0, // No expiration
          revocable: true, // Can be revoked later
        },
      });

      const newAttestationUID = await tx.wait();
      console.log("Attestation successfully created!");
      console.log("New attestation UID: ", newAttestationUID);

      // setResult({
      //   txHash: receipt.transactionHash,
      //   attestationUID: receipt.logs[0]?.topics[1] || "Unknown",
      //   ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfs_cid}`,
      // });
    } catch (error) {
      console.error("Error creating attestation:", error);
      setResult({ error: "Failed to create attestation." });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!releaseDate) {
      alert("Please select a release date.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to IPFS through backend
      const uploadResponse = await fetch(
        "http://localhost:5001/api/ipfs/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const { ipfs_cid } = await uploadResponse.json();

      // Call attestation function
      await handleAttestation(
        ipfs_cid,
        artistName,
        albumName,
        genre,
        releaseDate,
        rightsInfo
      );

      alert("Attestation submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting attestation.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Upload MP3 File</label>
        <input
          type="file"
          accept=".mp3"
          onChange={handleFileChange}
          className="mt-1 block w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Artist Name</label>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          className="mt-1 block w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Album Name (Optional)</label>
        <input
          type="text"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Genre (Optional)</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block font-medium">Release Date</label>
        <input
          type="date"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          className="mt-1 block w-full"
          required
        />
      </div>
      <div>
        <label className="block font-medium">
          Rights/License Info (Optional)
        </label>
        <input
          type="text"
          value={rightsInfo}
          onChange={(e) => setRightsInfo(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Submit Attestation"}
      </button>
      {result && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p className="text-green-600 font-bold">
                Attestation Successful!
              </p>
              <p>
                <strong>Transaction Hash:</strong>{" "}
                <a
                  href={`https://etherscan.io/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {result.txHash}
                </a>
              </p>
              <p>
                <strong>Attestation UID:</strong> {result.attestationUID}
              </p>
            </>
          )}
        </div>
      )}
    </form>
  );
};

export default UploadForm;
