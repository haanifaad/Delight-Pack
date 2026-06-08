import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <p className="block text-sm font-medium text-gray-700 mb-2">Resume / CV (Required)</p>
      
      {!selectedFile ? (
        <div
          className={`relative flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-colors duration-200 ease-in-out cursor-pointer bg-card glass-card backdrop-blur-2xl overflow-hidden ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="hidden"
          />
          <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            <span className="text-indigo-600 hover:text-indigo-500">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-card glass-card backdrop-blur-2xl border border-border rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex-shrink-0 p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="flex-shrink-0 ml-4 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
