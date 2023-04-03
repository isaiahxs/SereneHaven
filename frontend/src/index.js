import React from 'react';

import './index.css';

import ReactDOM from 'react-dom';
// import { Provider as ReduxProvider } from 'react-redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider, Modal } from './context/Modal';
import App from './App';

import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
//import all the actions from session.js
import * as sessionActions from './store/session';

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  //attach the actions to the window at the key of sessionActions
  window.sessionActions = sessionActions;
}

//wrap the application with the Modal provider and render the modal component after the App component so that all the Modal content will be layered as HTML elements on top of all the other HTML elements
function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
