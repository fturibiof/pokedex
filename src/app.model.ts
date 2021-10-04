export class Pokemon {
  '#': string;
  Name: string;
  'Type 1': string;
  'Type 2': string;
  Total: string;
  HP: string;
  Attack: string;
  Defense: string;
  'Sp. Atk': string;
  'Sp. Def': string;
  Speed: string;
  Generation: string;
  Legendary: string;
}

export interface FindAllQuery {
  take: number;
  skip: number;
}
