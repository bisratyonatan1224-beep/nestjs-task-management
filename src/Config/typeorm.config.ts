import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import config from 'config'
import { DBConfigInterface } from 'config/ConfigInterfaces/dbConfig.interface'
import 'dotenv/config'

const dbConfig = config.get<DBConfigInterface>('db')

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',

    
    url: process.env.DATABASE_URL,

    entities: [__dirname + '/../**/*.entity{.ts,.js}'],

    synchronize: process.env.TYPEORM_SYNC
        ? process.env.TYPEORM_SYNC === 'true'
        : dbConfig.synchronize,

    ssl: {
        rejectUnauthorized: false,
    },
}