import QRCode from 'qrcode';
import type { QRStyle, WiFiData, VCardData, EmailData } from '../types';

export async function generateQR(content: string, style: QRStyle): Promise<string> {
  if (!content.trim()) return '';
  return QRCode.toDataURL(content, {
    width: 512,
    margin: 2,
    color: {
      dark: style.foreground,
      light: style.background,
    },
    errorCorrectionLevel: style.errorCorrection,
  });
}

export function buildWiFiString(data: WiFiData): string {
  const esc = (s: string) => s.replace(/[\\;,:]/g, '\\$&');
  return `WIFI:T:${data.encryption};S:${esc(data.ssid)};P:${esc(data.password)};;`;
}

export function buildVCardString(data: VCardData): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `TEL:${data.phone}`,
    `EMAIL:${data.email}`,
    `ORG:${data.org}`,
    'END:VCARD',
  ].join('\n');
}

export function buildEmailString(data: EmailData): string {
  const params = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  return `mailto:${data.to}${params.length ? '?' + params.join('&') : ''}`;
}

export function buildSMSString(phone: string, body: string): string {
  return `smsto:${phone}:${body}`;
}

export function buildPhoneString(phone: string): string {
  return `tel:${phone}`;
}

export function detectQRType(content: string): string {
  if (content.startsWith('http://') || content.startsWith('https://')) return 'url';
  if (content.startsWith('WIFI:')) return 'wifi';
  if (content.startsWith('BEGIN:VCARD')) return 'vcard';
  if (content.startsWith('mailto:')) return 'email';
  if (content.startsWith('tel:')) return 'phone';
  if (content.startsWith('smsto:')) return 'sms';
  return 'text';
}
