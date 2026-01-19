import {Injectable} from '@nestjs/common';
import {DatabaseService} from "../database/database.service";
import {UserEntity} from "./entity/user.entity";

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

    async updateRefreshToken(): Promise<void> {
    }
}
