import * as React from 'react';

const ResultWindow: React.FC = () => {
  const [summaryContent, setSummaryContent] = React.useState<string>('Loading summary...');

  React.useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on('summary-result', (result: any) => {
        if (result.success) {
          setSummaryContent(result.data.content);
        } else {
          setSummaryContent(`Error: ${result.error}`);
        }
      });
    } else {
      // Fallback for development outside Electron context or if preload is not working
      setSummaryContent("Summary content will appear here after processing.");
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <h2>Summarization Result</h2>
      <div style={{
        flexGrow: 1,
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '5px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9'
      }}>
        <p>{summaryContent}</p>
      </div>
      <div style={{
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => window.close()} // Close the window
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ResultWindow;
