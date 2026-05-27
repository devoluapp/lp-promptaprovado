// js/capi.js
/**
 * Meta Conversions API (CAPI) Integration
 * This file handles server-side event reporting via a Supabase Edge Function.
 */

const PIXEL_ID = '050e0dd4-a903-4d6a-abd2-e7ab934a5285'; // UUID Backend Pixel ID
const API_URL = 'https://njsxezhedrldrfrowpml.supabase.co/functions/v1/meta-conversion';

/**
 * Helper to get cookie values
 */
function getMetaCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Sends an event to the Meta Conversions API via the backend endpoint
 */
async function sendMetaConversion(eventName, userData = {}) {
    const fbp = getMetaCookie('_fbp');
    const fbc = getMetaCookie('_fbc');

    // Prepare the payload according to Meta's requirements
    const payload = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: window.location.href,
        user_data: {
            client_user_agent: navigator.userAgent,
            fbp: fbp,
            fbc: fbc,
            ...userData
        },
        custom_data: {
            currency: 'BRL',
            value: 67.00 // Value of the product for PromptAprovado
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-pixel-id': PIXEL_ID,
                'x-origin': window.location.origin
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`CAPI Error [${response.status}]: ${response.statusText}`, errorText);
            return;
        }

        const result = await response.json();
        console.log(`CAPI Event [${eventName}] sent successfully:`, result);
        return result;
    } catch (error) {
        console.error(`CAPI Request failed [${eventName}]:`, error);
    }
}
