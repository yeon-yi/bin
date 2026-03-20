import type { QRData } from '../../types';

interface Props {
  items: QRData[];
  t: (key: string) => string;
  onSelect: (item: QRData) => void;
  onDelete: (id: string) => void;
}

function groupByDate(items: QRData[], t: (k: string) => string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  const groups: { title: string; items: QRData[] }[] = [];
  const todayItems: QRData[] = [];
  const yesterdayItems: QRData[] = [];
  const earlierItems: QRData[] = [];

  for (const item of items) {
    if (item.createdAt >= today) todayItems.push(item);
    else if (item.createdAt >= yesterday) yesterdayItems.push(item);
    else earlierItems.push(item);
  }

  if (todayItems.length) groups.push({ title: t('history.today'), items: todayItems });
  if (yesterdayItems.length) groups.push({ title: t('history.yesterday'), items: yesterdayItems });
  if (earlierItems.length) groups.push({ title: t('history.earlier'), items: earlierItems });

  return groups;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryList({ items, t, onSelect, onDelete }: Props) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">&#128203;</div>
        <div className="empty-state__text">{t('history.empty')}</div>
      </div>
    );
  }

  const groups = groupByDate(items, t);

  return (
    <div className="history-list">
      {groups.map(group => (
        <div key={group.title}>
          <div className="history-group__title">{group.title}</div>
          {group.items.map(item => (
            <div key={item.id} className="history-item" onClick={() => onSelect(item)}>
              {item.thumbnail ? (
                <img className="history-item__thumb" src={item.thumbnail} alt="" />
              ) : (
                <div className="history-item__thumb" />
              )}
              <div className="history-item__info">
                <div className="history-item__label">{item.label || item.content}</div>
                <div className="history-item__meta">
                  <span className={`history-item__badge history-item__badge--${item.source}`}>
                    {t(`history.${item.source === 'generated' ? 'generated' : 'scanned'}`)}
                  </span>
                  <span>{formatTime(item.createdAt)}</span>
                </div>
              </div>
              <button
                className="history-item__delete"
                onClick={e => { e.stopPropagation(); onDelete(item.id); }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
