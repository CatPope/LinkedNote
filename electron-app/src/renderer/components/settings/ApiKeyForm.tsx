import * as React from 'react';

interface ApiKeyFormProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = React.useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(apiKey);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <label htmlFor="apiKeyInput">
        OpenAI API Key:
      </label>
      <input
        id="apiKeyInput"
        type="password"
        value={apiKey}
        onChange={handleChange}
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 15px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Save API Key
      </button>
    </form>
  );
};

export default ApiKeyForm;
