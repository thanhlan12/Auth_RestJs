import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from 'src/auth/schemas/user.schemas';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '.././auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
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
    MongooseModule.forFeature([{name:'User', schema:UserSchema}]),],
  controllers: [UsersController],
  providers: [UsersService,JwtStrategy],
  exports: [UsersService,JwtStrategy],
})
export class UsersModule {}
