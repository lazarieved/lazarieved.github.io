import Component from "./component.js";
import store from "./store/index.js";
import link from './link.js';
import Api from "./api.js";

export default class ListComponent extends Component{
  constructor(app, settings) {
    super(app, settings);

    this.input = this.anchor.querySelector('#add_item_todo');
    this.ul = this.anchor.querySelector('#list_items');
  }

    initEvents() {
      this.anchor
        .querySelector('#todo-form')
        .addEventListener('submit', this.onSubmit.bind(this));

      this.anchor
        .querySelector('#log_out_button')
        .addEventListener('click', e => {
          e.preventDefault();
          store.dispatch('addItems', []);
          localStorage.removeItem('token');
          link('/login');
        });

      this.anchor
        .querySelector('#list_items')
        .addEventListener('click', event => {
          const {target} = event;
          const id = target.getAttribute('data-id');
          const dataType = target.getAttribute('data-type');

          if (id && dataType) {
            switch (dataType) {
              case 'delete': {
                Api
                  .deleteToDos(id)
                  .then(res => {
                    if (res) {
                      store.dispatch('removeItem', {id});
                    }
                  });
              }
                break;
              case 'check': {
                const text = store.state.todo.find(item => item.id === id);
                Api
                  .editTodo({id, text, completed: target.checked})
                  .then(res => {
                    if (res) {
                      store.dispatch('editItem', res);
                      }
                  });
              }
                break;
              case 'span': {
                store.dispatch('editItem', {_id: id, edit: true});
              }
                break;
              case 'editButton': {
                const text = target.parentElement.querySelector('[type="text"]').value;
                Api.editTodo({id, text})
                  .then(response => {
                    if (response) store.dispatch('editItem', {_id: id, text, edit: false})
                  })
              }
                break;
              default:
                break;
            }
          }
        });

      this.anchor
        .querySelector('.filter_buttons')
        .addEventListener('click', event => {
          const dataFilter = event.target.getAttribute('data-filter');
          this.anchor.querySelector('.filter_buttons .active').classList.remove('active');
          event.target.classList.add('active');
          store.dispatch('setFilter', dataFilter)
        });
      // this.anchor
      //   .querySelector('.checkbox_list_class')
      //   .addEventListener('check', event=>{
      //     if(event.checked){
      //       this.anchor.querySelector('#list_items').classList.add('check_done');
      //     }
      //   })
    }

  onSubmit(event) {
    event.preventDefault();
    const value = this.input.value.trim();
    if (!value.length) return;

    Api.createToDos(value).then(response => {
      if (response) {
        store.dispatch('addItem', {text: value, _id: response._id});
      }
    });
    this.input.focus();
    this.input.value = '';
  };

  getFilterItems() {
    const items = store.state.todo;
    const filterToDo = store.state.filterTodo;
    switch (filterToDo) {
      case 'done':
        return items.filter(item => item.completed === true);
      case 'progress':
        return items.filter(item => item.completed === false);
      default:
        return items;
    }
  }

  render() {
    if (store.state.todo.length === 0) {
       this.ul.innerHTML = `<li>No todo's..</li>`;
      return;
    }

    this.ul.innerHTML = this.getFilterItems().map(todoItem => `
      <li class="item_todo_li ${todoItem.completed ? `done_li`: ``}">
        <input type="checkbox" ${todoItem.completed && `checked`} class="checkbox_list_class" data-id="${todoItem._id}" data-type="check">
            ${todoItem.edit ?
              `<input type ="text" value="${todoItem.text}" class="edit_input"/>
              <button data-type="editButton" class="edit_button" data-id="${todoItem._id}">save</button>`
              : `<span class="span_check" data-type ="span" data-id="${todoItem._id}">${todoItem.text}</span>`}
            <button type="button" class="remove_item_todo" data-id="${todoItem._id}" data-type="delete">Delete</button>
      </li>
    `).join('');
  }
}
