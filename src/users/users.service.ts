import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { FindOptions } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  findOne(filter: FindOptions<User>): Promise<User | null> {
    return this.userModel.findOne(filter);
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<User | { warningMessage: string }> {
    const { username, email, password } = createUserDto;

    if (!email) {
      return { warningMessage: 'Email обязателен' };
    }

    const existingByUsername = await this.findOne({
      where: { username },
    });

    if (existingByUsername) {
      return { warningMessage: 'Пользователь с таким именем уже существует' };
    }

    const existingByEmail = await this.findOne({
      where: { email },
    });

    if (existingByEmail) {
      return { warningMessage: 'Пользователь с таким email уже существует' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
