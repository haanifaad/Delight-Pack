import QRCode from 'qrcode';

export interface BatchPayload {
  batch_id: string;
  material_type: string;
  supplier_id: string;
  arrival_date: string;
}

export async function generateBatchQR(payload: BatchPayload): Promise<string> {
  try {
    const jsonString = JSON.stringify(payload);
    // Returns a Data URI
    return await QRCode.toDataURL(jsonString, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code', err);
    throw new Error('Failed to generate QR Code');
  }
}
