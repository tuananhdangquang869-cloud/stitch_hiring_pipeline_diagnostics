'use client';

/**
 * Robust Client-Side Chart & Analytics Exporter
 * Provides pixel-perfect exports to SVG, PNG, and PDF without text collisions or security errors.
 */

export interface ExportOptions {
  fileName?: string;
  title?: string;
  backgroundColor?: string;
  scale?: number;
}

/**
 * Collect all active CSS styles and stylesheets into a single CSS string
 */
function collectAllStyles(): string {
  let css = '';
  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            css += rules[j].cssText + '\n';
          }
        }
      } catch {
        // Ignore cross-origin stylesheet access restrictions
      }
    }
  } catch {
    // ignore
  }
  return css;
}

/**
 * Create a standalone, self-contained SVG representation with embedded styles
 */
function buildStandaloneSvg(sourceEl: HTMLElement, bgColor: string): { svgString: string; width: number; height: number } {
  // If there is an active Recharts SVG surface
  const rechartsSurface = sourceEl.querySelector('.recharts-surface') as SVGElement | null;
  if (rechartsSurface) {
    const rect = rechartsSurface.getBoundingClientRect();
    const width = Math.ceil(rect.width) || 800;
    const height = Math.ceil(rect.height) || 400;

    const clonedSvg = rechartsSurface.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('width', `${width}`);
    clonedSvg.setAttribute('height', `${height}`);
    clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', bgColor);
    clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

    return {
      svgString: new XMLSerializer().serializeToString(clonedSvg),
      width,
      height,
    };
  }

  // For HTML views (Cohort Heatmap, Funnel Flow)
  const rect = sourceEl.getBoundingClientRect();
  const width = Math.max(Math.ceil(rect.width), 720);
  const height = Math.max(Math.ceil(rect.height), 360);

  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.no-export, button, [role="menu"]').forEach((el) => el.remove());

  const allStyles = collectAllStyles();
  const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';

  const serializedHtml = new XMLSerializer().serializeToString(clone);

  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style type="text/css">
      <![CDATA[
        ${allStyles}
        body, div, span, p {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace !important;
        }
      ]]>
    </style>
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <foreignObject x="0" y="0" width="${width}" height="${height}">
    <div xmlns="http://www.w3.org/1999/xhtml" data-theme="${isDarkMode ? 'dark' : 'light'}" style="background-color:${bgColor}; width:${width}px; height:${height}px; padding:16px; box-sizing:border-box; color:${isDarkMode ? '#dae2fd' : '#0f172a'}; overflow:hidden;">
      ${serializedHtml}
    </div>
  </foreignObject>
</svg>`.trim();

  return { svgString, width, height };
}

/**
 * Export container directly to standalone lossless SVG file
 */
export async function exportChartToSvg(
  containerId: string,
  options: ExportOptions = {}
): Promise<boolean> {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Export failed: Container #${containerId} not found`);
      return false;
    }

    const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
    const bgColor = options.backgroundColor || (isDarkMode ? '#0b1326' : '#ffffff');

    const { svgString } = buildStandaloneSvg(container, bgColor);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${options.fileName || 'stitch-pipeline-chart'}-${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error exporting chart to SVG:', err);
    return false;
  }
}

/**
 * Export container to presentation-ready high-res PNG
 */
export async function exportChartToPng(
  containerId: string,
  options: ExportOptions = {}
): Promise<boolean> {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Export failed: Container #${containerId} not found`);
      return false;
    }

    const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
    const bgColor = options.backgroundColor || (isDarkMode ? '#0b1326' : '#ffffff');
    const scale = options.scale || 2;

    // Check if container contains a Recharts SVG surface
    const rechartsSurface = container.querySelector('.recharts-surface') as SVGElement | null;
    if (rechartsSurface) {
      const rect = rechartsSurface.getBoundingClientRect();
      const width = Math.ceil(rect.width) || 800;
      const height = Math.ceil(rect.height) || 400;

      const clonedSvg = rechartsSurface.cloneNode(true) as SVGElement;
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('width', `${width}`);
      clonedSvg.setAttribute('height', `${height}`);

      const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('width', '100%');
      bgRect.setAttribute('height', '100%');
      bgRect.setAttribute('fill', bgColor);
      clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(blobUrl);
              resolve(false);
              return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.scale(scale, scale);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((pngBlob) => {
              URL.revokeObjectURL(blobUrl);
              if (!pngBlob) {
                resolve(false);
                return;
              }
              const downloadUrl = URL.createObjectURL(pngBlob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `${options.fileName || 'stitch-pipeline-chart'}-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(downloadUrl);
              resolve(true);
            }, 'image/png');
          } catch (err) {
            console.error('Canvas export error:', err);
            URL.revokeObjectURL(blobUrl);
            resolve(false);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          resolve(false);
        };

        img.src = blobUrl;
      });
    }

    // Fallback for HTML views: export vector SVG directly as SVG download
    return await exportChartToSvg(containerId, options);
  } catch (err) {
    console.error('Error exporting chart to PNG:', err);
    return false;
  }
}

/**
 * Print-to-PDF helper with complete styles & typography inherited
 */
export function exportChartToPdf(containerId: string, title?: string): boolean {
  try {
    const container = document.getElementById(containerId);
    if (!container) return false;

    const headStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    const cloned = container.cloneNode(true) as HTMLElement;
    cloned.querySelectorAll('button, .no-export, [role="menu"]').forEach((el) => el.remove());

    const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
    const themeBg = isDarkMode ? '#0b1326' : '#f8fafc';
    const themeText = isDarkMode ? '#dae2fd' : '#0f172a';

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) return false;

    const htmlContent = `
      <!DOCTYPE html>
      <html data-theme="${isDarkMode ? 'dark' : 'light'}">
        <head>
          <meta charset="utf-8" />
          <title>${title || 'Pipeline Analytics Report'}</title>
          ${headStyles}
          <style>
            body {
              background-color: ${themeBg} !important;
              color: ${themeText} !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "JetBrains Mono", monospace !important;
              padding: 24px !important;
              margin: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header-banner {
              border-bottom: 2px solid ${isDarkMode ? '#3e484f' : '#e2e8f0'};
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .doc-title {
              font-size: 20px;
              font-weight: 700;
              color: #38bdf8;
              margin: 0 0 4px 0;
            }
            .doc-meta {
              font-size: 11px;
              color: #87929a;
              font-family: monospace;
            }
            @media print {
              body { padding: 12px !important; }
              @page { margin: 0.8cm; size: landscape; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="doc-title">${title || 'STITCH HIRING PIPELINE DIAGNOSTICS'}</div>
            <div class="doc-meta">Generated on: ${new Date().toLocaleString()} | Executive Analytics Report</div>
          </div>
          <div class="chart-content">
            ${cloned.outerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              }, 300);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    return true;
  } catch (err) {
    console.error('Error preparing PDF export:', err);
    return false;
  }
}
