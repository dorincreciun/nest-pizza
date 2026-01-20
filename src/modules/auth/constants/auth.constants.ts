export const AUTH_MESSAGES = {
    LOGIN: {
        SUCCESS: 'Autentificare reușită',
        INVALID_CREDENTIALS: 'Email-ul sau parola sunt incorecte',
    },
    REGISTER: {
        SUCCESS: 'Cont creat cu succes',
        EMAIL_EXISTS: 'Email-ul este deja înregistrat',
    },
    LOGOUT: {
        SUCCESS: 'Deconectare reușită!',
    },
    TOKEN: {
        MISSING: 'Token lipsă',
        INVALID_ACCESS: 'Access Token invalid sau expirat!',
        INVALID_REFRESH: 'Refresh Token invalid sau expirat!',
        INVALID_SESSION: 'Sesiune invalidă. Vă rugăm să vă logați din nou.',
    },
    VALIDATION: {
        EMAIL_REQUIRED: 'Email-ul este obligatoriu',
        EMAIL_INVALID: 'Adresa de email nu este validă',
        PASSWORD_REQUIRED: 'Parola este obligatorie',
        PASSWORD_MIN_LENGTH: 'Parola trebuie să aibă cel puțin {min} caractere',
        PASSWORD_WEAK: 'Parola este prea slabă (trebuie să conțină litere mari, mici și cifre/simboluri)',
        USERNAME_REQUIRED: 'Username-ul este obligatoriu',
    },
} as const;

export const PASSWORD_REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const PASSWORD_MIN_LENGTH = {
    LOGIN: 6,
    REGISTER: 8,
} as const;