export const QR_TYPES = [
  { key: 'url', icon: '🔗', labelKo: 'URL', labelEn: 'URL' },
  { key: 'text', icon: '📝', labelKo: '텍스트', labelEn: 'Text' },
  { key: 'wifi', icon: '📶', labelKo: 'WiFi', labelEn: 'WiFi' },
  { key: 'phone', icon: '📞', labelKo: '전화', labelEn: 'Phone' },
  { key: 'email', icon: '✉️', labelKo: '이메일', labelEn: 'Email' },
  { key: 'sms', icon: '💬', labelKo: 'SMS', labelEn: 'SMS' },
  { key: 'vcard', icon: '👤', labelKo: '연락처', labelEn: 'Contact' },
] as const;

export const DEFAULT_STYLE = {
  foreground: '#000000',
  background: '#FFFFFF',
  errorCorrection: 'M' as const,
};

export const MAX_HISTORY_FREE = 30;
export const INTERSTITIAL_INTERVAL = 3;

export const ADMOB_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
export const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
