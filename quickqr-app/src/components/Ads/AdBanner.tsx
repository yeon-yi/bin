/**
 * AdBanner placeholder component.
 * In native Capacitor, ads are rendered natively via AdMob plugin.
 * This component reserves space for the banner ad at the bottom.
 */
export default function AdBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      style={{
        width: '100%',
        height: 50,
        background: 'var(--c-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        color: 'var(--c-text-light)',
        borderTop: '1px solid var(--c-border)',
      }}
    >
      Ad Space
    </div>
  );
}
