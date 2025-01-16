import { Body, Controller, Get, HttpException, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}
  maze: string = '';


  @Get('maze')
  getMaze(): string {
    if (this.maze === '') throw new HttpException('Maze not set', 404);
    return this.maze;
  }

  @Post('maze')
  async setMaze(@Body() body) {
    let mazeContent: string = body.maze;

    if (mazeContent === undefined) {
      throw new HttpException('Maze not set', 404);
    }
    if (mazeContent.length === 0) {
      throw new HttpException('Maze is empty', 404);
    }
    if (!mazeContent.match(/((0|1){6})+/)) {
      throw new HttpException('Maze is not valid', 404);
    } 
    this.maze = mazeContent;
  }
}
