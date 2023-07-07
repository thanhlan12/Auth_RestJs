import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { Redis } from 'ioredis'
import { InjectRedis } from '@nestjs-modules/ioredis';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        @InjectRedis() private redis: Redis
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password, role } = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = this.jwtService.sign({ id: user._id });
        return { token };
    }


    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        console.log(user);
        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }
        this.redis.setnx(`${user.id}`, 0);

        const isPasswordMathed = await bcrypt.compare(password, user.password);

        if (!isPasswordMathed) {

            const failedLoginTimes = Number.parseInt(await this.redis.get(`${user.id}`)) + 1;
            console.log(await this.redis.get(`${user.id}`));
            if (failedLoginTimes == 3) {
                this.redis.setex(`${user.id}`, 10, 'true');
                console.log(await this.redis.get(`${user.id}`));
                if (await this.redis.ttl(`${user.id}`)) {

                    throw new UnauthorizedException(await this.redis.ttl(`${user.id}`));
                }
            }
            console.log(await this.redis.ttl(`${user.id}`));

            this.redis.set(`${user.id}`, failedLoginTimes);

            
            throw new UnauthorizedException('Invalid email or password');
        }
        const token = this.jwtService.sign({ id: user._id });

        this.redis.set(`${user.id}`, 0);

        console.log(await this.redis.get(`${user.id}`));
        return { token };
    }
}
