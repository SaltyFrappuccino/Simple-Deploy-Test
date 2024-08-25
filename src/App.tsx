import React, { useContext, useState } from 'react';
import './App.css';
import { FormContext, FormProvider} from './store';

const App: React.FC = () => {
  const { state, dispatch } = useContext(FormContext);
  const [isLogVisible, setIsLogVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] Form submitted with: Name=${state.name}, Email=${state.email}, Phone=${state.phone}`;
    dispatch({ type: 'ADD_LOG', payload: logEntry });

    setTimeout(() => {
      timestamp = new Date().toLocaleTimeString();
      const responseLog = `[${timestamp}] Server response: Success`;
      dispatch({ type: 'ADD_LOG', payload: responseLog });
    }, 1000);
  };

  return (
      <div className="app-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>Contact Form</h2>
          <label>
            Name:
            <input
                type="text"
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                required
            />
          </label>
          <label>
            Email:
            <input
                type="email"
                value={state.email}
                onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
                required
            />
          </label>
          <label>
            Phone:
            <input
                type="tel"
                value={state.phone}
                onChange={(e) => dispatch({ type: 'SET_PHONE', payload: e.target.value })}
                required
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        <button className="log-toggle-button" onClick={() => setIsLogVisible(!isLogVisible)}>
          {isLogVisible ? 'Hide Log' : 'Show Log'}
        </button>

        {isLogVisible && (
            <div className="log-container">
              <h3>Action Log</h3>
              <div className="log-content">
                {state.log.map((entry, index) => (
                    <p key={index}>{entry}</p>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

const AppWithStore: React.FC = () => (
    <FormProvider>
      <App />
    </FormProvider>
);

export default AppWithStore;
