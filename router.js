import link from './link.js';
import routerConfig from './routerConfig.js';
import Api from './api.js';

export default class Router {
  constructor(anchor) {
    this.anchor = anchor;

    this._initEvents();
    this._loadPageUrl();

  }

  _loadPageUrl() {
    Api.checkToken()
      .then(isToken => {
        if (isToken) {
          link('/list');
          Api.loadToDos();
        } else {
          link('/login');
        }
      });
  }

  _initEvents() {
    const onRouterChange = event => {
      const route = event.state ? event.state.route : event.detail.route;
      this.changeRoute(route);
    };

    window.addEventListener('changeRoute', onRouterChange);
    window.addEventListener('popstate', onRouterChange);
  }

  changeRoute(route) {
    const conf = routerConfig[route];
    if (!conf) return;

    if (this.component) {
      this.component.onDestroy();
    }

    this.component = new conf.component(this.anchor, conf.settings);
    this.component.render();
  }
}

