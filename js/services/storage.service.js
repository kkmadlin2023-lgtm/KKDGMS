import supabaseService from './supabase.service.js';

class StorageService {
    constructor() {
        this.BUCKETS = ['student-photos', 'faculty-photos', 'documents', 'stories', 'events'];
        this.MAX_SIZES = {
            photos: 5 * 1024 * 1024,
            documents: 10 * 1024 * 1024,
            stories: 20 * 1024 * 1024
        };
    }

    /**
     * Upload a file to storage.
     * @param {string} bucket 
     * @param {string} path 
     * @param {File} file 
     * @param {object} options 
     * @returns {Promise<object>}
     */
    async uploadFile(bucket, path, file, options = {}) {
        if (!this.BUCKETS.includes(bucket)) {
            throw new Error(`Invalid bucket: ${bucket}`);
        }
        
        const { data, error } = await supabaseService.client.storage
            .from(bucket)
            .upload(path, file, { upsert: options.upsert || false, ...options });

        if (error) throw error;
        return data;
    }

    /**
     * Get public URL for a file.
     * @param {string} bucket 
     * @param {string} path 
     * @returns {string}
     */
    getPublicUrl(bucket, path) {
        const { data } = supabaseService.client.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }

    /**
     * Get signed URL for a file.
     * @param {string} bucket 
     * @param {string} path 
     * @param {number} expiresIn 
     * @returns {Promise<string>}
     */
    async getSignedUrl(bucket, path, expiresIn = 3600) {
        const { data, error } = await supabaseService.client.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    }

    /**
     * Delete a file from storage.
     * @param {string} bucket 
     * @param {string} path 
     */
    async deleteFile(bucket, path) {
        const { error } = await supabaseService.client.storage
            .from(bucket)
            .remove([path]);
        if (error) throw error;
    }

    /**
     * Validate file type and size.
     * @param {File} file 
     * @param {object} options 
     */
    validateFile(file, options = {}) {
        if (options.maxSize && file.size > options.maxSize) {
            throw new Error(`File size exceeds maximum allowed size of ${options.maxSize / (1024 * 1024)}MB`);
        }
        if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
            throw new Error(`File type ${file.type} is not allowed`);
        }
        return true;
    }

    /**
     * Compress an image file.
     * @param {File} file 
     * @param {number} maxWidth 
     * @param {number} quality 
     * @returns {Promise<Blob>}
     */
    compressImage(file, maxWidth = 1024, quality = 0.8) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) return resolve(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(blob => {
                        resolve(blob);
                    }, file.type, quality);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    }
}

const storageService = new StorageService();
export default storageService;
