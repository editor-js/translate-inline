import { ToolConfig } from '@editorjs/editorjs';

/**
 * Translate Tool's configuration object that passed through the initial Editor config
 */
export interface TranslateConfig extends ToolConfig {
  /**
   * API endpoint to send requests to
   * @example http://localhost:5000/translate?text=
   */ 
  endpoint: string;
}