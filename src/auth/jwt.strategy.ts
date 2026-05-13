import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload } from "./auth.payload";
import { User } from "./auth.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import config from "config"
import { JWTConfigInterface } from "config/ConfigInterfaces/jwtConfig.interface";

const jwtConfig = config.get<JWTConfigInterface>('jwt');
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
            @InjectRepository(User)
            private userRepository : Repository<User>,){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : process.env.JWT_SECRET ||  jwtConfig.secret,

        });

    };
    async validate (payload : JwtPayload) : Promise<User>{
        const user = await this.userRepository.findOne({where: {username : payload.username}});
        if(!user){
            throw new UnauthorizedException();
        }
        return user
    }


}