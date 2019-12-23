export default function link(route) {
  history.pushState({route: route.replace('/', '')}, '', route);
}
