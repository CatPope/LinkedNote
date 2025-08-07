import * as React from 'react';
import ApiKeyForm from './ApiKeyForm';
import HistoryPanel from './HistoryPanel';
import ErrorMessage from '../common/ErrorMessage';

const SettingsWindow: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'api-key' | 'history'>('api-key');
  const [error, setError] = React.useState<string | null>(null);

  const handleSaveApiKey = (apiKey: string) => {
    setError(null); // Clear previous errors
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('save-api-key', apiKey);
    } else {
      console.warn('Electron IPC not available. Cannot save API key.');
      setError('Electron IPC not available. Cannot save API key.');
    }
  };

  React.useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on('save-api-key-response', (response: any) => {
        if (!response.success) {
          setError(response.error || 'Failed to save API key.');
        } else {
          setError(null); // Clear error on success
          // Optionally show a success message
        }
      });
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      <h2>Settings</h2>
      {error && <ErrorMessage message={error} />}
      <div style={{
        display: 'flex',
        marginBottom: '15px',
        borderBottom: '1px solid #ccc'
      }}>
        <button
          onClick={() => setActiveTab('api-key')}
          style={{
            padding: '10px 15px',
            border: 'none',
            backgroundColor: activeTab === 'api-key' ? '#007bff' : 'transparent',
            color: activeTab === 'api-key' ? 'white' : 'black',
            cursor: 'pointer',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
        >
          API Key
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 15px',
            border: 'none',
            backgroundColor: activeTab === 'history' ? '#007bff' : 'transparent',
            color: activeTab === 'history' ? 'white' : 'black',
            cursor: 'pointer',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
        >
          History
        </button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {activeTab === 'api-key' && <ApiKeyForm onSave={handleSaveApiKey} />}
        {activeTab === 'history' && <HistoryPanel />}
      </div>
    </div>
  );
};

export default SettingsWindow;
