import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './schemas/user.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[

    PassportModule.register({ defaultStrategy:'jwt'}),
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService) =>{
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{name:'User', schema:UserSchema}]),

  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy], 
   exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}

