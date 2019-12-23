import store from "./store/index.js";

export default class Component {
  constructor(anchor, settings) {
    this.anchor = anchor;
    this._render_ = this.render.bind(this);
    store.events.subscribe('change', this._render_);

    this.renderComponentTemplate(settings.templateId);
    this.initEvents();
  }

  onDestroy() {
    store.events.unsubscribe('change', this._render_);
    document.getElementById('app').innerHTML = '';
  }

  renderComponentTemplate(templateId) {
    if (!templateId) return;

    this.anchor.append(
      document.getElementById(templateId).content.cloneNode(true)
    );
  }

  initEvents() {
  }

  render() {
  }
}
