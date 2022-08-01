import { Character, CharactersFetchResponse } from "./types";

const RESOURCE_URL = "https://swapi.dev/api/people";

async function fetchData<T>(resourceUrl: string): Promise<T> {
  return fetch(resourceUrl).then((response) => {
    return response.json();
  });
}

export const fetchCharacters = async (
  url = RESOURCE_URL,
  accumulatedResults: Character[] = []
): Promise<Character[]> => {
  const res = await fetchData<CharactersFetchResponse>(url);

  const results = [...accumulatedResults, ...res.results];

  if (res.next) {
    return await fetchCharacters(res.next, results);
  }

  return results;
};

export const getFilteredCharacters = ({
  characters,
  filter,
}: {
  characters: Character[];
  filter: string;
}) => {
  return characters.filter((character) => {
    return filter
      ? character.name?.toLowerCase().includes(filter.toLowerCase())
      : characters;
  });
};

export const getCharacterPower = (
  character: Character,
  multiplier: number
): number | string => {
  if (character.height === "unknown" || character.mass === "unknown") {
    return "-";
  }

  // Could add some data validation
  const mass = character.mass.includes(",")
    ? character.mass.replace(",", ".")
    : character.mass;

  return Math.round(multiplier * Number(character.height) * Number(mass));
};

/** 
    The 'Event' interface has missing properties 
    That's why I had to overwrite it 
*/
type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type TargetEvent = Overwrite<Event, { code: string }>;

export const escKeyDownHandler = (handleEvent: () => void): EventListener => {
  return (event) => {
    if ((event as TargetEvent).code === "Escape") {
      handleEvent();
    }
  };
};
