import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <div>
      {/* Upload Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-gray-400  rounded-lg hover:bg-blue-700 transition"
      >
        Upload Files
      </button>

      {/* Animated Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Background Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-lg font-semibold mb-4">Upload Files</h2>

              {/* Drag & Drop Zone */}
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

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Selected Files:</h3>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file) => (
                      <li
                        key={file.name}
                        className="flex justify-between items-center border rounded p-2"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload Button */}
              {files.length > 0 && (
                <button
                  onClick={() => alert("Uploading " + files.length + " files")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
}
