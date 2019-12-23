import Component from './component.js';
import Api from './api.js';
import link from "./link.js";

export default class LoginComponent extends Component {
  initEvents() {
    this.anchor
      .querySelector('#login-form')
      .addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();
        const setLogin = document.getElementById('email').value;
        const setPass = document.getElementById('password').value;

        Api.login(setLogin, setPass)
          .then(isLogin => {
            if (isLogin) {
              Api.loadToDos();
              link('/list');
            }
          });
      });
  }
}
