import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity({ name: 'movements' })
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.outgoing, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'from_id' })
  fromAccount: Account;

  @ManyToOne(() => Account, (account) => account.incoming, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'to_id' })
  toAccount: Account;

  @Column({ type: 'numeric' })
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
