import Store from "./store.js";
import createReducers from "./reducers.js";

export default new Store(createReducers());
