export default class FileUpload {
  constructor({ container, options = {} }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      accept: '*/*',
      maxSize: 5 * 1024 * 1024, // 5MB default
      multiple: false,
      preview: true,
      ...options
    };
    
    this.files = [];
    this.isDragging = false;
    
    // Events
    this.onChange = () => {};
    this.onUpload = () => {};
    this.onError = () => {};

    this.render();
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  handleFiles(newFiles) {
    const validFiles = [];
    let hasError = false;

    Array.from(newFiles).forEach(file => {
      // Check size
      if (file.size > this.options.maxSize) {
        this.onError(\`File \${file.name} is too large. Max size is \${this.formatBytes(this.options.maxSize)}.\`);
        hasError = true;
        return;
      }
      
      // Check type (simple check)
      if (this.options.accept !== '*/*') {
        const acceptList = this.options.accept.split(',').map(s => s.trim());
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        const isValid = acceptList.some(accept => {
          if (accept.startsWith('.')) return accept.toLowerCase() === fileExt;
          if (accept.endsWith('/*')) return file.type.startsWith(accept.replace('/*', ''));
          return file.type === accept;
        });
        
        if (!isValid) {
          this.onError(\`File \${file.name} has invalid type. Accepted: \${this.options.accept}\`);
          hasError = true;
          return;
        }
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      if (this.options.multiple) {
        this.files = [...this.files, ...validFiles];
      } else {
        this.files = [validFiles[0]];
      }
      this.onChange(this.files);
      this.render();
    }
  }

  removeFile(index) {
    this.files.splice(index, 1);
    this.onChange(this.files);
    this.render();
  }

  getFiles() {
    return this.files;
  }

  clear() {
    this.files = [];
    this.onChange(this.files);
    this.render();
  }

  async upload(bucket, pathPrefix = '') {
    if (this.files.length === 0) return [];
    if (typeof supabase === 'undefined') {
      this.onError('Supabase client not found.');
      return [];
    }

    const uploadedUrls = [];
    
    // Simulate UI progress
    const container = this.container.querySelector('.upload-area');
    if (container) {
      container.innerHTML = \`
        <div class="flex flex-col items-center justify-center py-6">
          <i data-lucide="loader-2" class="w-10 h-10 text-[var(--primary)] animate-spin mb-4"></i>
          <p class="text-sm font-medium text-[var(--text)]">Uploading \${this.files.length} file(s)...</p>
        </div>
      \`;
      if (window.lucide) lucide.createIcons();
    }

    try {
      for (const file of this.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = \`\${Math.random().toString(36).substring(2, 15)}_\${Date.now()}.\${fileExt}\`;
        const filePath = \`\${pathPrefix}\${fileName}\`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
      
      this.onUpload(uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      this.onError(error.message);
      this.render(); // Re-render to show original state + error if needed
      return [];
    }
  }

  renderPreview() {
    if (this.files.length === 0 || !this.options.preview) return '';

    return \`
      <div class="mt-4 space-y-3">
        \${this.files.map((file, idx) => {
          const isImage = file.type.startsWith('image/');
          const previewUrl = isImage ? URL.createObjectURL(file) : '';
          
          return \`
            <div class="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
              <div class="flex items-center gap-3 overflow-hidden">
                \${isImage 
                  ? \`<img src="\${previewUrl}" class="w-10 h-10 object-cover rounded-md" alt="Preview">\`
                  : \`<div class="w-10 h-10 flex items-center justify-center bg-[var(--bg)] rounded-md text-[var(--text-secondary)]"><i data-lucide="file" class="w-5 h-5"></i></div>\`
                }
                <div class="min-w-0">
                  <p class="text-sm font-medium text-[var(--text)] truncate">\${file.name}</p>
                  <p class="text-xs text-[var(--text-secondary)]">\${this.formatBytes(file.size)}</p>
                </div>
              </div>
              <button class="remove-file-btn p-1.5 text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors" data-index="\${idx}">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          \`;
        }).join('')}
      </div>
    \`;
  }

  render() {
    if (!this.container) return;

    const html = \`
      <div class="file-upload-component w-full">
        <div class="upload-area relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--bg)] hover:bg-[var(--surface)] transition-colors cursor-pointer \${this.isDragging ? 'border-[var(--primary)] bg-[var(--primary-light)]/10' : ''}">
          <input type="file" class="hidden file-input" accept="\${this.options.accept}" \${this.options.multiple ? 'multiple' : ''}>
          
          <div class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
            <i data-lucide="upload-cloud" class="w-10 h-10 text-[var(--text-secondary)] mb-3 \${this.isDragging ? 'text-[var(--primary)]' : ''}"></i>
            <p class="mb-1 text-sm text-[var(--text-secondary)]">
              <span class="font-semibold text-[var(--primary)]">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-[var(--text-secondary)]/70">
              \${this.options.accept === '*/*' ? 'Any file' : this.options.accept} (Max \${this.formatBytes(this.options.maxSize)})
            </p>
          </div>
        </div>
        
        \${this.renderPreview()}
      </div>
    \`;

    this.container.innerHTML = html;
    
    if (window.lucide) {
      lucide.createIcons();
    }

    // Attach Events
    const uploadArea = this.container.querySelector('.upload-area');
    const fileInput = this.container.querySelector('.file-input');

    if (uploadArea && fileInput) {
      uploadArea.addEventListener('click', () => fileInput.click());

      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!this.isDragging) {
          this.isDragging = true;
          this.render();
        }
      });

      uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        this.isDragging = false;
        this.render();
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        this.isDragging = false;
        if (e.dataTransfer.files.length > 0) {
          this.handleFiles(e.dataTransfer.files);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFiles(e.target.files);
        }
      });
    }

    const removeBtns = this.container.querySelectorAll('.remove-file-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent triggering upload click
        this.removeFile(parseInt(btn.getAttribute('data-index')));
      });
    });
  }
}
