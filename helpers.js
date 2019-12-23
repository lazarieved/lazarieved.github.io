import link from './link.js';

(function(history){
  const { pushState } = history;
  history.pushState = function(state) {
    window.dispatchEvent(new CustomEvent('changeRoute', { detail: state }));
    pushState.apply(history, arguments);
  };
})(window.history);


document.addEventListener('click', event => {
  const href = event.target.getAttribute('href');
  if (href) {
    event.preventDefault();
    event.stopPropagation();
    link(href);
  }
});
