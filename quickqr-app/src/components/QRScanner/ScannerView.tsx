import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { detectQRType } from '../../services/qr.service';

interface Props {
  t: (key: string) => string;
  onResult: (content: string, type: string) => void;
}

export default function ScannerView({ t, onResult }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const containerId = 'qr-scanner-viewport';

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            const type = detectQRType(decodedText);
            onResult(decodedText, type);
            scanner.stop().catch(() => {});
          },
          () => {}
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Camera access denied'
        );
      }
    };

    startScanner();

    return () => {
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [onResult]);

  return (
    <div className="scanner">
      <div className="scanner__viewport" ref={containerRef}>
        <div id="qr-scanner-viewport" style={{ width: '100%', height: '100%' }} />
      </div>
      {error ? (
        <p className="scanner__instruction" style={{ color: 'var(--c-error)' }}>
          {error}
        </p>
      ) : (
        <p className="scanner__instruction">{t('scan.instruction')}</p>
      )}
    </div>
  );
}
