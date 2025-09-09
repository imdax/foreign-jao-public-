// src/Components/Asset.jsx
import React, { useEffect, useState } from "react";
import { FileText, Eye, Upload, Trash2, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const Asset = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [assets, setAssets] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState("");

  // Loader simulation / initial fetch
  useEffect(() => {
    let cancelled = false;

    const loadAssets = async () => {
      setIsLoading(true);
      setError("");
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("No logged-in user found (userId missing).");
          setAssets([]);
          return;
        }

        const url = `${API_BASE.replace(
          /\/$/,
          ""
        )}/getUploadedAssets?studentId=${encodeURIComponent(userId)}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        const payload = await res.json();
        const data = payload?.data ?? [];
        if (!cancelled) {
          // Normalize the shape for UI
          const normalized = (Array.isArray(data) ? data : []).map((it) => ({
            _id: it._id,
            name: it.name || it.file?.split("/").pop(),
            type: it.type || it.mimeType || it.file?.split(".").pop() || "file",
            size: it.bytes
              ? `${(Number(it.bytes) / 1024).toFixed(2)} KB`
              : it.size || "-",
            date: it.createdAt
              ? new Date(it.createdAt).toLocaleDateString()
              : it.date || "-",
            url: it.file || it.url || it.fileUrl || it.file_link,
            raw: it,
          }));
          setAssets(normalized);
        }
      } catch (err) {
        console.error("Failed to load assets:", err);
        if (!cancelled) setError(err.message || "Failed to load assets");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  // Dropzone logic
  const onDrop = (acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
    setUploadProgress((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  // Upload to Cloudinary then POST to backend /uploadAssets
  const handleStartUpload = async () => {
    setError("");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No logged-in user found (userId missing).");
      return;
    }

    if (!files.length) return;

    for (const file of files) {
      try {
        await new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "uploads");

          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            "https://api.cloudinary.com/v1_1/daykckqdn/auto/upload"
          );

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
            }
          };

          xhr.onload = async () => {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);

                const payload = {
                  name: file.name || data.original_filename || data.public_id,
                  file: data.secure_url,
                  type: data.format
                    ? `image/${data.format}`
                    : data.resource_type || "file",
                  bytes: data.bytes ?? file.size ?? 0,
                  studentId: userId,
                  uploadedBy: userId,
                  meta: {
                    source: "cloudinary",
                    public_id: data.public_id,
                    resource_type: data.resource_type,
                    format: data.format,
                  },
                };

                const postRes = await fetch(
                  `${API_BASE.replace(/\/$/, "")}/uploadAssets`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  }
                );

                if (!postRes.ok) {
                  let msg = `${postRes.status} ${postRes.statusText}`;
                  try {
                    const j = await postRes.json();
                    if (j?.message) msg = `${msg} — ${j.message}`;
                  } catch (e) {}
                  throw new Error(msg);
                }

                const saved = await postRes.json();
                const savedData = saved?.data ?? saved;

                const savedAsset = {
                  _id: savedData._id,
                  name: savedData.name,
                  type: savedData.type,
                  size: savedData.bytes
                    ? `${(Number(savedData.bytes) / 1024).toFixed(2)} KB`
                    : "-",
                  date: savedData.createdAt
                    ? new Date(savedData.createdAt).toLocaleDateString()
                    : "-",
                  url: savedData.file,
                  raw: savedData,
                };

                setAssets((prev) => [savedAsset, ...prev]);
                resolve();
              } catch (err) {
                console.error("Error posting saved asset:", err);
                reject(err);
              }
            } else {
              reject(new Error("Cloudinary upload failed"));
            }
          };

          xhr.onerror = () => reject(new Error("Upload network error"));
          xhr.send(formData);
        });
      } catch (err) {
        console.error("Upload failed for", file.name, err);
        setError(
          (prev) => `${prev ? prev + " | " : ""}Upload failed: ${file.name}`
        );
      } finally {
        setUploadProgress((prev) => {
          const copy = { ...prev };
          delete copy[file.name];
          return copy;
        });
      }
    }

    setFiles([]);
    setIsUploadOpen(false);
  };

  const deleteAsset = async (asset) => {
    if (!asset) return;
    if (asset._id) {
      try {
        const res = await fetch(
          `${API_BASE.replace(/\/$/, "")}/uploadAssets/${asset._id}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) {
          let msg = `${res.status} ${res.statusText}`;
          try {
            const j = await res.json();
            if (j?.message) msg = `${msg} — ${j.message}`;
          } catch (e) {}
          throw new Error(msg);
        }
        setAssets((prev) => prev.filter((a) => a._id !== asset._id));
      } catch (err) {
        console.error("Failed to delete asset:", err);
        setError(err.message || "Failed to delete asset");
      }
    } else {
      setAssets((prev) => prev.filter((a) => a.name !== asset.name));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4">
      <div className="w-full rounded-xl px-4 py-2">
        {/* Header */}
        <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Assets
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Manage all of your documents in one place
            </p>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 shadow-sm border border-gray-300 bg-white hover:bg-gray-50 rounded-lg"
          >
            <Upload size={18} />
            Upload Files
          </button>
        </header>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : assets.length > 0 ? (
                  assets.map((asset, index) => (
                    <tr key={asset._id ?? asset.name ?? index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 rounded-lg">
                            <FileText size={20} className="text-purple-600" />
                          </div>
                          <div className="ml-4 min-w-0">
                            <div className="text-sm font-medium text-gray-900 max-w-[260px] truncate whitespace-nowrap">
                              {asset.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-x-4">
                          <button
                            className="text-gray-400 hover:text-indigo-600"
                            onClick={() => window.open(asset.url, "_blank")}
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => deleteAsset(asset)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      🚫 No files yet. Click{" "}
                      <span className="font-medium">Upload Files</span> to add
                      some.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative z-10"
            >
              {/* Close */}
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-lg font-semibold mb-4">Upload Files</h2>

              {/* Drag & Drop */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-500">Drop your files here...</p>
                ) : (
                  <p>Drag & drop files here, or click to select files</p>
                )}
              </div>

              {/* File List with Progress */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Selected Files:</h3>
                  <ul className="space-y-3 max-h-40 overflow-y-auto">
                    {files.map((file) => (
                      <li key={file.name} className="border rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="block max-w-[220px] truncate whitespace-nowrap">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(file.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {/* Progress Bar */}
                        {uploadProgress[file.name] ? (
                          <div className="w-full bg-gray-200 rounded h-2 mt-2">
                            <div
                              className="bg-green-600 h-2 rounded"
                              style={{
                                width: `${uploadProgress[file.name]}%`,
                              }}
                            />
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload Button */}
              {files.length > 0 && (
                <button
                  onClick={handleStartUpload}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Start Upload
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Asset;
