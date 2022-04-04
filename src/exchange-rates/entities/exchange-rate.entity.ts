import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnDecimalTransformer } from './column-decimal.transformer';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnDecimalTransformer(),
  })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: string;
}
