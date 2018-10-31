import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import { startSetExpenses } from './actions/expenses';
import { login, logout } from './actions/auth';
import getVisibleExpenses from './selectors/expenses';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { firebase } from './firebase/firebase';

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const GC_DOM_element = document.getElementById('sec011_app_01');

let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    //ReactDOM.render(jsx, document.getElementById('app'));
    ReactDOM.render(jsx, GC_DOM_element);
    hasRendered = true;
  }
};

//ReactDOM.render(<p>Loading...</p>, document.getElementById('app'));
ReactDOM.render(<p>Loading...</p>, GC_DOM_element);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log ("   *** logging in");
    store.dispatch(login(user.uid));
    store.dispatch(startSetExpenses()).then(() => {
      renderApp();
      if (history.location.pathname === '/') {
        history.push('/dashboard');
      }
    });
  } else {
    console.log ("   *** logging out");
    store.dispatch(logout());
    renderApp();
    history.push('/');
  }
});
