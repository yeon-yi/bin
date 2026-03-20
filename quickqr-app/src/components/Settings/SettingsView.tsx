interface Props {
  lang: 'ko' | 'en';
  onLangChange: (lang: 'ko' | 'en') => void;
  t: (key: string) => string;
}

export default function SettingsView({ lang, onLangChange, t }: Props) {
  return (
    <div className="settings-list">
      <div className="settings-item">
        <span className="settings-item__label">{t('settings.language')}</span>
        <select
          className="form-select"
          style={{ width: 'auto', padding: '8px 12px' }}
          value={lang}
          onChange={e => onLangChange(e.target.value as 'ko' | 'en')}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="settings-item">
        <span className="settings-item__label">{t('settings.version')}</span>
        <span className="settings-item__value">1.0.0</span>
      </div>
      <div className="settings-item">
        <span className="settings-item__label">{t('settings.about')}</span>
        <span className="settings-item__value">QuickQR</span>
      </div>
    </div>
  );
}
