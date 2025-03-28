import { DoubleCsrfConfigOptions } from 'csrf-csrf'
import { CookieOptions } from 'express'
import ms from 'ms'

export const { ORIGIN_ALLOW = 'http://localhost:5173' } = process.env
export const { PORT = '3000' } = process.env
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env
export const { JWT_SECRET = 'JWT_SECRET' } = process.env
export const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
}
export const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
    cookie: {
        name: 'refreshToken',
        options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
            path: '/',
        } as CookieOptions,
    },
}

export const doubleCsrfOptions: DoubleCsrfConfigOptions = {
    getSecret: () => process.env.CSRF_SECRET || 'csrfSecret',
    cookieName: process.env.CSRF_COOKIE_NAME || 'host-csrf-Token',
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        secure: true,
    },
}

export const FILE_CONFIG = {
    maxSize: Number(process.env.MAX_FILE_SIZE) || 10485760,
    minSize: Number(process.env.MIN_FILE_SIZE) || 2048,
}
