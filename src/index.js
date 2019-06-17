import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';

// import registerServiceWorker from './registerServiceWorker';
import configureStore from './init';
import App from './App';
import { BottomSheetProvider } from './components/bottom-sheet/BottomSheet';
import { themes as sheetThemes } from './components/bottom-sheet/utils';

const store = configureStore();

const AppWrapper = () => (
  <Provider store={store}>
    <BottomSheetProvider blurTarget="#root" theme={sheetThemes.ios}>
      <App />
    </BottomSheetProvider>
  </Provider>
);

ReactDOM.render(<AppWrapper />, document.getElementById('root'));
// registerServiceWorker();
