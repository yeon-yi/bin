import type { QRStyle } from '../../types';

interface Props {
  style: QRStyle;
  onChange: (style: QRStyle) => void;
  t: (key: string) => string;
}

export default function QRStyler({ style, onChange, t }: Props) {
  return (
    <div className="style-section">
      <div className="style-section__title">{t('generate.style')}</div>
      <div className="color-row">
        <span className="color-row__label">{t('generate.color.fg')}</span>
        <input
          className="color-row__input"
          type="color"
          value={style.foreground}
          onChange={e => onChange({ ...style, foreground: e.target.value })}
        />
        <span className="color-row__value">{style.foreground}</span>
      </div>
      <div className="color-row">
        <span className="color-row__label">{t('generate.color.bg')}</span>
        <input
          className="color-row__input"
          type="color"
          value={style.background}
          onChange={e => onChange({ ...style, background: e.target.value })}
        />
        <span className="color-row__value">{style.background}</span>
      </div>
    </div>
  );
}
