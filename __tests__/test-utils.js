import {fileURLToPath} from 'url';
import {dirname} from 'path';

/**
 * Get the directory name of the current module (ESM equivalent of __dirname)
 * @param {string} importMetaUrl - import.meta.url from the calling module
 * @returns {string} The directory path
 */
export function getDirname(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}
