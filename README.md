# Translate Inline Tool for Editor.js

This tool allows you to translate text inline to english. 

Requires a translation service. See [Translation Service](#translation-service) for more information.

![Translate Inline Demo Video](./assets/demo.gif)

## Features

Works in any block. just select the text and click the Translate button in the toolbar.

Source language is detected automatically.

Example of the translation service server is provided.

`Soon` Choosing the target language to translate.

`Soon` Support for the offical Google Translate API.

## Installation

### Translation Service

Features of the example translation service:

- uses the [googletrans](https://github.com/ssut/py-googletrans) python package to translate text;
- runs on port 5000;
- CORS are enabled for all origins.

You can run the server locally via [venv](#via-venv) or [docker](#via-docker). On the production you can use  

For the production environment you should use a different translation service cause the `googletrans` package is not meant for production use. But you can use the example server as a starting point.

### Usage

Use your package manager to install the package `editorjs-translate-inline`.

```shell
npm install -D @editorjs/translate-inline

yarn add -D @editorjs/translate-inline
```

Import and add the Tool to your Editor.js configuration and provide the endpoint of the translation service.

```javascript
import Translate from '@editorjs/translate-inline';

const editor = new EditorJS({
  tools: {
    translator: {
      class: Translate,
      config: {
        endpoint: 'http://localhost:5000/translate?text=',
      }
    },
  },

  // ...
});
```

## Development

### Run package builder

`npm run dev` / `yarn dev` — run development environment with hot reload

`npm run build` / `yarn build` — build the tool for production to the `dist` folder

### Run translation server

### Via venv

Use venv to create a virtual environment and activate it.

```shell
cd server
python3 -m venv venv
source venv/bin/activate
```

Install the requirements and run the server.

```shell
python -m pip install -r requirements.txt
python main.py
```

Deactivate the virtual environment when you're done.

```shell
deactivate
```

### Via docker

Build the docker image and run the container.

```shell
cd server
docker build -t editorjs-translate-inline .
docker run -p 5000:5000 editorjs-translate-inline
```

To rebuild the image after changes run `docker build --no-cache -t editorjs-translate-inline .`

## Links

[Editor.js](https://editorjs.io) • [Create Tool](https://github.com/editor-js/create-tool)