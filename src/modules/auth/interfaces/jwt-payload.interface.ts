export type TokenTypes = "accessToken" | "refreshToken"

export interface JwtPayloadInterface {
    sub: string
    email: string
}

export interface TokenPair {
    accessToken: string
    refreshToken: string
}