# Edubopper

## Requirements

Node 24.04 LTS

## Installation

```bash
npm i
```

## Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`

## Guide

The website has 2 routes :

- [/](http://localhost:3000)
- [/result](http://localhost:3000/result)

You can access the random generation at the / route if you add `?random=true` at the end of it, such as :

- `http://localhost:3000?random=true`

Since I implemented every cards' functionalities (classe, spécialité, and notes), prefilling is done on the highschool only, the cards are dynamically loading a random highschool, with a pre-deterministic random "seed" (modulo based on index), so depending on the highschool you get, you get specific Bac specialités.
