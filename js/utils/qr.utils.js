// QR Code Utilities

export const generateQR = (data, container, size = 128) => {
  const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
  
  if (!containerEl) {
    console.error('QR container not found');
    return null;
  }

  if (typeof QRCode === 'undefined') {
    console.error('qrcode.js library is required');
    containerEl.innerHTML = '<div class="text-red-500 text-xs text-center border p-2">QR lib missing</div>';
    return null;
  }

  containerEl.innerHTML = ''; // Clear previous

  const isDark = document.documentElement.classList.contains('dark');
  const colorDark = isDark ? '#ffffff' : '#000000';
  const colorLight = isDark ? '#00000000' : '#ffffff'; // transparent bg for dark mode

  try {
    const qrcode = new QRCode(containerEl, {
      text: String(data),
      width: size,
      height: size,
      colorDark: colorDark,
      colorLight: colorLight,
      correctLevel: QRCode.CorrectLevel.H
    });
    return qrcode;
  } catch (err) {
    console.error('Failed to generate QR:', err);
    return null;
  }
};

export const scanQR = async (videoElement, onResult, onError) => {
  // Note: This requires a library like html5-qrcode (https://github.com/mebjas/html5-qrcode)
  // This is a wrapper function assuming the library is loaded via CDN
  
  if (typeof Html5Qrcode === 'undefined') {
    const err = 'html5-qrcode library is required for scanning';
    console.error(err);
    if (onError) onError(err);
    return null;
  }

  const cameraId = typeof videoElement === 'string' ? videoElement : videoElement.id;
  
  try {
    const html5QrCode = new Html5Qrcode(cameraId);
    
    await html5QrCode.start(
      { facingMode: "environment" }, // Prefer back camera
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      (decodedText, decodedResult) => {
        // on success
        if (onResult) onResult(decodedText);
        // Optionally stop scanning after success
        // html5QrCode.stop();
      },
      (errorMessage) => {
        // parse error, ignore and keep scanning
      }
    );
    
    return html5QrCode;
  } catch (err) {
    console.error('Error starting QR scanner:', err);
    if (onError) onError(err);
    return null;
  }
};
