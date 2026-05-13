import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import config from "config"
import { JWTConfigInterface } from 'config/ConfigInterfaces/jwtConfig.interface';

const jwtConfig = config.get<JWTConfigInterface>('jwt');
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy : "jwt"
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ||  jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn, //expires in three hours
        
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
  
})
export class AuthModule {}
