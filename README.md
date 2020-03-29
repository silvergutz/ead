# e-learning platform RESTFull API made with Adonis

## Setup

### Dependencies

Using npm: 

```bash
npm install
```

Using yarn

```bash
yarn install
```

### Adonis CLI

Install Adonis Cli tool to run adonis commands

Using npm
```bash
npm install --global @adonisjs/cli
```

or using yarn
```bash
yarn global @adonisjs/cli
```

### ENVIRONMENT VARS

```bash
cp .env.example .env
```

### GENERATE NEW APP KEY

```bash
adonis key:generate
```

### Database Migrations

Run the following command to run startup migrations.

```bash
adonis migration:run
```

## Run API for dev

```bash
adonis serve --dev
```

## API RESTFull Insomnia template

Includes file `insomnia.json` that can be imported to Insomnia to test the API

## Frontend

The web frontend was made under react-script

### Develpment

To run dev server use start script

with npm: 
```bash
npm run start
```

with yarn:
```bash
yarn start
```

### Production

Change .env.production file and run build script

with npm:
```bash
npm run build
```

with yarn:
```bash
yarn build
``` 

