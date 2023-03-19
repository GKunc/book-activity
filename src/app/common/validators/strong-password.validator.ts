import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function hasUpperCase(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }
        const hasUpperCase = /[A-Z]+/.test(value);
        return !hasUpperCase ? { hasUpperCase: true }: null;
    }
}

export function hasLowerCase(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }
        
        const hasLowerCase = /[a-z]+/.test(value);
        return !hasLowerCase ? { hasLowerCase: true } : null;
    }
}

export function hasNumber(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }
        const hasNumeric = /[0-9]+/.test(value);
        return !hasNumeric ? { hasNumeric: false}: null;
    }
}