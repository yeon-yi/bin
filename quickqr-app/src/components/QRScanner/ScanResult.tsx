interface Props {
  content: string;
  type: string;
  t: (key: string) => string;
  onCopy: () => void;
  onShare: () => void;
  onClose: () => void;
}

export default function ScanResult({ content, type, t, onCopy, onShare, onClose }: Props) {
  const handleOpen = () => {
    if (type === 'url') {
      window.open(content, '_blank');
    } else if (type === 'phone') {
      window.location.href = content;
    } else if (type === 'email') {
      window.location.href = content;
    }
  };

  const canOpen = type === 'url' || type === 'phone' || type === 'email';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="scan-result">
          <div className="scan-result__type">{type.toUpperCase()}</div>
          <div className="scan-result__content">{content}</div>
          <div className="scan-result__actions">
            {canOpen && (
              <button className="btn btn--primary" onClick={handleOpen}>
                {t('scan.open')}
              </button>
            )}
            <button className="btn btn--secondary" onClick={onCopy}>
              {t('scan.copy')}
            </button>
            <button className="btn btn--secondary" onClick={onShare}>
              {t('scan.share')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
