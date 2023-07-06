import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './auth/schemas/user.schemas';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    AuthModule,
    RouterModule.register([{
      path:'/user',
      module: UsersModule
    }
      
    ]),
    AuthModule,
    // Cấu hình kết nối tới cơ sở dữ liệu
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/auth_js2"),//('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), UsersModule, 
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
