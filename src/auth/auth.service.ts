import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDTO } from './DTO/authCredentials.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.payload';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
        private jwtService : JwtService
    ) {}    
    async signUp(signUpDTO : AuthCredentialsDTO) : Promise<void>{
        const user = new User();
        user.username = signUpDTO.username;
        user.salt = await bcrypt.genSalt();;
        user.password = await this.hashPassword(signUpDTO.password, user.salt);
        try{
            await user.save(); 
        }
        catch(error){
            if(error instanceof Error && (error as any).code==="23505"){
                throw new ConflictException(`${signUpDTO.username} already exists.`)
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }
    async signIn( signInDTO : AuthCredentialsDTO ): Promise<{accessToken : string}>{
        const result = await this.validateUserPassword(signInDTO);
        if(!result){
            throw new UnauthorizedException("Invalid Credentials");
        }
        const payload : JwtPayload = {username : signInDTO.username};
        const accessToken = await this.jwtService.sign(payload);

        return {accessToken: accessToken}
    }
    async validateUserPassword(signInDTO : AuthCredentialsDTO) : Promise<string | null>{
        const user = await this.userRepository.findOne({where: {username : signInDTO.username}});
        if(user && await user.validatePassword(signInDTO.password)){
            return user.username
        } else {
            return null
        }

    }
    private async hashPassword(password: string, salt: string ) : Promise<string>{
        return bcrypt.hash(password,salt);
    }
}
