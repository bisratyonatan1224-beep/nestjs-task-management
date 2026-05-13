import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { AuthCredentialsDTO } from "../DTO/authCredentials.dto";
import { User } from "../auth.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export class IsUserNameValidPipe implements PipeTransform {
    
    constructor(
        @InjectRepository(User) 
        private userRepository : Repository<User>
    ){}
    async transform(signUpDTO : AuthCredentialsDTO) {
        const user = await this.userRepository.findOne({where: {username: signUpDTO.username}})
        if( user )
            throw new BadRequestException(`${signUpDTO.username} already in use bucko`);
        return signUpDTO;
    }
    
}