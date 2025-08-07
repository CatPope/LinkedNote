import * as React from 'react';

interface SummaryItem {
  id: number;
  url: string;
  mode: string;
  summary_content: string;
  created_at: string;
}

const HistoryPanel: React.FC = () => {
  const [history, setHistory] = React.useState<SummaryItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Assuming FastAPI backend is running on http://localhost:8000
        const response = await fetch('http://localhost:8000/api/history');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SummaryItem[] = await response.json();
        setHistory(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading history...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <h3>Summary History</h3>
      {history.length === 0 ? (
        <p>No summaries yet.</p>
      ) : (
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: '5px',
          padding: '10px'
        }}>
          {history.map((item) => (
            <div key={item.id} style={{
              marginBottom: '15px',
              paddingBottom: '15px',
              borderBottom: '1px dashed #eee'
            }}>
              <p><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></p>
              <p><strong>Mode:</strong> {item.mode}</p>
              <p><strong>Summary:</strong> {item.summary_content}</p>
              <p style={{ fontSize: '0.8em', color: '#666' }}>{new Date(item.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
