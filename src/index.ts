import { ShadowPlyr } from './shadow-plyr';

export { ShadowPlyr };

// Auto-define if not already registered
if (!customElements.get('shadow-plyr')) {
  customElements.define('shadow-plyr', ShadowPlyr);
}