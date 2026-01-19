import {Injectable} from '@nestjs/common';
import {DatabaseService} from "../database/database.service";
import {UserEntity} from "./entity/user.entity";
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
    constructor(private readonly databaseService: DatabaseService) {
    }

    async findOneBy(criteria: Partial<UserEntity>): Promise<UserEntity | null> {
        const keys = Object.keys(criteria);

        if (keys.length === 0) return null;

        const whereConditions = keys
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(' AND ');

        const query = `
            SELECT id, email, username, password
            FROM users
            WHERE ${whereConditions}
            LIMIT 1
        `;

        const values = Object.values(criteria);

        const rows = await this.databaseService.query<UserEntity>(query, values);

        return rows.length > 0 ? rows[0] : null;
    }

    async createUser(): Promise<void> {
    }

    async updateUser(): Promise<void> {
    }

    async getUserProfile(): Promise<void> {
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

        const query = `
            UPDATE users 
            SET hashed_refresh_token = $1 
            WHERE id = $2
        `
        await this.databaseService.query(query, [refreshToken, userId])
    }
}
