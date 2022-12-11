🚧 Development in progress 🚧

![Translate Inline Demo Video](./docs/demo.gif)

# Translate Inline Tool for Editor.js

This tool allows you to translate text inline to english. 

Requires a translation service. See [Translation Service](#translation-service) for more information.

## Features

Works in any block. just select the text and click the Translate button in the toolbar.

Source language is detected automatically.

Example docker container for the translation service is provided.

`Soon` Choosing the target language to translate.

`Soon` Support for the offical Google Translate API.

## Installation

### Translation Service

This server example uses the [googletrans](https://github.com/ssut/py-googletrans) python package to translate text. Don't use it in production, it's just an example.

Use the [docker-compose.yml](./server/docker-compose.yml) to build and run the translation service.

### Tool itself

Use your package manager to install the package `editorjs-translate-inline`.

```
npm install editorjs-translate-inline

yarn add editorjs-translate-inline
```

Add the Tool to your Editor.js configuration and provide the endpoint of the translation service.

```
tools: {
  // ...

  translator: {
    class: translator,
    config: {
      endpoint: 'http://localhost:5000/translate?text=',
    }
  },
},
```

## Development

Run translation server:

```
cd server
docker-compose up
```

Run package builder:

`npm run dev` / `yarn dev` — run development environment with hot reload

`npm run build` / `yarn build` — build the tool for production to the `dist` folder

## Links

[Editor.js](https://editorjs.io) • [Create Tool](https://github.com/editor-js/create-tool)