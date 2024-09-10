document.addEventListener('DOMContentLoaded', function() {
    const consentBanner = document.getElementById('consent-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const rejectButton = document.getElementById('reject-cookies');
    const privacyPolicyLink = document.getElementById('privacy-policy-link');

    if (!localStorage.getItem('cookieConsent')) {
        consentBanner.style.display = 'block';
    }

    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        consentBanner.style.display = 'none';
        // Enable your analytics or other cookie-dependent scripts here
    });

    rejectButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'rejected');
        consentBanner.style.display = 'none';
        // Disable your analytics or other cookie-dependent scripts here
    });

    privacyPolicyLink.addEventListener('click', function(e) {
        e.preventDefault();
        // Replace with your actual privacy policy URL
        window.open('/privacy-policy.html', '_blank');
    });
});