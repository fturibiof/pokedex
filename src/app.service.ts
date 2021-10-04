import { Injectable } from '@nestjs/common';
import { createReadStream, ReadStream, writeFileSync } from 'fs';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import { join } from 'path';
import { FindAllQuery, Pokemon } from './app.model';
const MAX_PAGE_SIZE = 1000;

@Injectable()
export class AppService {
  path = join(__dirname, 'assets/pokemon.csv');
  columns =
    '#,Name,Type 1,Type 2,Total,HP,Attack,Defense,Sp. Atk,Sp. Def,Speed,Generation,Legendary\r\n';

  constructor(private readonly csvParser: CsvParser) {}

  async findAll(query: FindAllQuery): Promise<ParsedData<Pokemon>> {
    try {
      const stream = await createReadStream(this.path);
      return this.convertCsvToObj(stream, query);
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string): Promise<Pokemon[]> {
    try {
      const stream = await createReadStream(this.path);
      const pokemons: ParsedData<Pokemon> = await this.convertCsvToObj(stream);
      return pokemons.list.filter((pokemon) => pokemon['#'] === id);
    } catch (error) {
      console.error(error);
    }
  }

  async create(body: Pokemon): Promise<Pokemon> {
    try {
      const stream = await createReadStream(this.path);
      const csvList = await this.streamToString(stream);
      const parsedPokemon = this.convertObjToCsv(body);
      await writeFileSync(this.path, csvList + parsedPokemon);
      return body;
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id: string) {
    try {
      const stream = await createReadStream(this.path);
      const pokemons: ParsedData<Pokemon> = await this.convertCsvToObj(stream);
      const filteredList = pokemons.list.filter((pokemon) => pokemon['#'] !== id);
      let csv = this.columns;
      filteredList.map((pokemon) => {
        csv += this.convertObjToCsv(pokemon);
      });
      await writeFileSync(this.path, csv);
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: string, body: Pokemon) {
    try {
      await this.delete(id);
      return await this.create(body);
    } catch (error) {
      console.error(error);
    }
  }

  private async streamToString(stream: ReadStream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    return buffer.toString('utf-8');
  }

  private convertObjToCsv(body: Pokemon): string {
    let str = '';
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        str = str + body[key] + ',';
      }
    }
    return str.slice(0, -1) + '\r\n';
  }

  private async convertCsvToObj(stream: ReadStream, query?) {
    return await this.csvParser.parse(
      stream,
      Pokemon,
      query?.take || MAX_PAGE_SIZE,
      query?.skip || 0,
      {
        strict: true,
        separator: ',',
      },
    );
  }
}
