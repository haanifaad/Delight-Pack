'use client';

import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function Scanner({ onScanSuccess }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true,
        },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Pause scanner on success to prevent multiple rapid scans
          scannerRef.current?.pause(true);
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Silently ignore frame errors
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess]);

  return (
    <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      <div id="reader" style={{ width: '100%', border: 'none' }}></div>
    </div>
  );
}
