import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDTO } from './DTO/authCredentials.dto';
import { AuthService } from './auth.service';
import { IsPasswordValidPipe } from './Pipes/isPasswordValid.pipe';
import { IsUserNameValidPipe } from './Pipes/isUserNameValid.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './getUser.decorator';
import { User } from './auth.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ){}
    @Post('/signup')
    @UsePipes(ValidationPipe)
    signUp(@Body()  signUpCredentials : AuthCredentialsDTO) : Promise<void>{
        return this.authService.signUp(signUpCredentials);
        
    }
    @Post('/signin')
    async signIn(@Body(ValidationPipe)  signUpCredentials : AuthCredentialsDTO) : Promise<{accessToken : string}>{
        return await this.authService.signIn(signUpCredentials);
    }
    @Post('/test')
    @UseGuards(AuthGuard('jwt'))
    test(@GetUser() user) : User{
        // console.log(req.user);
        return user;
    }


}
