import * as React from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';

const App: React.FC = () => {
  const [selectedMode, setSelectedMode] = React.useState<string>('summary');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMode(event.target.value);
  };

  const handleSummarize = () => {
    setLoading(true);
    setError(null);
    // In a real app, you'd use ipcRenderer to communicate with the main process
    window.electron.ipcRenderer.send('summarize-url', { url: 'https://www.example.com', mode: selectedMode });
  };

  React.useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on('summarize-url-response', (response: any) => {
        setLoading(false);
        if (!response.success) {
          setError(response.error || 'An unknown error occurred.');
        }
      });
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '10px'
    }}>
      <h2>Select Summarization Mode</h2>
      {error && <ErrorMessage message={error} />}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <label>
          <input
            type="radio"
            value="summary"
            checked={selectedMode === 'summary'}
            onChange={handleModeChange}
          />
          Summary
        </label>
        <label>
          <input
            type="radio"
            value="tags"
            checked={selectedMode === 'tags'}
            onChange={handleModeChange}
          />
          Tags
        </label>
        <label>
          <input
            type="radio"
            value="full"
            checked={selectedMode === 'full'}
            onChange={handleModeChange}
          />
          Full
        </label>
      </div>
      <button
        onClick={handleSummarize}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#cccccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        {loading ? <LoadingSpinner /> : 'Summarize'}
      </button>
    </div>
  );
};

export default App;
