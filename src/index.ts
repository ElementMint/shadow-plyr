import { ShadowPlyr } from './shadow-plyr';

export { ShadowPlyr };

// Auto-define if not already defined
if (!customElements.get('shadow-plyr')) {
    customElements.define('shadow-plyr', ShadowPlyr);
}