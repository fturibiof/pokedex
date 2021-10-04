import { Test, TestingModule } from '@nestjs/testing';
import { writeFileSync } from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { join } from 'path';
import { Pokemon } from 'src/app.model';
import { AppService } from '../app.service';
import {
  mockedPokemonList,
  mockedPokemonListWithOffset,
  mockPokemon,
  originalMockCsv,
} from './mocks';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CsvParser, AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
    appService.path = join(__dirname, 'mock_pokemon.csv');
  });

  afterAll(async () => {
    await writeFileSync(appService.path, originalMockCsv);
  });

  it('findAll should return all pokemons', async () => {
    const res = await appService.findAll(undefined);
    expect(res).toEqual(mockedPokemonList);
  });

  it('findAll should return pokemons according to given offset', async () => {
    const res = await appService.findAll({ skip: 1, take: 2 });
    expect(res).toEqual(mockedPokemonListWithOffset);
  });

  it('findOne should return the requested pokemon', async () => {
    const res = await appService.findOne('1');
    expect(res).toEqual([mockPokemon]);
  });

  it('create should create new pokemon', async () => {
    const initial = await appService.findAll(undefined);
    await appService.create({
      '#': '4',
      Name: 'Testmon',
      'Type 1': 'Fire',
      'Type 2': 'Dragon',
      Total: '100',
      HP: '100',
      Attack: '10',
      Defense: '20',
      'Sp. Atk': '50',
      'Sp. Def': '0',
      Speed: '15',
      Generation: '4',
      Legendary: 'False',
    } as Pokemon);
    const final = await appService.findAll(undefined);
    expect(initial.total).toEqual(3);
    expect(final.total).toEqual(4);
  });

  it('update should update specified pokemon', async () => {
    const modifiedPokemon = {
      '#': '3',
      Name: 'Venusaur',
      'Type 1': 'Grass',
      'Type 2': 'Poison',
      Total: '525',
      HP: '80',
      Attack: '82',
      Defense: '83',
      'Sp. Atk': '100',
      'Sp. Def': '100',
      Speed: '80',
      Generation: '1',
      Legendary: 'True',
    } as Pokemon;
    const res = await appService.update('3', modifiedPokemon);
    const pokemon = await appService.findOne('3');
    expect(res).toEqual(modifiedPokemon);
    expect(pokemon[0].Legendary).toBe('True');
  });

  it('delete should delete the requested pokemon', async () => {
    const initial = await appService.findAll(undefined);
    await appService.delete('4');
    const final = await appService.findAll(undefined);
    expect(initial.total).toEqual(4);
    expect(final.total).toEqual(3);
  });
});
