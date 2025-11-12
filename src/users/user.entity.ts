import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @MinLength(2)
  name!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  @MinLength(6)
  password!: string;

  @Column({ 
    type: 'simple-array',
    default: 'CASHIER'
  })
  roles!: string[];

  @BeforeInsert() 
  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
}