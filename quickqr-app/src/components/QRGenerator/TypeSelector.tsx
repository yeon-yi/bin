import type { QRType } from '../../types';
import { QR_TYPES } from '../../utils/constants';

interface Props {
  selected: QRType;
  onSelect: (type: QRType) => void;
  lang: 'ko' | 'en';
}

export default function TypeSelector({ selected, onSelect, lang }: Props) {
  return (
    <div className="type-selector">
      {QR_TYPES.map(item => (
        <button
          key={item.key}
          className={`type-selector__btn ${selected === item.key ? 'type-selector__btn--active' : ''}`}
          onClick={() => onSelect(item.key as QRType)}
        >
          <span className="type-selector__icon">{item.icon}</span>
          <span>{lang === 'ko' ? item.labelKo : item.labelEn}</span>
        </button>
      ))}
    </div>
  );
}
