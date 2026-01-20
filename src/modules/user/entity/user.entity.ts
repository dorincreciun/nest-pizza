export class UserEntity {
    id: string
    username: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date | null
    hashed_refresh_token: string | null
}