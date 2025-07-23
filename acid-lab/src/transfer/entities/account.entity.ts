import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Movement } from './movements.entity';

@Entity({ name: 'accounts' })
@Check(`"balance" >= 0`)
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', {
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  balance: number;

  @OneToMany(() => Movement, (movement) => movement.fromAccount)
  outgoing: Movement[];

  @OneToMany(() => Movement, (movement) => movement.toAccount)
  incoming: Movement[];
}
