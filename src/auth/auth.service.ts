import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ){}

        async signUp(signUpDto: SignUpDto):Promise<{token:string}>{
            const {name,email,password,role}=signUpDto;
            const hashedPassword = await bcrypt.hash(password,5);
            const user = await this.userModel.create({
                name,
                email,
                password: hashedPassword,
                role,
            });

            const token = this.jwtService.sign({id:user._id});

            
            return {token};
        }

        async login(loginDto: LoginDto):Promise<{token:string}>{
            const {email,password} = loginDto;

            const user = await this.userModel.findOne({email});
            //console.log(user);
            if(!user){
                throw new UnauthorizedException('Invalid email');
            }
            const isPasswordMathed = await bcrypt.compare(password,user.password);
                if(!isPasswordMathed){
                    throw new UnauthorizedException('Invalid email or password');
                }
                const token=this.jwtService.sign({id:user._id});

            return {token};
        }



}
