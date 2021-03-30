import { Stock } from '../models/stock.model';

export const IStockServiceProvider = 'IStockServiceProvider';

export interface IStockService {
  newStock(
    id: string,
    name: string,
    price: number,
    description: string,
  ): Promise<Stock>;

  getStocks(): Promise<Stock[]>;

  deleteStock(id: string): Promise<void>;

  findStock(id: string): Promise<Stock>;

  updateStock(id: string, name: string, price: number, description: string): Promise<Stock>;
}
