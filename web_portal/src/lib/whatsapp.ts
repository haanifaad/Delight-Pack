export interface WhatsAppQuoteData {
  customerName: string;
  packagingType: string;
  quantity: number | string;
  message?: string;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  data: WhatsAppQuoteData
): string {
  const { customerName, packagingType, quantity, message } = data;
  
  const textBuilder = [
    `*New Quote Request*`,
    `-------------------`,
    `*Name:* ${customerName}`,
    `*Packaging Type:* ${packagingType}`,
    `*Quantity:* ${quantity}`,
  ];

  if (message && message.trim() !== '') {
    textBuilder.push(`*Message:* ${message.trim()}`);
  }

  const encodedText = encodeURIComponent(textBuilder.join('\n'));
  
  // Clean phone number (remove any non-digit characters except leading '+')
  const cleanNumber = phoneNumber.replace(/(?!^\+)[^\d]/g, '');

  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
