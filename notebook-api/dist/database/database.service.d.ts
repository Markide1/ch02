import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PoolClient } from "pg";
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool;
    onModuleInit(): Promise<void>;
    private runMigrations;
    onModuleDestroy(): Promise<void>;
    query(text: string, params?: any[]): Promise<any>;
    getClient(): Promise<PoolClient>;
}
