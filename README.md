# Frontend Take-Home Challenge Instructions

## Overview

As a member of the Valstro UI Engineering team, you'll be building a multi-window desktop application with complex UI features. Therefore, the purpose of this assessment is to show that you have the fundamentals for building fast reactive UI applications, with modern day best practices.

## Setup

- Clone the repo & cd into it.
- Run `yarn install`
- Followed by `yarn dev` to start the development server

## The Challenge

To build the same simple UI using:

- Vanilla TS (`./src/challenge-1-vanilla.ts`)
- React Functional Components (`./src/challenge-2-ReactFunctionalComp.tsx`)
- React Classes (`./src/challenge-3-ReactClassComp.tsx`)

### Requirements

- Fetch ALL 82 Star Wars characters from `https://swapi.dev/api/people/` ([docs](https://swapi.dev/documentation#people)) paginating through endpoints.
- Display ALL the characters in the HTML table & columns provided (no pagination required)
- - Calculate the "Power" for each character in the power column by multiplying the value from the Multiplier input field by their height & mass (multiplier x height x mass).
- - **Note**: When changing the Multiplier input field, each "Power" value should be calculated and updated in real-time (inside the table)
- The Filter input field should filter the table's list in real-time by the "Name" field
- Pressing "Escape" on the keyboard should reset the Filter field, Multiplier field & subsequently, the tables results.

### Rules

- Functionality should be identical across all three challenges
- Do not change the HTML/JSX structure provided (except for removing the example row)
- Please work within the files provided
- Do not install any new packages

### Notes

- If you want, you may share code between files
- CSS Styling is optional
- If possible, please strongly type your code with Typescript
- For reference, the HTML for the Vanilla challenge is in `./index.html`

### Points

Points will be awarded for clean & concise code, using best practices.

## Time

The project should take no longer than 2-4 hours to complete. If you've not had experience with some of the technologies above and you'd like to spend more time, take as long as you need.

## Example

**YouTube Video**: https://www.youtube.com/watch?v=OdZOCz1sbb4
