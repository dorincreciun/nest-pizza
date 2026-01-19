import {Injectable, Logger, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Pool, QueryResultRow} from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    private readonly logger = new Logger(DatabaseService.name);

    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT', 5432),
            database: this.configService.get<string>('DB_NAME'),
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
        });
    }

    async onModuleInit() {
        try {
            // Testăm conexiunea trimițând un mic query
            const client = await this.pool.connect();
            await client.query('SELECT 1');
            client.release(); // Foarte important: eliberăm clientul înapoi în pool

            this.logger.log('Conexiunea la baza de date (PostgreSQL) a fost stabilită.');
        } catch (error) {
            this.logger.error('Nu s-a putut stabili conexiunea la baza de date:', error.message);
            // În producție, ai putea dori să oprești procesul dacă DB-ul e critic
            // process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.pool.end();
        this.logger.log('Pool-ul de conexiuni la baza de date a fost închis.');
    }

    // Metodă utilitară pentru a rula query-uri în restul aplicației
    async query<T extends QueryResultRow>(text: string, params?: any[]): Promise<T[]> {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            this.logger.debug(`Query executat în ${duration}ms`);
            return result.rows;
        } catch (error) {
            this.logger.error(`Eroare la query: ${text}`, error.stack);
            throw error;
        }
    }
}