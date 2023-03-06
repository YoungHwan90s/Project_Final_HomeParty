import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    findOne(arg0: { where: { email: string; deletedAt: null; }; }) {
        throw new Error('Method not implemented.');
    }
    insert(arg0: { email: string; password: string; name: string; sex: string; phone: number; birthday: string; region: string; address: string; profile: string; introduction: string; }) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(User) private partyRepository: Repository<User>,
      ) {}
}