import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { AuthCredentialsDTO } from "../DTO/authCredentials.dto";

export class IsPasswordValidPipe implements PipeTransform {
    transform(signUpDTO : AuthCredentialsDTO) {
        if(signUpDTO.password.length < 2)
            throw new BadRequestException( `${signUpDTO.password} is too short shawty.`);
        return signUpDTO.password;


    }
    
}