import React from 'react';
import ReactDOM from 'react-dom';
import Narrator from './components/Narrator';

// require('./style.scss');

const root = document.querySelector('.root');

const render = (Component) => {
  ReactDOM.render(
    <div>
      <Component />
      <h2>Im rendering now!!</h2>
    </div>,
    root
  );
};

render(Narrator);

// if (module.hot) {
//   module.hot.accept('./App', () => { render(App); });
// }
