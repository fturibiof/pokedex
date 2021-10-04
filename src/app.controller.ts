import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FindAllQuery } from './app.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async findAll(@Query() query: FindAllQuery) {
    return await this.appService.findAll(query);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.appService.findOne(id);
  }

  @Post('/')
  async create(@Body() body) {
    return await this.appService.create(body);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body) {
    return await this.appService.update(id, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.appService.delete(id);
  }
}
