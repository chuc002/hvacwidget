(function() {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  // Get parameters from the script tag
  const companyName = scriptTag.getAttribute('data-company') || 'Premium Home Services';
  const width = scriptTag.getAttribute('data-width') || '100%';
  const height = scriptTag.getAttribute('data-height') || '800px';
  
  // Create the iframe element
  const iframe = document.createElement('iframe');
  const baseUrl = 'https://' + scriptTag.src.split('/')[2]; // Extract domain from script src
  
  // Build the embed URL with parameters
  const embedUrl = `${baseUrl}/embed?company=${encodeURIComponent(companyName)}`;
  
  // Set iframe attributes
  iframe.src = embedUrl;
  iframe.width = width;
  iframe.height = height;
  iframe.frameBorder = '0';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  // Insert the iframe after the script
  if (scriptTag.parentNode) {
    scriptTag.parentNode.insertBefore(iframe, scriptTag.nextSibling);
  } else {
    // Fallback - append to body
    document.body.appendChild(iframe);
  }
})();