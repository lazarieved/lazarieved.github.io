import store from "./store/index.js";

class Api {
  constructor(url) {
    this.baseUrl = url;
    this.token = localStorage.getItem('token');

    this.get = this.sendResponse('GET');
    this.post = this.sendResponse('POST');
    this.delete = this.sendResponse('DELETE');
    this.put = this.sendResponse('PUT');
  }

  sendResponse = type => (path, params) => {
    return fetch(`${this.baseUrl}${path}`, {
      body: JSON.stringify(params),
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    }).then(response => response.json());
  };

  checkToken() {
    return new Promise(resolve => {
        if (!this.token) {
          resolve(false);
          return;
        }

        this.get('/me')
          .then(response => {
            if (response.token) {
              this.token = response.token;
              resolve(true);
            } else {
              this.token = null;
              resolve(false);
            }
          })
      }
    )
  }

  login(email, password) {
    return new Promise(resolve => {
      this.post('/login', {email, password})
        .then(response => {
          if (response.token) {
            this.token = response.token;
            localStorage.setItem('token', this.token);
            resolve(true);
          } else {
            resolve(false);
            alert('Wrong Email or Password');
          }
        })
    })
  }

  createToDos(text) {
    return new Promise(resolve => {
      this.post('/todos', {text})
        .then(response => {
            if (response._id) {
              resolve(response);
            } else {
              resolve(false);
              alert(response.error);
            }
          }
        )
    })
  }

  loadToDos() {
    return new Promise(resolve => {
        this.get('/todos')
          .then(response => {
            if (!response) {
              resolve(false);
              return;
            }

            if (response.error) {
              alert(response.error);
              return;
            }

            store.dispatch('addItems', response);
            resolve(true);
          })
      }
    )
  }

  deleteToDos(id) {
    return new Promise(resolve => {
      this.delete(`/todos/${id}`)
        .then(response => {
          if (response._id) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
    })
  }

  editTodo({id, text, completed}) {
    return new Promise(resolve => {
      this.put(`/todos/${id}`, {text, completed})
        .then(response => {
          if (!response) {
            return resolve(false);
          }

          if (response.error) {
            resolve(false);
            return alert(response.error);
          }

          resolve(response);
        });
    })
  }
}

export default new Api('https://todo-app-back.herokuapp.com');
