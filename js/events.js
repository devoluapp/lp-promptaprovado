// js/events.js
document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons pointing to the redirect access page
    const checkoutButtons = document.querySelectorAll('a[href*="acesso"]');

    checkoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetUrl = button.getAttribute('href');
            
            if (targetUrl) {
                e.preventDefault(); // Prevent immediate navigation

                // Track InitiateCheckout event (Browser Pixel)
                if (typeof fbq === 'function') {
                    fbq('track', 'InitiateCheckout');
                }

                // Track InitiateCheckout event (Server-side CAPI)
                if (typeof sendMetaConversion === 'function') {
                    sendMetaConversion('InitiateCheckout');
                }

                // Determine target window
                const target = button.getAttribute('target') || '_self';

                // Small delay to allow the pixel and CAPI call to fire before redirecting
                setTimeout(() => {
                    if (target === '_blank') {
                        window.open(targetUrl, '_blank');
                    } else {
                        window.location.href = targetUrl;
                    }
                }, 400);
            }
        });
    });
});
