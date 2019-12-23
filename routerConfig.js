import ListComponent from './listComponent.js';
import LoginComponent from './loginComponent.js'

export default {
  'login': {
    component: LoginComponent,
    settings: {
      templateId: 'login',
      redirect: 'list'
    }
  },
  'list': {
    component: ListComponent,
    settings: {
      templateId: 'list',
    }
  }
}
