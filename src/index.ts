/**
 * Import styles library
 */
import styles from './index.module.css';

/**
 * Import icons
 */
import { IconTranslate, IconUndo } from '@codexteam/icons';

/**
 * Import types
 */
import { TranslateConfig } from './types';
import { API, BlockAPI, InlineTool } from '@editorjs/editorjs';

/**
 * Translate Tool for Editor.js
 */
export default class Translate implements InlineTool {
  /**
   * Code API — public methods to work with Editor
   * 
   * @link https://editorjs.io/api
   */
  private readonly api: API;

  /**
   * Configuration object that passed through the initial Editor configuration.
   */
  private config: TranslateConfig;

  /**
   * Tool's HTML nodes
   */
  private nodes: {[key: string]: HTMLElement | null};

  /**
   * Tool's state
   */ 
  private originalText: string;

  /**
   * Class constructor
   * 
   * @link https://editorjs.io/tools-api#class-constructor
   */
  constructor({ config, api }: { config: TranslateConfig, api: API }) {
    this.config = config;  

    this.api = api;

    /**
     * Declare Tool's nodes
     */
    this.nodes = {
      wrapper: null,
      buttonTranslate: null,
    };

    this.originalText = '';
  }


  static get isInline() {
    return true;
  }

  static get title() {
    return 'Translate';
  }

  render() {
    this.nodes.wrapper = document.createElement('button');
    this.nodes.wrapper.classList.add(this.api.styles.inlineToolButton);
    this.nodes.wrapper.type = 'button';

    this.nodes.buttonTranslate = document.createElement('span');
    this.nodes.buttonTranslate.innerHTML = IconTranslate;
    this.nodes.wrapper.appendChild(this.nodes.buttonTranslate);

    return this.nodes.wrapper;
  }

  async surround(range: Range) {
    /**
     * Apply 'revert' feature if button was clicked again after translation
     */
    if (this.originalText) {
      this.toggleAnimatedButton('ccw');
      range.deleteContents();
      range.insertNode(document.createTextNode(this.originalText));

      setTimeout(() => {
        this.toggleAnimatedButton('ccw', false);
      }, 300);

      this.select(range);

      this.originalText = '';
      return;
    }

    const inputText = range.toString();

    if (!inputText) return;

    this.toggleAnimatedButton('cw');
    const translatedText = await this.translate(inputText);
    this.toggleAnimatedButton('cw', false);

    if (!translatedText) return;

    this.originalText = inputText;

    range.deleteContents();
    range.insertNode(document.createTextNode(translatedText));

    this.select(range);
  }

  /**
   * No need to implement this method
   */
  checkState() {
    return false;
  }

  select(range: Range) {
    const sel = window.getSelection();
    
    if (!sel) return;

    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Translate text 
   */
  private async translate(text: string) {
    /**
     * Do not send empty strings to the server
     */
    if (!text) return;

    try {
      if (!this.config.endpoint) {
        throw new Error('Translation endpoint is not specified');
      }  

      let response;

      /**
       * Try to send a request to the translation server
       */
      try {
        response = await fetch(`${this.config.endpoint}${text}`);
      } catch (error) {
        throw new Error('Translation server is not available');
      }

      /**
       * Process non-200 responses
       */
      if (response.status !== 200) {
        throw new Error('Bad response from translation server');
      }

      const data = await response.json();

      /**
       * Process server responses with errors
       */
      if (data.status == 'error') {
        throw new Error(`Server error: ${data.message}`);
      }

      return data.message;

    } catch (error: any) {
      /**
       * Show error notification
       */
      this.api.notifier.show({
        message: error.message,
        style: 'error',
      });
    }
  }

  private toggleAnimatedButton(direction: 'cw'|'ccw', flag = true) {
    if (!this.nodes.buttonTranslate) return;

    this.nodes.buttonTranslate.classList.toggle(styles[`rotate-${direction}`], flag);
  }
};