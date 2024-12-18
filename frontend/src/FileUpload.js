import React, { useState, useEffect } from "react";
import "./FileUpload.css";
import picture1 from "./images/image-1.png";
import API_BASE_URL from "./config";

const FileUpload = () => {
  const [file, setFile] = useState(null); // State to store the selected file
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to track all uploaded files
  const [uploading, setUploading] = useState(false); // State to track if the file is uploading
  const [error, setError] = useState(null); // State to store errors

useEffect(() => {
  // Function to delete all files when the page reloads
  const deleteAllFilesOnRefresh = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-all`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete files on refresh.");
      }

      console.log("All files deleted successfully.");
      setUploadedFiles([]); // Clear the local state
    } catch (err) {
      console.error("Error deleting files on refresh:", err);
    }
  };

  // Check if the page is being refreshed
  window.addEventListener("beforeunload", deleteAllFilesOnRefresh);

  // Cleanup the event listener
  return () => window.removeEventListener("beforeunload", deleteAllFilesOnRefresh);
}, []);

  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Error uploading file.");
      }

      const data = await response.json();
      const newFile = data.savedFile;
      setUploadedFiles((uploadedFiles) => [...uploadedFiles, newFile]);
      console.log(uploadedFiles);
      setFile(null);
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileid, fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
      });

      
      if (!response.ok) {
        throw new Error("Error deleting file.");
      }

      setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileid));
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Error deleting file.");
    }
  };

  return (
    <div className="body-background">
      <div className="box1">
        <div className="circle1"></div>
        <div className="circle2"></div>

        <img src={picture1} alt="Logo" className="logo-image" />
        <h1 className="first-text">ClearScan</h1>
        <p className="second-text">Upload Documents and</p>
        <p className="third-text">Find out your Details!</p>
        <div className="line"></div>
        <p className="description">What does 'ClearScan' do?</p>
        <p className="description-next">
          It identifies and classifies data such as PAN card numbers, US Social
          Security Numbers (SSN), medical record numbers, medical test results,
          health insurance information, credit card numbers, and classifies them
          as
        </p>
        <div className="horizontal-list">
          <div className="list-item">Protected Health Information</div>
          <div className="list-item">Personally Identifiable Information</div>
          <div className="list-item">Payment Card Information</div>
        </div>
      </div>

      <div className="box2">
        <p className="fourth-text">Upload File</p>
        <form onSubmit={handleSubmit}>
          <div className="choosefile">
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
              disabled={uploading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <div className="uploaded-files">
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file) => (
            <div key={file.id} className="file-container">
              <h3>
                Scanned Data for: <span className="file-name">{file.fileName}</span>
              </h3>

              <div className="extracted-data">
                <h4>Personally Identifiable Information (PII)</h4>
                <ul>
                {(file.extractedData?.pii?.dob || []).length > 0 && (
                    <li>
                      <strong>Date of Birth:</strong>{" "}
                      {file.extractedData.pii.dob.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.pii?.emails || []).length > 0 && (
                    <li>
                      <strong>Emails:</strong>{" "}
                      {file.extractedData.pii.emails.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.pii?.phoneNumbers || []).length > 0 && (
                    <li>
                      <strong>Phone Numbers:</strong>{" "}
                      {file.extractedData.pii.phoneNumbers.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.pii?.ssnNumbers || []).length > 0 && (
                    <li>
                      <strong>SSN Numbers:</strong>{" "}
                      {file.extractedData.pii.ssnNumbers.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.pii?.panNumbers || []).length > 0 && (
                    <li>
                      <strong>PAN Numbers:</strong>{" "}
                      {file.extractedData.pii.panNumbers.join(", ")}
                    </li>
                  )}
                </ul>

                <h4>Payment Card Information (PCI)</h4>
                <ul>
                  {(file.extractedData?.pci?.cvv || []).length > 0 && (
                    <li>
                      <strong>CVV Numbers:</strong>{" "}
                      {file.extractedData.pci.cvv.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.pci?.expiryDates || []).length > 0 && (
                    <li>
                      <strong>Expiry Dates:</strong>{" "}
                      {file.extractedData.pci.expiryDates.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.pci?.creditCardNumbers || []).length > 0 && (
                    <li>
                      <strong>Credit Card Numbers:</strong>{" "}
                      {file.extractedData.pci.creditCardNumbers.join(", ")}
                    </li>
                  )}
                </ul>

                <h4>Protected Health Information (PHI)</h4>
                <ul>
                  {(file.extractedData?.phi?.bloodTypes || []).length > 0 && (
                    <li>
                      <strong>Blood Groups:</strong>{" "}
                      {file.extractedData.phi.bloodTypes.join(", ")}
                    </li>
                  )}
                  {(file.extractedData?.phi?.healthInsuranceNumbers || []).length > 0 && (
                    <li>
                      <strong>Insurance Numbers:</strong>{" "}
                      {file.extractedData.phi.healthInsuranceNumbers.join(", ")}
                    </li>
                  )}
                </ul>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => handleDelete(file.id, file.fileName)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
