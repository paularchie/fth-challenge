import { UIState } from "./types";

export const INITIAL_UI_STATE: UIState = {
  filter: "",
  multiplier: 10,
  filteredCharacters: [],
};

export enum ActionType {
  CHARACTERS_FETCHED = "characters fetched",
  STATE_INITIALIZED = "state initialized",
  NAME_CHANGED = "name changed",
  MULTIPLIER_CHANGED = "multiplier changed",
  ESC_KEY_PRESSED = "escape key pressed",
}
