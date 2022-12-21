/**
 * Import styles library
 */
import styles from './index.module.css';

/**
 * Import icons
 */
import { IconTranslate, IconLoader } from '@codexteam/icons';

/**
 * Import types
 */
import { TranslateConfig } from './types';
import { API, InlineTool } from '@editorjs/editorjs';

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
   * Saved text before translation to implement 'revert' feature
   */ 
  private originalText: string = '';

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
      translateIcon: null,
      loader: null,
    };
  }

  /**
   * Inline Tool flag
   */ 
  static get isInline() {
    return true;
  }

  /**
   * Tool's title
   */
  static get title() {
    return 'Translate';
  }

  /**
   * Tool's button with icon
   */ 
  render(): HTMLElement {
    this.nodes.wrapper = document.createElement('button');
    this.nodes.wrapper.classList.add(this.api.styles.inlineToolButton);
    this.nodes.wrapper.type = 'button';

    this.nodes.translateIcon = this.getElementFromHTML(IconTranslate);
    this.nodes.wrapper.appendChild(this.nodes.translateIcon);

    this.nodes.loader = this.getElementFromHTML(IconLoader);
    this.nodes.loader.classList.add(styles.hidden);
    this.nodes.wrapper.appendChild(this.nodes.loader);

    return this.nodes.wrapper;
  }

  /**
   * Processing selected text
   */
  async surround(range: Range): Promise<void> {
    /**
     * Apply 'revert' feature if button was clicked again after translation
     */
    if (this.originalText) {
      this.toggleLoader();

      this.replaceText(range, this.originalText);

      /**
       * Wait for animation to complete as UX improvement
       */
      setTimeout(() => {
        this.toggleLoader(false);
      }, 300);

      /**
       * Restore selection
       */
      this.select(range);

      this.originalText = '';

      return;
    }

    /**
     * Get selected text
     */
    const inputText = range.toString();

    if (!inputText) return;

    /**
     * Translation process
     */
    this.toggleLoader();
    const translatedText = await this.translate(inputText);
    this.toggleLoader(false);

    if (!translatedText) return;

    /**
     * Save original text to implement 'revert' feature
     */ 
    this.originalText = inputText;

    this.replaceText(range, translatedText);

    /**
     * Restore selection
     */ 
    this.select(range);
  }

  /**
   * No need to implement this method
   */
  checkState() {
    return false;
  }

  /**
   * Restore selection method
   */
  select(range: Range) {
    const sel = window.getSelection();
    
    if (!sel) return;

    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Replace text in the selection
   */
  private replaceText(range: Range, text: string): void {
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
  }

  /**
   * Translate text 
   */
  private async translate(text: string): Promise<string | undefined> {
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

  /**
   * Toggle loader element on the button
   * 
   * @param flag — true to add class, false to remove
   */
  private toggleLoader(flag = true): void {
    if (!this.nodes.translateIcon) {
      console.error('[Translate] button is not found');
      return;
    }

    if (!this.nodes.loader) {
      console.error('Loader is not found');
      return;
    };

    this.nodes.translateIcon.classList.toggle(styles.hidden, flag);
    this.nodes.loader.classList.toggle(styles.hidden, !flag);
  }

  /**
   * Create HTML element from string
   * 
   * @param html — HTML string
   */
  private getElementFromHTML(html: string): HTMLElement {
    const template = document.createElement('template');
   
    template.innerHTML = html.trim();
   
    return template.content.firstChild as HTMLElement;
  }
};