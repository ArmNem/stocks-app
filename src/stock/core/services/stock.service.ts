import { IStockService } from '../primary-ports/stock.service.interface';
import { Stock } from '../models/stock.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import StockEntity from '../../infrastructure/entities/stock.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StockService implements IStockService {
  constructor(
    @InjectRepository(StockEntity)
    private stockRepository: Repository<StockEntity>,
  ) {
  }

  async deleteStock(id: string): Promise<void> {
    await this.stockRepository.delete({ id });
  }

  async getStocks(): Promise<Stock[]> {
    const stocks = await this.stockRepository.find();
    const webStocks: Stock[] = JSON.parse(JSON.stringify(stocks));
    return webStocks;
  }

  async newStock(stock: Stock): Promise<Stock> {
    const createdStock = await this.stockRepository.create(stock);
    const stockEntitySaved = await this.stockRepository.save(stock);
    const stockToReturn: Stock = {
      id: stockEntitySaved.id,
      name: stockEntitySaved.name,
      price: stockEntitySaved.price,
      description: stockEntitySaved.description,
    };
    console.log('entiy saved', stockToReturn);
    return stockToReturn;
  }

  async updateStock(stock: Stock): Promise<Stock> {
    const update = { name: stock.name, price: stock.price, description: stock.description };
    const updatedStock = await this.stockRepository.update(stock.id, update);
    return undefined;
  }

  async findStock(id: string): Promise<Stock> {
    const stock = this.stockRepository.findOne({ id });
    return stock;
  }

  async ChangePrice(id: string, newPrice: number): Promise<Stock> {
    console.log();
    const update = { price: newPrice };
    const updatedStock = await this.stockRepository.update(id, update);
    console.log('updated', updatedStock);
    return undefined;
  }
}
