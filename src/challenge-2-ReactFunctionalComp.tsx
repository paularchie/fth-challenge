import React, { useEffect, useReducer, useState } from "react";
import { ActionType, INITIAL_UI_STATE } from "./shared/constants";
import { Action, Character, UIState } from "./shared/types";
import {
  fetchCharacters,
  getCharacterPower,
  getFilteredCharacters,
  escKeyDownHandler,
} from "./shared/utils";

type QueryState<T> = {
  data: T;
  loading: boolean;
};

const useCharactersQuery = () => {
  const [state, setState] = useState<QueryState<Character[]>>({
    loading: true,
    data: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const characters = await fetchCharacters();

    setState({
      data: characters,
      loading: false,
    });
  };

  return state;
};

const reducer = (state: UIState, action: Action): UIState => {
  const { payload } = action;

  const actionMapping: { [key: string]: Function } = {
    [ActionType.CHARACTERS_FETCHED]: initializeState,
    [ActionType.NAME_CHANGED]: filterCharacters,
    [ActionType.MULTIPLIER_CHANGED]: updateMultiplier,
    [ActionType.ESC_KEY_PRESSED]: resetState,
  };

  return actionMapping[action.type] ? actionMapping[action.type]() : state;

  function initializeState(): UIState {
    return {
      ...state,
      filteredCharacters: getFilteredCharacters({
        characters: payload.characters || [],
        filter: state.filter,
      }),
    };
  }

  function filterCharacters(): UIState {
    const { filter } = payload;

    return {
      ...state,
      filteredCharacters: getFilteredCharacters({
        characters: action.payload.characters || [],
        filter: filter || "",
      }),
      filter: filter || "",
    };
  }

  function updateMultiplier(): UIState {
    return {
      ...state,
      multiplier: payload.multiplier || 1,
    };
  }

  function resetState(): UIState {
    const { filter } = INITIAL_UI_STATE;

    return {
      ...INITIAL_UI_STATE,
      filteredCharacters: getFilteredCharacters({
        characters: payload.characters || [],
        filter,
      }),
    };
  }
};

function FunctionalComp() {
  const { data: characters, loading } = useCharactersQuery();
  const [state, dispatch] = useReducer(reducer, INITIAL_UI_STATE);
  const { filter, multiplier, filteredCharacters } = state;

  useEffect(() => {
    if (characters.length) {
      const compContainer: HTMLDivElement =
        document.querySelector("#functional-comp")!;

      compContainer.addEventListener("keydown", handleEscKeyDown);

      return () => {
        compContainer.removeEventListener("keydown", handleEscKeyDown);
      };
    }
  }, [characters]);

  useEffect(() => {
    if (characters && characters.length) {
      dispatch({
        type: ActionType.CHARACTERS_FETCHED,
        payload: { characters },
      });
    }
  }, [characters, dispatch]);

  const handleEscKeyDown = escKeyDownHandler(() =>
    dispatch({
      type: ActionType.ESC_KEY_PRESSED,
      payload: {
        characters,
      },
    })
  );

  const handleNameChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.NAME_CHANGED,
      payload: { characters, filter: target.value },
    });
  };

  const handleMultiplierChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionType.MULTIPLIER_CHANGED,
      payload: {
        multiplier: Number(target.value),
      },
    });
  };

  return (
    <div id="functional-comp">
      <h2>React Functional Component</h2>
      Filter:{" "}
      <input
        placeholder="Filter by name"
        value={filter}
        onChange={handleNameChange}
      />{" "}
      Multiplier:{" "}
      <input
        placeholder="Multiplier"
        type="number"
        min="1"
        max="20"
        value={multiplier}
        onChange={handleMultiplierChange}
      />{" "}
      Press "Escape" to reset fields
      {loading && <div className="loader">Loading...</div>}
      <table width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {filteredCharacters.map((character) => {
            return (
              <tr key={character.name}>
                <td>{character.name}</td>
                <td>{character.height}</td>
                <td>{character.mass}</td>
                <td>{getCharacterPower(character, multiplier)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FunctionalComp;
