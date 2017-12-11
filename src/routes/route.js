import React from 'react';
import {
  Router,
  Route,
  Redirect,
  Switch,
  // Link,
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { asyncComponent } from '../utils/asyncComponent';
import MainLayout from '../components/containers/layout/Layout';

const history = createBrowserHistory();

// import { syncHistoryWithStore } from 'react-router-redux';
// import { useScroll } from 'react-router-scroll';
// import store from '../core/store';
// const history = syncHistoryWithStore(browserHistory, store);

const ListA = asyncComponent(() => import('../components/containers/list/ListA'));
const ListB = asyncComponent(() => import('../components/containers/list/ListB'));
const ListC = asyncComponent(() => import('../components/containers/list/ListC'));
const noMatch = asyncComponent(() => import('../components/containers/no-match/noMatch'));

const routes = (
  <Router history={history} key={Math.random()}>
    <MainLayout history={history}>
      <Switch>
        <Redirect exact from={'/' || '/index.html'} to="/list-a" />
        <Route path="/list-a" component={ListA} />
        <Route path="/list-b" component={ListB} />
        <Route path="/list-c" component={ListC} />
        <Redirect exact from="/index.html" to="/list-a" />
        <Route component={noMatch} />
      </Switch>
    </MainLayout>
  </Router>
);

export default routes;
