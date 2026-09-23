class ValidationService {
    validateAadhaar(value) {
        return /^\d{12}$/.test(value.replace(/\s/g, ''));
    }

    validateMobile(value) {
        return /^[6-9]\d{9}$/.test(value);
    }

    validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    validateRequired(value, fieldName) {
        if (value === null || value === undefined || String(value).trim() === '') {
            return `${fieldName || 'This field'} is required`;
        }
        return null;
    }

    validateMinLength(value, min, fieldName) {
        if (String(value).trim().length < min) {
            return `${fieldName || 'Value'} must be at least ${min} characters`;
        }
        return null;
    }

    validateMaxLength(value, max, fieldName) {
        if (String(value).trim().length > max) {
            return `${fieldName || 'Value'} must not exceed ${max} characters`;
        }
        return null;
    }

    validateDate(value, fieldName) {
        const d = new Date(value);
        if (isNaN(d.getTime())) {
            return `Invalid date for ${fieldName || 'field'}`;
        }
        return null;
    }

    calculateAge(dob) {
        const diffMs = Date.now() - new Date(dob).getTime();
        const ageDt = new Date(diffMs);
        return {
            years: Math.abs(ageDt.getUTCFullYear() - 1970),
            months: ageDt.getUTCMonth()
        };
    }

    validateAge(dob, minAge = 0) {
        const age = this.calculateAge(dob);
        if (age.years < minAge) {
            return `Must be at least ${minAge} years old`;
        }
        return null;
    }

    validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.type) ? null : 'Invalid file type';
    }

    validateFileSize(file, maxBytes) {
        return file.size <= maxBytes ? null : `File exceeds max size of ${maxBytes / 1024 / 1024}MB`;
    }

    validateUserId(value) {
        return /^[a-zA-Z0-9]{4,}$/.test(value) ? null : 'User ID must be alphanumeric and at least 4 characters';
    }

    validatePassword(value) {
        const hasNumber = /\d/;
        const hasUpper = /[A-Z]/;
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!hasNumber.test(value)) return 'Password must contain a number';
        if (!hasUpper.test(value)) return 'Password must contain an uppercase letter';
        return null;
    }

    capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    formatAadhaar(value) {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,12}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    }

    maskAadhaar(value) {
        const v = value.replace(/\s+/g, '');
        if (v.length === 12) {
            return `XXXX XXXX ${v.substring(8)}`;
        }
        return value;
    }

    validateForm(formElement, rules) {
        const errors = {};
        const formData = new FormData(formElement);
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData.get(field);
            for (const rule of fieldRules) {
                const error = rule(value);
                if (error) {
                    errors[field] = error;
                    break; // Stop at first error for this field
                }
            }
        }
        return errors;
    }

    showFieldError(inputElement, message) {
        this.clearFieldError(inputElement);
        inputElement.classList.add('border-danger', 'text-danger');
        const errorEl = document.createElement('p');
        errorEl.className = 'text-danger text-sm mt-1 error-message';
        errorEl.textContent = message;
        inputElement.parentNode.appendChild(errorEl);
    }

    clearFieldError(inputElement) {
        inputElement.classList.remove('border-danger', 'text-danger');
        const parent = inputElement.parentNode;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            parent.removeChild(existingError);
        }
    }

    clearAllErrors(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.clearFieldError(input));
    }
}

const validationService = new ValidationService();
export default validationService;
