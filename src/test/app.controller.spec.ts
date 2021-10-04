import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { mockPokemon, mockPokemonList, mockPokemonListOffset } from './mocks';

describe('AppController', () => {
  let appController: AppController;
  const mockAppService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('findAll should return list with all pokemons', async () => {
    const spy = jest
      .spyOn(mockAppService, 'findAll')
      .mockResolvedValue(mockPokemonList);
    const res = await appController.findAll(undefined);
    expect(spy).toHaveBeenCalledWith(undefined);
    expect(res).toStrictEqual(mockPokemonList);
  });

  it('findAll should return list with pokemons after the given offset', async () => {
    const spy = jest
      .spyOn(mockAppService, 'findAll')
      .mockResolvedValue(mockPokemonListOffset);
    const res = await appController.findAll({ take: 2, skip: 1 });
    expect(spy).toHaveBeenCalledWith({ take: 2, skip: 1 });
    expect(res).toStrictEqual(mockPokemonListOffset);
  });

  it('findOne should return especific pokemon based on given #', async () => {
    const spy = jest
      .spyOn(mockAppService, 'findOne')
      .mockResolvedValue(mockPokemon);
    const res = await appController.findOne('1');
    expect(spy).toHaveBeenCalledWith('1');
    expect(res).toStrictEqual(mockPokemon);
  });

  it('create should create new pokemon', async () => {
    const spy = jest
      .spyOn(mockAppService, 'create')
      .mockResolvedValue(mockPokemon);
    const res = await appController.create(mockPokemon);
    expect(spy).toHaveBeenCalledWith(mockPokemon);
    expect(res).toStrictEqual(mockPokemon);
  });

  it('update should update a pokemon', async () => {
    const spy = jest
      .spyOn(mockAppService, 'update')
      .mockResolvedValue(mockPokemon);
    const res = await appController.update('1', mockPokemon);
    expect(spy).toHaveBeenCalledWith('1', mockPokemon);
    expect(res).toStrictEqual(mockPokemon);
  });

  it('delete should delete a pokemon', async () => {
    const spy = jest.spyOn(mockAppService, 'delete');
    const res = await appController.delete('1');
    expect(spy).toHaveBeenCalledWith('1');
    expect(res).toBeFalsy();
  });
});
