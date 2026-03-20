import { useRef, useCallback } from 'react';
import { INTERSTITIAL_INTERVAL } from '../utils/constants';

/**
 * AdMob hook for managing ad display logic.
 * Uses Capacitor AdMob plugin when available (native),
 * falls back to no-op in browser.
 */

let admobModule: any = null;

async function getAdMob() {
  if (admobModule) return admobModule;
  try {
    admobModule = await import('@capacitor-community/admob');
    return admobModule;
  } catch {
    return null;
  }
}

export function useAds() {
  const genCountRef = useRef(0);
  const initializedRef = useRef(false);

  const initAds = useCallback(async () => {
    if (initializedRef.current) return;
    const mod = await getAdMob();
    if (!mod) return;
    try {
      await mod.AdMob.initialize({
        initializeForTesting: true,
      });
      initializedRef.current = true;
    } catch {
      // not in native context
    }
  }, []);

  const showBanner = useCallback(async () => {
    const mod = await getAdMob();
    if (!mod) return;
    try {
      await mod.AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // test
        adSize: mod.BannerAdSize?.ADAPTIVE_BANNER ?? 'ADAPTIVE_BANNER',
        position: mod.BannerAdPosition?.BOTTOM_CENTER ?? 'BOTTOM_CENTER',
        isTesting: true,
      });
    } catch { /* browser or plugin not available */ }
  }, []);

  const hideBanner = useCallback(async () => {
    const mod = await getAdMob();
    if (!mod) return;
    try {
      await mod.AdMob.hideBanner();
    } catch { /* noop */ }
  }, []);

  const maybeShowInterstitial = useCallback(async () => {
    genCountRef.current += 1;
    if (genCountRef.current % INTERSTITIAL_INTERVAL !== 0) return;

    const mod = await getAdMob();
    if (!mod) return;
    try {
      await mod.AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712', // test
        isTesting: true,
      });
      await mod.AdMob.showInterstitial();
    } catch { /* noop */ }
  }, []);

  return { initAds, showBanner, hideBanner, maybeShowInterstitial };
}
