import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenStorageService {
    constructor(private readonly databaseService: DatabaseService) {}

    async saveRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        const hashedToken = refreshToken
            ? await bcrypt.hash(refreshToken, 10)
            : null;

        const query = `
            UPDATE users
            SET hashed_refresh_token = $1
            WHERE id = $2
        `;

        await this.databaseService.query(query, [hashedToken, userId]);
    }

    async getHashedRefreshToken(userId: string): Promise<string | null> {
        const query = `
            SELECT hashed_refresh_token 
            FROM users 
            WHERE id = $1
        `;

        const rows = await this.databaseService.query<{ hashed_refresh_token: string }>(
            query,
            [userId]
        );

        return rows.length > 0 ? rows[0].hashed_refresh_token : null;
    }

    async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const hashedToken = await this.getHashedRefreshToken(userId);

        if (!hashedToken) {
            return false;
        }

        return await bcrypt.compare(refreshToken, hashedToken);
    }

    async revokeRefreshToken(userId: string): Promise<void> {
        await this.saveRefreshToken(userId, null);
    }
}