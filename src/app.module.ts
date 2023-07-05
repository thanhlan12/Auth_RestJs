import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './auth/schemas/user.schemas';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    AuthModule,
    RouterModule.register([{
      path:'/user',
      module: AuthModule
    }
      
    ]),
    AuthModule,
    // Cấu hình kết nối tới cơ sở dữ liệu
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/auth_js"),//('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), AuthModule, 
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
