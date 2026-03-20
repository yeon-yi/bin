interface Props {
  active: string;
  onNavigate: (tab: string) => void;
  t: (key: string) => string;
}

const tabs = [
  { key: 'generate', icon: '\u2B1B' },
  { key: 'scan', icon: '\u{1F4F7}' },
  { key: 'history', icon: '\u{1F4CB}' },
  { key: 'settings', icon: '\u2699\uFE0F' },
];

export default function BottomNav({ active, onNavigate, t }: Props) {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`bottom-nav__item ${active === tab.key ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onNavigate(tab.key)}
        >
          <span className="bottom-nav__icon">{tab.icon}</span>
          <span>{t(`tab.${tab.key}`)}</span>
        </button>
      ))}
    </nav>
  );
}
