"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data.files || []);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file first");
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setFile(null);
      setMessage(data.message);
      fetchFiles();
    } catch {
      setMessage("Upload failed");
    }
    setLoading(false);
  };

  const handleAccess = async (fileName) => {
    const res = await fetch(`/api/file/${fileName}`);
    const data = await res.json();
    window.open(data.url, "_blank");
  };

  const handleDelete = async (fileName) => {
    await fetch(`/api/file/${fileName}`, { method: "DELETE" });
    window.alert("Confirm Delete ?");
    setMessage("File deleted successfully");
    fetchFiles();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            S3 File Upload
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload, access and delete files from AWS S3
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Upload a File
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Uploading..." : "Upload to S3"}
            </button>

            {message && (
              <p
                className={`text-sm ${message !== "Upload failed" ? " text-green-600" : " text-red-600"} font-medium`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Files List Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Files in S3{" "}
            <span className="text-gray-400 font-normal">({files.length})</span>
          </h2>

          {files.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No files uploaded yet</p>
              <p className="text-gray-300 text-xs mt-1">
                Upload a file to see it here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {files.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between py-3"
                >
                  {/* File Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">
                        {f.name.split(".").pop().toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                        {f.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(f.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccess(f.name)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Access
                    </button>
                    <button
                      onClick={() => handleDelete(f.name)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
