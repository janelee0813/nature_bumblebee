import { renderPage } from './pages.js';
import { initSiteUI } from './home.js';

renderPage(document.body.dataset.page);
initSiteUI();
