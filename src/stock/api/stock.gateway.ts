import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import {
  IStockService,
  IStockServiceProvider,
} from '../core/primary-ports/stock.service.interface';
import { Socket } from 'ngx-socket-io';
import { Stock } from '../core/models/stock.model';
import { CreateStockDto } from './dtos/create-stock.dto';
import { AllStocksDto } from './dtos/all-stocks.dto';
import { ChangePriceDto } from './dtos/change-price.dto';

@WebSocketGateway()
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IStockServiceProvider) private stockService: IStockService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('create-stock')
  async handleCreateStock(
    @MessageBody() data: CreateStockDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const stock: Stock = {
        name: data.name,
        description: data.description,
        price: data.value,
      };

      const stockCreated = await this.stockService.newStock(stock);
      const dto: AllStocksDto = {
        stocks: await this.stockService.getStocks(),
      };
      this.server.emit('allStocks', dto);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage('price-change')
  async handlePriceChange(
    @MessageBody() data: ChangePriceDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('trying to change price');
      await this.stockService.ChangePrice(data.id, data.newPrice);
      const dto: AllStocksDto = {
        stocks: await this.stockService.getStocks(),
      };
      this.server.emit('allStocks', dto);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage('delete-stock')
  async handleDeleteStock(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const deleted = await this.stockService.deleteStock(id);
      const dto: AllStocksDto = {
        stocks: await this.stockService.getStocks(),
      };
      this.server.emit('allStocks', dto);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage('allStocks')
  async handleGetStocks(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const dto: AllStocksDto = {
        stocks: await this.stockService.getStocks(),
      };
      client.emit('allStocks', dto);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  async handleDisconnect(client: any) {
    console.log('Client disconnect', client.id);
  }

  async handleConnection(client: any, ...args: any[]) {
    console.log('Client connect', client.id);
    const dto: AllStocksDto = {
      stocks: await this.stockService.getStocks(),
    };
    client.emit('allStocks', dto);
  }
}
