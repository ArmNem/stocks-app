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
import { IStockService, IStockServiceProvider } from '../core/primary-ports/stock.service.interface';

@WebSocketGateway()
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IStockServiceProvider) private chatService: IStockService,
  ) {
  }
  @WebSocketServer() server;



  @SubscribeMessage('create-stock')
  async handleCreateStock(
    @MessageBody() data: StockDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const stock: Stock = {
        name: data.name,
        description: data.description,
        price: data.price,
      };

      const stockCreated = await this.stockService.createStock(stock);
      const dto: AllStocksDto = {
        stocks: await this.stockService.getAllStocks(),
      };
      this.server.emit('allStocks', dto);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  handleDisconnect(client: any) {
        throw new Error('Method not implemented.');
    }

  handleConnection(client: any, ...args: any[]) {
        throw new Error('Method not implemented.');
    }
