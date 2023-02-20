import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TimingService from './app/timing-service';

// Start timing service so all our intervals are synched
TimingService.start(1000);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
