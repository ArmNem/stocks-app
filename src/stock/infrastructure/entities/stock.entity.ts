import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class StockEntity {
  @PrimaryColumn({ unique: true })
  public id: string;

  @Column({ unique: true })
  public name: string;

  @Column()
  public price: number;

  @Column()
  public description: string;
}

export default StockEntity;
