export default class ChartComponent {
  constructor({ container, type = 'bar', data = {}, options = {} }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.type = type;
    this.data = data;
    this.options = options;
    this.chartInstance = null;
    
    // Automatically apply theme colors
    this.themeColors = {
      primary: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3b82f6',
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b',
      success: getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#22c55e',
      danger: getComputedStyle(document.documentElement).getPropertyValue('--danger').trim() || '#ef4444',
      warning: getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || '#eab308',
      text: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#9ca3af',
      grid: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#374151'
    };

    // Watch for theme changes
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme') {
          this.updateThemeColors();
        }
      });
    });
    this.observer.observe(document.documentElement, { attributes: true });
  }

  updateThemeColors() {
    this.themeColors = {
      primary: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3b82f6',
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b',
      success: getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#22c55e',
      danger: getComputedStyle(document.documentElement).getPropertyValue('--danger').trim() || '#ef4444',
      warning: getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || '#eab308',
      text: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#9ca3af',
      grid: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#374151'
    };
    
    if (this.chartInstance) {
      // Update axes colors if applicable
      if (this.chartInstance.options.scales) {
        if (this.chartInstance.options.scales.x) {
          this.chartInstance.options.scales.x.ticks.color = this.themeColors.text;
          this.chartInstance.options.scales.x.grid.color = this.themeColors.grid;
        }
        if (this.chartInstance.options.scales.y) {
          this.chartInstance.options.scales.y.ticks.color = this.themeColors.text;
          this.chartInstance.options.scales.y.grid.color = this.themeColors.grid;
        }
      }
      if (this.chartInstance.options.plugins && this.chartInstance.options.plugins.legend) {
        this.chartInstance.options.plugins.legend.labels.color = this.themeColors.text;
      }
      this.chartInstance.update();
    }
  }

  getDefaultOptions() {
    const isDark = document.documentElement.classList.contains('dark');
    
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: this.themeColors.text,
            font: {
              family: "'Inter', sans-serif"
            }
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          titleColor: isDark ? '#f9fafb' : '#111827',
          bodyColor: isDark ? '#d1d5db' : '#4b5563',
          borderColor: isDark ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true
        }
      }
    };

    if (['bar', 'line'].includes(this.type)) {
      baseOptions.scales = {
        x: {
          grid: {
            color: this.themeColors.grid,
            drawBorder: false
          },
          ticks: {
            color: this.themeColors.text,
            font: { family: "'Inter', sans-serif" }
          }
        },
        y: {
          grid: {
            color: this.themeColors.grid,
            drawBorder: false
          },
          ticks: {
            color: this.themeColors.text,
            font: { family: "'Inter', sans-serif" }
          }
        }
      };
    }

    return baseOptions;
  }

  render() {
    if (!this.container) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded. Please include it via CDN.');
      this.container.innerHTML = '<div class="text-red-500 p-4 border border-red-200 rounded bg-red-50">Chart.js library is missing.</div>';
      return;
    }

    // Ensure container has a canvas
    let canvas = this.container.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      this.container.innerHTML = '';
      this.container.appendChild(canvas);
      // Ensure the container has dimensions
      if (getComputedStyle(this.container).height === '0px') {
        this.container.style.height = '300px';
      }
      this.container.style.position = 'relative';
    }

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Merge options deeply (simple merge here, might need lodash merge for complex options)
    const finalOptions = {
      ...this.getDefaultOptions(),
      ...this.options
    };

    this.chartInstance = new Chart(canvas, {
      type: this.type,
      data: this.data,
      options: finalOptions
    });
  }

  update(newData) {
    if (this.chartInstance) {
      this.chartInstance.data = newData;
      this.chartInstance.update();
    }
  }

  destroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Static Helpers
  static bar(container, labels, datasets, options = {}) {
    const chart = new ChartComponent({
      container,
      type: 'bar',
      data: { labels, datasets },
      options
    });
    chart.render();
    return chart;
  }

  static line(container, labels, datasets, options = {}) {
    const chart = new ChartComponent({
      container,
      type: 'line',
      data: { labels, datasets },
      options
    });
    chart.render();
    return chart;
  }

  static doughnut(container, labels, datasets, options = {}) {
    const chart = new ChartComponent({
      container,
      type: 'doughnut',
      data: { labels, datasets },
      options
    });
    chart.render();
    return chart;
  }
}
