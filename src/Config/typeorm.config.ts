import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import config from 'config'
import { DBConfigInterface } from 'config/ConfigInterfaces/dbConfig.interface';

const dbConfig = config.get<DBConfigInterface>('db');
export const typeOrmConfig : TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME ||  dbConfig.host,
    port: process.env.RDS_PORT
    ? parseInt(process.env.RDS_PORT, 10)
    : dbConfig.port,
    username: process.env.RDS_USERNAME ||  dbConfig.username,
    password: process.env.RDS_PASSWORD ||  dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: process.env.TYPEORM_SYNC ?
    process.env.TYPEORM_SYNC === 'true' : 
    dbConfig.synchronize,
    // autoLoadEntities: true
}