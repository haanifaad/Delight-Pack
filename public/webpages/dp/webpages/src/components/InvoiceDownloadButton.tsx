import React, { useCallback, useEffect, useState } from "react";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import { fetchInvoiceDownloadUrl, fetchOrderInvoiceStatus } from "../lib/invoiceService";

interface InvoiceDownloadButtonProps {
  orderId: string;
  email: string;
  className?: string;
}

export function InvoiceDownloadButton({ orderId, email, className }: InvoiceDownloadButtonProps) {
  const [status, setStatus] = useState<string>("pending_review");
  const [hasInvoice, setHasInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchOrderInvoiceStatus(orderId, email);
      setStatus(result.status);
      setHasInvoice(result.hasInvoice);
      setInvoiceNumber(result.invoiceNumber);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Unable to check invoice status.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, email]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (status !== "completed" || hasInvoice) return;

    const interval = window.setInterval(() => {
      void refreshStatus();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [status, hasInvoice, refreshStatus]);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      const { downloadUrl, invoiceNumber: invNo } = await fetchInvoiceDownloadUrl(orderId, email);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${invNo}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Download failed. Please try again.";
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-2 text-sm text-slate-500 ${className ?? ""}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        Checking invoice…
      </div>
    );
  }

  if (status !== "completed") {
    return (
      <div className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-600 dark:text-slate-400 ${className ?? ""}`}>
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p>
            Your tax invoice will be available here once your order is marked <strong>completed</strong> by our team.
          </p>
        </div>
      </div>
    );
  }

  if (!hasInvoice) {
    return (
      <div className={`rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 ${className ?? ""}`}>
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating your VAT invoice…
        </div>
        <button
          type="button"
          onClick={() => void refreshStatus()}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      {invoiceNumber && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Invoice <span className="font-mono font-medium">{invoiceNumber}</span>
        </p>
      )}
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={isDownloading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 font-medium shadow-lg shadow-blue-500/25 transition-colors"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing download…
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Invoice
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-500 max-w-sm text-center">{error}</p>}
    </div>
  );
}
