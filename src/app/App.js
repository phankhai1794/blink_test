import '@fake-db';
import React from 'react';
import { FuseAuthorization, FuseLayout, FuseTheme } from '@fuse';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import jssExtend from 'jss-extend';
import history from '@history';
import { create } from 'jss';
import { StylesProvider, jssPreset, createGenerateClassName } from '@material-ui/styles';

import { Auth } from './auth';
import store from './store';
import AppContext, { SocketContext, socket } from './AppContext';
import routes from './fuse-configs/routesConfig';

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  insertionPoint: document.getElementById('jss-insertion-point')
});

const generateClassName = createGenerateClassName();

const App = () => {
  return (
    <AppContext.Provider
      value={{
        routes
      }}
    >
      <SocketContext.Provider value={socket}>
        <StylesProvider jss={jss} generateClassName={generateClassName}>
          <Provider store={store}>
            <Auth>
              <Router history={history}>
                <FuseAuthorization>
                  <FuseTheme>
                    <FuseLayout />
                  </FuseTheme>
                </FuseAuthorization>
              </Router>
            </Auth>
          </Provider>
        </StylesProvider>
      </SocketContext.Provider>
    </AppContext.Provider>
  );
};

export default App;
