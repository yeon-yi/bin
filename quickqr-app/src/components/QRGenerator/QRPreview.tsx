interface Props {
  dataUrl: string;
  t: (key: string) => string;
  onSave: () => void;
  onShare: () => void;
  onCopy: () => void;
}

export default function QRPreview({ dataUrl, t, onSave, onShare, onCopy }: Props) {
  return (
    <div className="qr-preview">
      {dataUrl ? (
        <img className="qr-preview__image" src={dataUrl} alt="QR Code" />
      ) : (
        <div className="qr-preview__placeholder">QR</div>
      )}
      {dataUrl && (
        <div className="qr-preview__actions">
          <button className="btn btn--primary" onClick={onSave}>
            {t('common.download')}
          </button>
          <button className="btn btn--secondary" onClick={onCopy}>
            {t('common.copy')}
          </button>
          <button className="btn btn--secondary" onClick={onShare}>
            {t('common.share')}
          </button>
        </div>
      )}
    </div>
  );
}
