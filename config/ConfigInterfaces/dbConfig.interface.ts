import { LargeNumberLike } from "crypto";
import { DataSourceOptions } from "typeorm";
export interface DBConfigInterface {
    type: 'postgres';
    port: number;
    database: string;
    host: string;
    username: string;
    password: string;
    synchronize: boolean
}