'use client';

/**
 * Fire-and-forget: registers a profile view.
 */
export function trackView(profileId: string) {
  if (typeof navigator === 'undefined') return;

  navigator.sendBeacon(
    '/api/track/view',
    JSON.stringify({ profile_id: profileId })
  );
}

/**
 * Fire-and-forget: registers a link click.
 */
export function trackClick(linkId: string, userId: string) {
  if (typeof navigator === 'undefined') return;

  navigator.sendBeacon(
    '/api/track/click',
    JSON.stringify({ link_id: linkId, user_id: userId })
  );
}
