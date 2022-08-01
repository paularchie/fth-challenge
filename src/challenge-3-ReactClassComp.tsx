import { Component } from "react";
import { INITIAL_UI_STATE } from "./shared/constants";
import { Character, UIState } from "./shared/types";
import {
  fetchCharacters,
  getCharacterPower,
  getFilteredCharacters,
  escKeyDownHandler,
} from "./shared/utils";

type ComponentState = {
  characters: Character[];
  isLoading: boolean;
  ui: UIState;
};

type Props = {};

class ClassComp extends Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      characters: [],
      isLoading: true,
      ui: INITIAL_UI_STATE,
    };
  }

  componentDidMount(): void {
    this.fetchDataAndInitState();

    const compContainer = this.getContainer();

    if (compContainer) {
      compContainer.addEventListener("keydown", this.handleEscKeyDown);
    }
  }

  componentWillUnmount(): void {
    const compContainer = this.getContainer();

    if (compContainer) {
      compContainer.removeEventListener("keydown", this.handleEscKeyDown);
    }
  }

  getContainer(): HTMLDivElement | null {
    return document.querySelector("#class-comp");
  }

  async fetchDataAndInitState(): Promise<void> {
    const characters = await fetchCharacters();

    const state = {
      ...this.state,
      isLoading: false,
      characters,
      ui: {
        ...this.state.ui,
        filteredCharacters: getFilteredCharacters({
          characters: characters || [],
          filter: this.state.ui.filter,
        }),
      },
    };

    this.setState(state);
  }

  handleEscKeyDown: (event: KeyboardEvent) => void = escKeyDownHandler(() => {
    const { filter, multiplier } = INITIAL_UI_STATE;

    const state = {
      ...this.state,
      ui: {
        ...this.state.ui,
        filter,
        multiplier,
        filteredCharacters: getFilteredCharacters({
          characters: this.state.characters,
          filter,
        }),
      },
    };

    this.setState(state);
  });

  handleNameChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const filter = target.value;

    const state = {
      ...this.state,
      ui: {
        ...this.state.ui,
        filter,
        filteredCharacters: getFilteredCharacters({
          characters: this.state.characters,
          filter,
        }),
      },
    };

    this.setState(state);
  };

  handleMultiplierChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const state = {
      ...this.state,
      ui: {
        ...this.state.ui,
        multiplier: Number(target.value),
      },
    };

    this.setState(state);
  };

  render() {
    return (
      <div id="class-comp">
        <h2>React Class Component</h2>
        Filter:{" "}
        <input
          placeholder="Filter by name"
          value={this.state.ui.filter}
          onChange={this.handleNameChange}
        />{" "}
        Multiplier:{" "}
        <input
          placeholder="Multiplier"
          type="number"
          min="1"
          max="20"
          value={this.state.ui.multiplier}
          onChange={this.handleMultiplierChange}
        />{" "}
        Press "Escape" to reset fields
        {this.state.isLoading && <div className="loader">Loading...</div>}
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
            {this.state.ui.filteredCharacters.map((character) => {
              return (
                <tr key={character.name}>
                  <td>{character.name}</td>
                  <td>{character.height}</td>
                  <td>{character.mass}</td>
                  <td>
                    {getCharacterPower(character, this.state.ui.multiplier)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ClassComp;
