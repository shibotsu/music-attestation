import React from "react";
import UploadForm from "./UploadForm";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow-lg w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Music File Attestation
        </h1>
        <UploadForm />
      </div>
    </div>
  );
}

export default App;
