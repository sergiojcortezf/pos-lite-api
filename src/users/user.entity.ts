import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'users' }) // Esto creará la tabla 'users'
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
    type: 'simple-array', // 'simple-array' es un tipo de TypeORM
    default: 'CASHIER' // Por defecto, todos son 'CASHIER'
  })
  roles!: string[];

  // Esto es un "hook" de TypeORM
  // Se ejecuta automáticamente ANTES de guardar un usuario nuevo
  @BeforeInsert() 
  hashPassword() {
    // Generamos el "salt"
    const salt = bcrypt.genSaltSync(10);
    // Hasheamos la contraseña
    this.password = bcrypt.hashSync(this.password, salt);
  }
}