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

  async newStock(
    id: string,
    name: string,
    price: number,
    description: string,
  ): Promise<Stock> {
    const stockFromDB = await this.stockRepository.findOne({ name });
    if (!stockFromDB) {
      const stock = this.stockRepository.create();
      stock.id = id;
      stock.name = name;
      stock.price = price;
      stock.description = description;
      await this.stockRepository.save(stock);
      return {
        id: '' + stock.id,
        name: stock.name,
        price: stock.price,
        description: stock.description,
      };
    }
    if (stockFromDB.id === id) {
      return {
        id: '' + stockFromDB.id,
        name: stockFromDB.name,
        price: stockFromDB.price,
        description: stockFromDB.description,
      };
    } else {
      throw new Error('This stock already exists');
    }
    return undefined;
  }

  async updateStock(
    id: string,
    name: string,
    price: number,
    description: string,
  ): Promise<Stock> {
    const stockToUpdate = await this.stockRepository.findOne(id);
    if (stockToUpdate) {
      stockToUpdate.name = name;
      stockToUpdate.price = price;
      stockToUpdate.description = description;
      await this.stockRepository.save(stockToUpdate);
    }
    return undefined;
  }

  async findStock(id: string): Promise<Stock> {
    const stock = this.stockRepository.findOne({ id });
    return stock;
  }
}
