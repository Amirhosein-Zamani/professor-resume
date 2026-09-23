import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database';
import { AuthModule } from './modules/auth/auth.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { GolestanModule } from './modules/golestan/golestan.module';
import { ProfessorsModule } from './modules/professors/professors.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        'apps/api/.env.local',
        '.env.local',
        'apps/api/.env.development',
        '.env.development',
        'apps/api/.env',
        '.env',
      ],
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    FacultiesModule,
    ProfessorsModule,
    GolestanModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
