import * as React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#ffe0e0',
      color: '#cc0000',
      border: '1px solid #cc0000',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
