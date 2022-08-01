// Note: The HTML for this challenge can be found in index.html
// Note: this function is run inside of src/main.tsx

import { ActionType, INITIAL_UI_STATE } from "./shared/constants";
import { Character, UIState } from "./shared/types";
import {
  escKeyDownHandler,
  fetchCharacters,
  getCharacterPower,
  getFilteredCharacters,
} from "./shared/utils";

const selectors = {
  getContainer() {
    return document.querySelector("#vanilla");
  },
  getLoader() {
    return this.getContainer()?.querySelector("#loader")!;
  },
  getTableBody() {
    return this.getContainer()?.querySelector("#tbody")!;
  },
  getMultiplierInput() {
    return <HTMLInputElement>this.getContainer()?.querySelector("#multiplier");
  },
  getFilterInput() {
    return <HTMLInputElement>this.getContainer()?.querySelector("#filter");
  },
};

type PubSub = {
  subscribe: Function;
  unsubscribe: Function;
  publish: Function;
};

//TODO: add Generic type for payload
function PubSub() {
  const subscribers: { [key: string]: Array<Function> } = {};

  function subscribe(event: string, callbacks: Function[]) {
    if (!subscribers[event]) {
      subscribers[event] = [];
    }
    subscribers[event] = [...subscribers[event], ...callbacks];
  }

  //TODO: make is possible to pass an array of callbacks
  function unsubscribe(event: string, callback: Function) {
    subscribers[event] = subscribers[event].filter((cb: Function) => {
      return cb !== callback;
    });
  }

  function publish(event: string, state: UIState) {
    if (!subscribers[event]) {
      return;
    }
    subscribers[event].forEach((callback) => {
      callback(state);
    });
  }

  return {
    subscribe,
    unsubscribe,
    publish,
  };
}

function Store(pubSub: PubSub) {
  let state: UIState = INITIAL_UI_STATE;

  function initializeState(characters: Character[]) {
    state = {
      ...state,
      filteredCharacters: getFilteredCharacters({
        characters,
        filter: state.filter,
      }),
    };

    pubSub.publish(ActionType.STATE_INITIALIZED, state);
  }

  function updateState({
    characters,
    filter,
    multiplier,
  }: {
    characters: Character[];
    filter?: string;
    multiplier?: number;
  }) {
    if (typeof filter === "string") {
      state = {
        ...state,
        filter,
        filteredCharacters: getFilteredCharacters({
          characters,
          filter,
        }),
      };

      pubSub.publish(ActionType.NAME_CHANGED, state);
    }

    if (multiplier) {
      state = {
        ...state,
        multiplier,
      };

      pubSub.publish(ActionType.MULTIPLIER_CHANGED, state);
    }
  }

  function resetState({ characters }: { characters: Character[] }) {
    const { filter } = INITIAL_UI_STATE;
    state = {
      ...INITIAL_UI_STATE,
      filteredCharacters: getFilteredCharacters({
        characters,
        filter,
      }),
    };

    pubSub.publish(ActionType.STATE_INITIALIZED, state);
  }

  return {
    initializeState,
    updateState,
    resetState,
  };
}

function Renderer() {
  function renderRows(state: UIState) {
    const tbody = selectors.getTableBody();

    if (tbody.firstChild) {
      removeRows();
    }

    state.filteredCharacters.forEach((character) => {
      const row = document.createElement("tr");

      const nameCol = document.createElement("td");
      const heightCol = document.createElement("td");
      const massCol = document.createElement("td");
      const powerCol = document.createElement("td");

      nameCol.innerText = character.name;
      heightCol.innerText = character.height;
      massCol.innerText = character.mass;
      powerCol.innerText = getCharacterPower(
        character,
        state.multiplier
      ).toString();

      row.appendChild(nameCol);
      row.appendChild(heightCol);
      row.appendChild(massCol);
      row.appendChild(powerCol);

      tbody.appendChild(row);
    });
  }

  function updateTableRows(state: UIState) {
    removeRows();
    renderRows(state);
  }

  function removeRows() {
    const tbody = selectors.getTableBody();

    while (tbody.firstChild) {
      tbody.firstChild.remove();
    }
  }

  function updateCharacterPower(state: UIState) {
    const rows = selectors.getTableBody().children;

    state.filteredCharacters.forEach((character, index) => {
      const powerColumn = rows[index].children[3];
      powerColumn.textContent = getCharacterPower(
        character,
        state.multiplier
      ).toString();
    });
  }

  function updateInputValues(state: UIState) {
    selectors.getFilterInput().value = state.filter;
    selectors.getMultiplierInput().value = state.multiplier.toString();
  }

  return {
    renderRows,
    updateTableRows,
    updateCharacterPower,
    updateInputValues,
  };
}

export async function runVanillaApp() {
  const pubSub = PubSub();
  const store = Store(pubSub);
  const renderer = Renderer();

  /** Set up subscriptions */
  pubSub.subscribe(ActionType.STATE_INITIALIZED, [
    renderer.renderRows,
    renderer.updateInputValues,
  ]);
  pubSub.subscribe(ActionType.NAME_CHANGED, [renderer.updateTableRows]);
  pubSub.subscribe(ActionType.MULTIPLIER_CHANGED, [
    renderer.updateCharacterPower,
  ]);

  /** Clean up all references in memory */
  selectors.getContainer()?.addEventListener("unload", function () {
    pubSub.unsubscribe(ActionType.STATE_INITIALIZED, renderer.renderRows);
    pubSub.unsubscribe(
      ActionType.STATE_INITIALIZED,
      renderer.updateInputValues
    );
    pubSub.unsubscribe(ActionType.NAME_CHANGED, renderer.updateTableRows);
    pubSub.unsubscribe(
      ActionType.MULTIPLIER_CHANGED,
      renderer.updateCharacterPower
    );
  });

  const characters = await fetchCharacters();
  selectors.getLoader().remove();

  store.initializeState(characters);

  /** Add event listeners */
  selectors.getFilterInput()?.addEventListener("keyup", function ({ target }) {
    store.updateState({
      characters,
      filter: (target as HTMLInputElement).value,
    });
  });

  selectors
    .getMultiplierInput()
    ?.addEventListener("change", function ({ target }) {
      store.updateState({
        characters,
        multiplier: Number((target as HTMLInputElement).value),
      });
    });

  selectors
    .getContainer()
    ?.addEventListener("keyup", escKeyDownHandler(handleEsc));

  function handleEsc() {
    store.resetState({ characters });
  }
}
