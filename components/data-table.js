export default class DataTable {
  constructor({ container, columns = [], data = [], options = {} }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.columns = columns;
    this.originalData = [...data];
    this.data = [...data];
    this.options = {
      searchable: true,
      paginated: true,
      pageSize: 10,
      exportable: true,
      selectable: false,
      onRowClick: null,
      ...options
    };
    
    this.state = {
      currentPage: 1,
      searchQuery: '',
      sortColumn: null,
      sortDirection: 'asc', // 'asc' or 'desc'
      selectedRows: new Set(),
      isLoading: false,
      error: null
    };

    this.render();
  }

  setData(data) {
    this.originalData = [...data];
    this.filterAndSortData();
  }

  setLoading(isLoading) {
    this.state.isLoading = isLoading;
    this.render();
  }

  setError(error) {
    this.state.error = error;
    this.render();
  }

  getSelected() {
    return Array.from(this.state.selectedRows).map(index => this.data[index]);
  }

  setSearch(query) {
    this.state.searchQuery = query.toLowerCase();
    this.state.currentPage = 1; // Reset to first page
    this.filterAndSortData();
  }

  setSort(columnKey) {
    if (this.state.sortColumn === columnKey) {
      this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortColumn = columnKey;
      this.state.sortDirection = 'asc';
    }
    this.filterAndSortData();
  }

  setPage(page) {
    const totalPages = Math.ceil(this.data.length / this.options.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.state.currentPage = page;
      this.render();
    }
  }

  toggleRowSelection(index) {
    if (this.state.selectedRows.has(index)) {
      this.state.selectedRows.delete(index);
    } else {
      this.state.selectedRows.add(index);
    }
    this.render();
  }

  toggleAllSelection() {
    const startIndex = (this.state.currentPage - 1) * this.options.pageSize;
    const endIndex = Math.min(startIndex + this.options.pageSize, this.data.length);
    
    let allSelected = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.state.selectedRows.has(i)) {
        allSelected = false;
        break;
      }
    }

    for (let i = startIndex; i < endIndex; i++) {
      if (allSelected) {
        this.state.selectedRows.delete(i);
      } else {
        this.state.selectedRows.add(i);
      }
    }
    this.render();
  }

  filterAndSortData() {
    // Filter
    let filtered = this.originalData;
    if (this.state.searchQuery) {
      filtered = this.originalData.filter(row => {
        return Object.values(row).some(val => 
          String(val).toLowerCase().includes(this.state.searchQuery)
        );
      });
    }

    // Sort
    if (this.state.sortColumn) {
      filtered.sort((a, b) => {
        let valA = a[this.state.sortColumn];
        let valB = b[this.state.sortColumn];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return this.state.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.state.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.data = filtered;
    this.state.selectedRows.clear(); // Clear selection on filter/sort
    this.render();
  }

  renderHeader() {
    let html = '<div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">';
    
    if (this.options.searchable) {
      html += \`
        <div class="relative w-full sm:w-64">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i data-lucide="search" class="w-4 h-4 text-[var(--text-secondary)]"></i>
          </div>
          <input type="text" class="dt-search bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full pl-10 p-2" placeholder="Search...">
        </div>
      \`;
    }

    if (this.options.exportable) {
      html += \`
        <button class="dt-export flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg)] text-sm font-medium text-[var(--text)] transition-colors">
          <i data-lucide="download" class="w-4 h-4"></i> Export CSV
        </button>
      \`;
    }
    
    html += '</div>';
    return html;
  }

  renderTable() {
    const startIndex = (this.state.currentPage - 1) * this.options.pageSize;
    const endIndex = this.options.paginated ? Math.min(startIndex + this.options.pageSize, this.data.length) : this.data.length;
    const pageData = this.data.slice(startIndex, endIndex);

    let allCurrentPageSelected = pageData.length > 0 && pageData.every((_, idx) => this.state.selectedRows.has(startIndex + idx));

    let html = \`
      <div class="overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm">
        <table class="w-full text-sm text-left text-[var(--text-secondary)]">
          <thead class="text-xs text-[var(--text)] uppercase bg-[var(--bg)] border-b border-[var(--border)]">
            <tr>
    \`;

    if (this.options.selectable) {
      html += \`
        <th scope="col" class="p-4 w-4">
          <div class="flex items-center">
            <input type="checkbox" class="dt-select-all w-4 h-4 text-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded focus:ring-[var(--primary)]" \${allCurrentPageSelected ? 'checked' : ''}>
          </div>
        </th>
      \`;
    }

    this.columns.forEach(col => {
      let sortIcon = '';
      if (col.sortable) {
        if (this.state.sortColumn === col.key) {
          sortIcon = this.state.sortDirection === 'asc' 
            ? '<i data-lucide="arrow-up" class="w-4 h-4 ml-1 inline"></i>'
            : '<i data-lucide="arrow-down" class="w-4 h-4 ml-1 inline"></i>';
        } else {
          sortIcon = '<i data-lucide="arrow-up-down" class="w-4 h-4 ml-1 inline opacity-30"></i>';
        }
      }

      html += \`
        <th scope="col" class="px-6 py-3 \${col.sortable ? 'cursor-pointer hover:bg-[var(--border)]/50 dt-sort' : ''}" data-key="\${col.key}" \${col.width ? \`style="width:\${col.width}"\` : ''}>
          <div class="flex items-center">
            \${col.label}
            \${sortIcon}
          </div>
        </th>
      \`;
    });

    html += \`
            </tr>
          </thead>
          <tbody>
    \`;

    if (this.state.isLoading) {
      html += \`<tr><td colspan="\${this.columns.length + (this.options.selectable ? 1 : 0)}" class="px-6 py-8 text-center"><i data-lucide="loader-2" class="w-8 h-8 mx-auto animate-spin text-[var(--primary)] mb-2"></i><span class="text-sm">Loading data...</span></td></tr>\`;
    } else if (this.state.error) {
      html += \`<tr><td colspan="\${this.columns.length + (this.options.selectable ? 1 : 0)}" class="px-6 py-8 text-center text-[var(--danger)]"><i data-lucide="alert-triangle" class="w-8 h-8 mx-auto mb-2"></i><span class="text-sm">\${this.state.error}</span></td></tr>\`;
    } else if (pageData.length === 0) {
      html += \`<tr><td colspan="\${this.columns.length + (this.options.selectable ? 1 : 0)}" class="px-6 py-8 text-center"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-50"></i><span class="text-sm">No data found</span></td></tr>\`;
    } else {
      pageData.forEach((row, idx) => {
        const globalIdx = startIndex + idx;
        const isSelected = this.state.selectedRows.has(globalIdx);
        
        html += \`
          <tr class="border-b border-[var(--border)] hover:bg-[var(--bg)]/50 transition-colors \${this.options.onRowClick ? 'cursor-pointer dt-row' : ''} \${isSelected ? 'bg-[var(--primary-light)]/20' : 'bg-[var(--surface)]'}" data-index="\${globalIdx}">
        \`;

        if (this.options.selectable) {
          html += \`
            <td class="w-4 p-4" onclick="event.stopPropagation()">
              <div class="flex items-center">
                <input type="checkbox" class="dt-select-row w-4 h-4 text-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded focus:ring-[var(--primary)]" data-index="\${globalIdx}" \${isSelected ? 'checked' : ''}>
              </div>
            </td>
          \`;
        }

        this.columns.forEach(col => {
          let cellData = col.render ? col.render(row[col.key], row) : row[col.key];
          html += \`<td class="px-6 py-4 whitespace-nowrap text-[var(--text)]">\${cellData || '-'}</td>\`;
        });

        html += \`</tr>\`;
      });
    }

    html += \`
          </tbody>
        </table>
      </div>
    \`;
    return html;
  }

  renderPagination() {
    if (!this.options.paginated || this.data.length === 0) return '';

    const totalPages = Math.ceil(this.data.length / this.options.pageSize);
    const startIndex = (this.state.currentPage - 1) * this.options.pageSize + 1;
    const endIndex = Math.min(startIndex + this.options.pageSize - 1, this.data.length);

    let html = \`
      <div class="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
        <span class="text-sm font-normal text-[var(--text-secondary)]">
          Showing <span class="font-semibold text-[var(--text)]">\${startIndex}-\${endIndex}</span> of <span class="font-semibold text-[var(--text)]">\${this.data.length}</span>
        </span>
        <ul class="inline-flex items-center -space-x-px h-8 text-sm">
          <li>
            <button class="dt-page-prev flex items-center justify-center px-3 h-8 ms-0 leading-tight text-[var(--text-secondary)] bg-[var(--surface)] border border-e-0 border-[var(--border)] rounded-s-lg hover:bg-[var(--bg)] hover:text-[var(--text)] \${this.state.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" \${this.state.currentPage === 1 ? 'disabled' : ''}>
              <span class="sr-only">Previous</span>
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
          </li>
    \`;

    // Simple pagination logic (showing limited pages could be added)
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.state.currentPage - 1 && i <= this.state.currentPage + 1)) {
        html += \`
          <li>
            <button class="dt-page-num flex items-center justify-center px-3 h-8 leading-tight border border-[var(--border)] \${this.state.currentPage === i ? 'text-[var(--primary)] bg-[var(--primary-light)] font-medium hover:bg-[var(--primary-light)] hover:text-[var(--primary)]' : 'text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--bg)] hover:text-[var(--text)]'}" data-page="\${i}">\${i}</button>
          </li>
        \`;
      } else if (i === this.state.currentPage - 2 || i === this.state.currentPage + 2) {
        html += \`<li><span class="flex items-center justify-center px-3 h-8 leading-tight text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)]">...</span></li>\`;
      }
    }

    html += \`
          <li>
            <button class="dt-page-next flex items-center justify-center px-3 h-8 leading-tight text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] rounded-e-lg hover:bg-[var(--bg)] hover:text-[var(--text)] \${this.state.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" \${this.state.currentPage === totalPages ? 'disabled' : ''}>
              <span class="sr-only">Next</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </li>
        </ul>
      </div>
    \`;

    return html;
  }

  attachEvents() {
    // Search
    const searchInput = this.container.querySelector('.dt-search');
    if (searchInput) {
      searchInput.value = this.state.searchQuery;
      // Use simple timeout for debounce
      let timeout = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => this.setSearch(e.target.value), 300);
      });
    }

    // Sort
    const sortHeaders = this.container.querySelectorAll('.dt-sort');
    sortHeaders.forEach(th => {
      th.addEventListener('click', () => {
        this.setSort(th.getAttribute('data-key'));
      });
    });

    // Pagination
    const prevBtn = this.container.querySelector('.dt-page-prev');
    if (prevBtn) prevBtn.addEventListener('click', () => this.setPage(this.state.currentPage - 1));

    const nextBtn = this.container.querySelector('.dt-page-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.setPage(this.state.currentPage + 1));

    const pageBtns = this.container.querySelectorAll('.dt-page-num');
    pageBtns.forEach(btn => {
      btn.addEventListener('click', () => this.setPage(parseInt(btn.getAttribute('data-page'))));
    });

    // Selection
    const selectAllCheckbox = this.container.querySelector('.dt-select-all');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', () => this.toggleAllSelection());
    }

    const rowCheckboxes = this.container.querySelectorAll('.dt-select-row');
    rowCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        this.toggleRowSelection(parseInt(cb.getAttribute('data-index')));
      });
    });

    // Row Click
    if (this.options.onRowClick) {
      const rows = this.container.querySelectorAll('.dt-row');
      rows.forEach(row => {
        row.addEventListener('click', (e) => {
          // Ignore if clicked on checkbox or action buttons
          if (e.target.closest('.dt-select-row') || e.target.closest('button') || e.target.closest('a')) return;
          const idx = parseInt(row.getAttribute('data-index'));
          this.options.onRowClick(this.data[idx]);
        });
      });
    }

    // Export
    const exportBtn = this.container.querySelector('.dt-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        // dynamic import or trigger event
        if (window.exportToCSV) {
           window.exportToCSV(this.data, this.columns, 'export.csv');
        } else {
           console.log('Export function not available. Make sure export.utils.js is loaded.');
        }
      });
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = \`
      <div class="data-table-wrapper w-full">
        \${this.renderHeader()}
        \${this.renderTable()}
        \${this.renderPagination()}
      </div>
    \`;

    if (window.lucide) {
      lucide.createIcons();
    }

    this.attachEvents();
  }
}
