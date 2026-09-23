// Export Utilities

export const exportToCSV = (data, columns, filename = 'export.csv') => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  // Use provided columns or extract from data keys
  const headers = columns ? columns.map(c => c.label) : Object.keys(data[0]);
  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0]);

  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.map(h => \`"\${String(h).replace(/"/g, '""')}"\`).join(','));

  // Add data rows
  for (const row of data) {
    const values = keys.map(k => {
      let val = row[k];
      if (val === null || val === undefined) val = '';
      // Escape quotes and wrap in quotes
      return \`"\${String(val).replace(/"/g, '""')}"\`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (elementId, filename = 'document.pdf', options = {}) => {
  if (typeof html2pdf === 'undefined') {
    console.error('html2pdf library is required for PDF export');
    return false;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(\`Element with id \${elementId} not found\`);
    return false;
  }

  const defaultOptions = {
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    await html2pdf().set(finalOptions).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const printElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(\`Element with id \${elementId} not found\`);
    return;
  }

  // Create an iframe to print
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  
  // Clone the styles from current document
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(style => style.outerHTML)
    .join('\n');

  doc.open();
  doc.write(\`
    <html>
      <head>
        <title>Print</title>
        \${styles}
        <style>
          @media print {
            body { padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        \${element.innerHTML}
      </body>
    </html>
  \`);
  doc.close();

  // Wait for resources to load then print
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};

// Expose to window for inline calls if needed
window.exportToCSV = exportToCSV;
window.exportToPDF = exportToPDF;
window.printElement = printElement;
