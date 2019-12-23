export default function createReducers() {
  return {
    addItem: (payload, state) => ({
      ...state,
      todo: [payload, ...state.todo]
    }),
    addItems: (payload, state) => ({
      ...state,
      todo: [...payload],
    }),
    removeItem: (payload, state) => ({
      ...state,
      todo: [
        ...state.todo.filter(item => item._id !== payload.id)
      ]
    }),
    editItem: (payload, state) => ({
      ...state,
      todo: state.todo.map(item => {
        return item._id === payload._id ? {...item, ...payload} : item;
      })
    }),
    setFilter: (payload, state) => ({
      ...state,
      filterTodo: payload
    })
  }
}
