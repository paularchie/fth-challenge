import { ActionType } from "./constants";

export type Character = {
  name: string;
  height: string;
  mass: string;
};

export type CharactersFetchResponse = {
  count: number;
  next?: string;
  previous?: string;
  results: Character[];
};

export type Payload = {
  characters?: Character[];
  filter?: string;
  multiplier?: number;
};

export type Action = {
  type: ActionType;
  payload: Payload;
};

export type UIState = {
  filter: string;
  multiplier: number;
  filteredCharacters: Character[];
};
