import {Injectable} from '@nestjs/common';
import {DatabaseService} from '../database/database.service';
import {UserEntity} from './entity/user.entity';
import {CreateUserDto} from './dto/create-user.dto';

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

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        const query = `
            INSERT INTO users(username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, email, username
        `;

        const rows = await this.databaseService.query<UserEntity>(
            query,
            [user.username, user.email, user.password]
        );

        if (!rows || rows.length === 0) {
            throw new Error('Eroare la crearea utilizatorului în baza de date');
        }

        return rows[0];
    }

    async updateUser(): Promise<void> {
    }

    async getUserProfile(userId: string): Promise<UserEntity | null> {
        return this.findOneBy({id: userId});
    }
}