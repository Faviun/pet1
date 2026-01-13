import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './config/sequelizeConfig.service';
import { databaseConfig } from './config/configuration';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoilerPartsModule } from './boiler-parts/boiler-parts.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    UsersModule,
    AuthModule,
    BoilerPartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
