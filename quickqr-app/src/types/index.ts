export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms';

export interface QRData {
  id: string;
  type: QRType;
  content: string;
  label: string;
  createdAt: number;
  thumbnail?: string;
  source: 'generated' | 'scanned';
}

export interface QRStyle {
  foreground: string;
  background: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

export interface VCardData {
  name: string;
  phone: string;
  email: string;
  org: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}
