import { TypeOrmModule } from '@nestjs/typeorm';
import StockEntity from '../infrastructure/entities/stock.entity';
import { IStockServiceProvider } from '../core/primary-ports/stock.service.interface';
import { StockService } from '../core/services/stock.service';
import { StockGateway } from './stock.gateway';
import { Module, Post } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  providers: [
    StockGateway,
    { provide: IStockServiceProvider, useClass: StockService },
  ],
})
export class ChatModule {}
