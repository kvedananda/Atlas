import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { store } from './store/store';
import { Header } from './components/app/Header';
import { Home } from './routes/home';
import { Experiment } from './routes/experiment';
// import { CreateNew } from './pages/create/CreateNew';
// import { Statistics } from './pages/statistics';
import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <React.Fragment>
            <Header />
            <div className={styles.mainContainer}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route
                  path="/experiments/:experimentId"
                  component={Experiment}
                />
                {/* <Route path="/create" component={CreateNew} />
                <Route path="/statistics" component={Statistics} />
                <Route render={() => <Redirect to="/create/select" />} /> */}
              </Switch>
            </div>
          </React.Fragment>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
