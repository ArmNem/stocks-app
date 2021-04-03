import { Stock } from '../models/stock.model';

export const IStockServiceProvider = 'IStockServiceProvider';

export interface IStockService {
  newStock(stock: Stock): Promise<Stock>;

  getStocks(): Promise<Stock[]>;

  deleteStock(id: string): Promise<void>;

  findStock(id: string): Promise<Stock>;

  updateStock(stock: Stock): Promise<Stock>;

  ChangePrice(id: string, newPrice: number): Promise<Stock>;
}
