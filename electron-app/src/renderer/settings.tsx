import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import SettingsWindow from './components/settings/SettingsWindow';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SettingsWindow />
  </React.StrictMode>
);
