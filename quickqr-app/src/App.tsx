import { useState, useCallback, useEffect, useRef } from 'react';
import { useI18n } from './hooks/useI18n';
import type { QRType, QRData, QRStyle } from './types';
import { DEFAULT_STYLE } from './utils/constants';
import {
  generateQR,
  buildWiFiString,
  buildVCardString,
  buildEmailString,
  buildSMSString,
  buildPhoneString,
} from './services/qr.service';
import {
  getHistory,
  addToHistory,
  removeFromHistory,
  generateId,
} from './services/storage.service';

import BottomNav from './components/Layout/BottomNav';
import TypeSelector from './components/QRGenerator/TypeSelector';
import GeneratorForm from './components/QRGenerator/GeneratorForm';
import QRPreview from './components/QRGenerator/QRPreview';
import QRStyler from './components/QRGenerator/QRStyler';
import ScannerView from './components/QRScanner/ScannerView';
import ScanResult from './components/QRScanner/ScanResult';
import HistoryList from './components/History/HistoryList';
import SettingsView from './components/Settings/SettingsView';

type Tab = 'generate' | 'scan' | 'history' | 'settings';

function App() {
  const { lang, setLang, t } = useI18n();
  const [tab, setTab] = useState<Tab>('generate');
  const [toast, setToast] = useState('');

  /* Generator state */
  const [qrType, setQrType] = useState<QRType>('url');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrStyle, setQrStyle] = useState<QRStyle>({ ...DEFAULT_STYLE });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* Scanner state */
  const [scanResult, setScanResult] = useState<{ content: string; type: string } | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  /* History state */
  const [history, setHistory] = useState<QRData[]>(() => getHistory());

  /* Selected history item for preview */
  const [selectedItem, setSelectedItem] = useState<QRData | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  const buildContent = useCallback((): string => {
    switch (qrType) {
      case 'url': return formData.url ?? '';
      case 'text': return formData.text ?? '';
      case 'wifi':
        return formData.ssid
          ? buildWiFiString({
              ssid: formData.ssid,
              password: formData.wifiPass ?? '',
              encryption: (formData.encryption as 'WPA' | 'WEP' | 'nopass') ?? 'WPA',
            })
          : '';
      case 'phone': return formData.phone ? buildPhoneString(formData.phone) : '';
      case 'email':
        return formData.emailTo
          ? buildEmailString({
              to: formData.emailTo,
              subject: formData.emailSubject ?? '',
              body: formData.emailBody ?? '',
            })
          : '';
      case 'sms':
        return formData.smsTo
          ? buildSMSString(formData.smsTo, formData.smsBody ?? '')
          : '';
      case 'vcard':
        return formData.vcardName
          ? buildVCardString({
              name: formData.vcardName,
              phone: formData.vcardPhone ?? '',
              email: formData.vcardEmail ?? '',
              org: formData.vcardOrg ?? '',
            })
          : '';
      default: return '';
    }
  }, [qrType, formData]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const content = buildContent();
      if (content) {
        const url = await generateQR(content, qrStyle);
        setQrDataUrl(url);
      } else {
        setQrDataUrl('');
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [buildContent, qrStyle]);

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `quickqr-${Date.now()}.png`;
    link.click();

    const content = buildContent();
    const item: QRData = {
      id: generateId(),
      type: qrType,
      content,
      label: getLabelFromForm(),
      createdAt: Date.now(),
      thumbnail: qrDataUrl,
      source: 'generated',
    };
    setHistory(addToHistory(item));
    showToast(t('common.download'));
  }, [qrDataUrl, qrType, buildContent, t, showToast]);

  const handleCopyQR = useCallback(async () => {
    if (!qrDataUrl) return;
    try {
      const resp = await fetch(qrDataUrl);
      const blob = await resp.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      showToast(t('common.copied'));
    } catch {
      try {
        await navigator.clipboard.writeText(buildContent());
        showToast(t('common.copied'));
      } catch {
        showToast('Copy failed');
      }
    }
  }, [qrDataUrl, buildContent, t, showToast]);

  const handleShareQR = useCallback(async () => {
    if (!qrDataUrl) return;
    try {
      const resp = await fetch(qrDataUrl);
      const blob = await resp.blob();
      const file = new File([blob], 'quickqr.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({ files: [file], title: 'QuickQR' });
      }
    } catch {
      showToast('Share not supported');
    }
  }, [qrDataUrl, showToast]);

  function getLabelFromForm(): string {
    switch (qrType) {
      case 'url': return formData.url ?? '';
      case 'text': return (formData.text ?? '').slice(0, 50);
      case 'wifi': return formData.ssid ?? 'WiFi';
      case 'phone': return formData.phone ?? '';
      case 'email': return formData.emailTo ?? '';
      case 'sms': return formData.smsTo ?? '';
      case 'vcard': return formData.vcardName ?? '';
      default: return '';
    }
  }

  /* Scanner handlers */
  const handleScanResult = useCallback((content: string, type: string) => {
    setScanResult({ content, type });
    setShowScanner(false);

    const item: QRData = {
      id: generateId(),
      type: type as QRType,
      content,
      label: content.slice(0, 80),
      createdAt: Date.now(),
      source: 'scanned',
    };
    setHistory(addToHistory(item));
  }, []);

  const handleScanCopy = useCallback(async () => {
    if (!scanResult) return;
    await navigator.clipboard.writeText(scanResult.content);
    showToast(t('common.copied'));
  }, [scanResult, t, showToast]);

  const handleScanShare = useCallback(async () => {
    if (!scanResult || !navigator.share) return;
    try {
      await navigator.share({ text: scanResult.content });
    } catch { /* cancelled */ }
  }, [scanResult]);

  /* History handlers */
  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(removeFromHistory(id));
  }, []);

  const handleSelectHistory = useCallback(async (item: QRData) => {
    const url = await generateQR(item.content, qrStyle);
    setSelectedItem({ ...item, thumbnail: url });
  }, [qrStyle]);

  /* Tab change handler */
  const handleTabChange = useCallback((newTab: string) => {
    setTab(newTab as Tab);
    if (newTab === 'scan') {
      setShowScanner(true);
      setScanResult(null);
    } else {
      setShowScanner(false);
    }
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1>QuickQR</h1>
      </header>

      <main className="app__content">
        {tab === 'generate' && (
          <>
            <TypeSelector selected={qrType} onSelect={setQrType} lang={lang} />
            <div style={{ marginTop: 'var(--space-md)' }}>
              <GeneratorForm
                type={qrType}
                formData={formData}
                onChange={handleFormChange}
                t={t}
              />
            </div>
            <QRPreview
              dataUrl={qrDataUrl}
              t={t}
              onSave={handleSave}
              onShare={handleShareQR}
              onCopy={handleCopyQR}
            />
            <QRStyler style={qrStyle} onChange={setQrStyle} t={t} />
          </>
        )}

        {tab === 'scan' && (
          <>
            {showScanner && (
              <ScannerView t={t} onResult={handleScanResult} />
            )}
            {scanResult && (
              <ScanResult
                content={scanResult.content}
                type={scanResult.type}
                t={t}
                onCopy={handleScanCopy}
                onShare={handleScanShare}
                onClose={() => {
                  setScanResult(null);
                  setShowScanner(true);
                }}
              />
            )}
            {!showScanner && !scanResult && (
              <div className="empty-state">
                <button
                  className="btn btn--primary"
                  onClick={() => setShowScanner(true)}
                >
                  {t('scan.title')}
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'history' && (
          <HistoryList
            items={history}
            t={t}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
          />
        )}

        {tab === 'settings' && (
          <SettingsView lang={lang} onLangChange={setLang} t={t} />
        )}
      </main>

      <BottomNav active={tab} onNavigate={handleTabChange} t={t} />

      {toast && <div className="toast">{toast}</div>}

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="qr-preview" style={{ boxShadow: 'none' }}>
              {selectedItem.thumbnail && (
                <img className="qr-preview__image" src={selectedItem.thumbnail} alt="QR" />
              )}
              <p style={{ fontSize: 14, color: 'var(--c-text-muted)', wordBreak: 'break-all' }}>
                {selectedItem.content}
              </p>
              <div className="qr-preview__actions">
                <button
                  className="btn btn--secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.content);
                    showToast(t('common.copied'));
                  }}
                >
                  {t('common.copy')}
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={() => setSelectedItem(null)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
