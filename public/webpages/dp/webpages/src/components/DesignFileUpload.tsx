import React, { useRef, useState } from "react";
import { UploadCloud, File as FileIcon, X, AlertCircle } from "lucide-react";
import { cn } from "../utils";
import { validateDesignFile } from "../lib/customOrderService";

const MAX_FILES = 5;

interface DesignFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
}

export function DesignFileUpload({ files, onFilesChange, error }: DesignFileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | File[]) => {
    setLocalError(null);
    const next = [...files];

    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        setLocalError(`Maximum ${MAX_FILES} design files allowed.`);
        break;
      }
      const validationError = validateDesignFile(file);
      if (validationError) {
        setLocalError(validationError);
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) {
        continue;
      }
      next.push(file);
    }

    onFilesChange(next);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-medium text-foreground dark:text-slate-300">
          Custom print designs <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
          Upload artwork, logos, or dielines — PNG, JPEG, WebP, SVG, or PDF up to 10 MB each.
        </p>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[140px] rounded-xl border-2 border-dashed transition-colors cursor-pointer",
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "border-border dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-background dark:bg-slate-800/50"
        )}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,image/*,application/pdf"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        <UploadCloud className="w-9 h-9 text-slate-400 mb-2" />
        <p className="text-sm text-muted-foreground dark:text-slate-300 font-medium">
          <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground mt-1">{files.length} / {MAX_FILES} files</p>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between p-3 bg-card glass-card backdrop-blur-2xl dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {(localError || error) && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {localError || error}
        </p>
      )}
    </div>
  );
}
