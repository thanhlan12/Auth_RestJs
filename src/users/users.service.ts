import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import {CreateUserDto} from './dto/create-user.dto';
import { User } from 'src/auth/schemas/user.schemas';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
){}

    async add(createUserDto: CreateUserDto):Promise<{token:string}>{
        const {name,email,password,role}=createUserDto;
        const hashedPassword = await bcrypt.hash(password,5);
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        console.log(user);

        const token = this.jwtService.sign({id:user._id});

        
        return {token};
    }



 // constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findAll(offset = 0, limit = 10) {
    return await this.userModel
      .find({}, { password: 0, __v: 0 }) // return only required properties
      .skip(offset)
      .limit(limit)
      .exec();
  }

  
}
