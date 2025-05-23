/**
 * ServicePlan Pro Widget Embed Script
 * This script allows easy embedding of the ServicePlan Pro widget on any website.
 */

(function() {
  // Get script element
  const scriptElement = document.currentScript;
  
  // Read configuration from data attributes
  const config = {
    customerId: scriptElement.getAttribute('data-customer-id'),
    company: scriptElement.getAttribute('data-company'),
    mode: scriptElement.getAttribute('data-mode') || 'inline',
    color: scriptElement.getAttribute('data-color') || '#0070f3',
    width: scriptElement.getAttribute('data-width') || '100%',
    height: scriptElement.getAttribute('data-height') || '600px',
    showHeader: scriptElement.getAttribute('data-show-header') !== 'false',
    containerId: 'serviceplan-widget'
  };
  
  // Create widget URL
  const baseUrl = scriptElement.src.split('/embed.js')[0];
  const widgetUrl = `${baseUrl}/embed?customerId=${encodeURIComponent(config.customerId)}&company=${encodeURIComponent(config.company)}&primaryColor=${encodeURIComponent(config.color)}&mode=${config.mode}`;
  
  // Initialize widget based on display mode
  function initWidget() {
    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error('ServicePlan Pro: Container element not found. Make sure you have a div with id="serviceplan-widget"');
      return;
    }
    
    switch(config.mode) {
      case 'inline':
        createInlineWidget(container);
        break;
      case 'popup':
        createPopupWidget(container);
        break;
      case 'floating':
        createFloatingWidget();
        break;
      default:
        createInlineWidget(container);
    }
  }
  
  // Create inline widget (embedded directly)
  function createInlineWidget(container) {
    const iframe = document.createElement('iframe');
    iframe.src = widgetUrl;
    iframe.width = config.width;
    iframe.height = config.height;
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    iframe.frameBorder = '0';
    
    container.appendChild(iframe);
  }
  
  // Create popup widget (opens in a modal)
  function createPopupWidget(container) {
    // Create button
    const button = document.createElement('button');
    button.innerText = 'View Service Plans';
    button.style.backgroundColor = config.color;
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    
    // Create modal (hidden initially)
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '10% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '900px';
    modalContent.style.position = 'relative';
    
    // Close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.color = '#aaa';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    
    // iframe
    const iframe = document.createElement('iframe');
    iframe.src = widgetUrl;
    iframe.width = '100%';
    iframe.height = '500px';
    iframe.style.border = 'none';
    iframe.frameBorder = '0';
    
    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    
    // Add button and modal to container
    container.appendChild(button);
    document.body.appendChild(modal);
    
    // Event listeners
    button.addEventListener('click', function() {
      modal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Create floating button widget
  function createFloatingWidget() {
    // Create floating button
    const button = document.createElement('div');
    button.innerText = 'Service Plans';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = config.color;
    button.style.color = '#fff';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '30px';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9998';
    button.style.fontWeight = 'bold';
    
    // Create modal (hidden initially)
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '10% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.borderRadius = '8px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '900px';
    modalContent.style.position = 'relative';
    
    // Close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.color = '#aaa';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    
    // iframe
    const iframe = document.createElement('iframe');
    iframe.src = widgetUrl;
    iframe.width = '100%';
    iframe.height = '500px';
    iframe.style.border = 'none';
    iframe.frameBorder = '0';
    
    // Assemble modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    
    // Add button and modal to document
    document.body.appendChild(button);
    document.body.appendChild(modal);
    
    // Event listeners
    button.addEventListener('click', function() {
      modal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Initialize once DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();