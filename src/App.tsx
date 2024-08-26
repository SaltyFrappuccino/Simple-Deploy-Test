import React, { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { FormContext, FormProvider } from './store';
import { createAssistant } from "@sberdevices/assistant-client";

const initializeAssistant = (getState: any) => {
  return createAssistant({
    getState,
  });
};

const App: React.FC = () => {
  const { state, dispatch } = useContext(FormContext);
  const [isLogVisible, setIsLogVisible] = useState(false);
  const assistantRef = useRef<ReturnType<typeof createAssistant>>();

  useEffect(() => {
    assistantRef.current = initializeAssistant(() => {});

    assistantRef.current.on("data", ({ action }: any) => {
      if (action.type === "SET_NAME") {
        dispatch({ type: 'SET_NAME', payload: action.payload });
        dispatch({
          type: "ADD_LOG",
          payload: `Установлено имя на ${action.payload} с использованием ассистента`
        });
      }

      if (action.type === "SET_EMAIL") {
        dispatch({ type: 'SET_EMAIL', payload: action.payload });
        dispatch({
          type: "ADD_LOG",
          payload: `Установлена почта на ${action.payload} с использованием ассистента`
        });
      }

      if (action.type === "SET_PHONE") {
        dispatch({ type: 'SET_PHONE', payload: action.payload });
        dispatch({
          type: "ADD_LOG",
          payload: `Установлен телефон на ${action.payload} с использованием ассистента`
        });
      }

      if (action.type === "SEND_FORM") {
        dispatch({
          type: "ADD_LOG",
          payload: "Ответ с бэка: " + action.payload
        });
      }
    });
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] Form submitted with: Name=${state.name}, Email=${state.email}, Phone=${state.phone}`;
    dispatch({ type: 'ADD_LOG', payload: logEntry });

    assistantRef.current = initializeAssistant(() => {});
    assistantRef.current.sendData({
      action: {
        type: 'SEND_FORM',
        payload: { name: state.name, phone: state.phone, email: state.email }
      }
    });
  };

  return (
      <div className="app-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>Форма</h2>
          <label>
            Имя:
            <input
                type="text"
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                required
            />
          </label>
          <label>
            Почта:
            <input
                type="email"
                value={state.email}
                onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
                required
            />
          </label>
          <label>
            Телефон:
            <input
                type="tel"
                value={state.phone}
                onChange={(e) => dispatch({ type: 'SET_PHONE', payload: e.target.value })}
                required
            />
          </label>
          <button type="submit">Отправить</button>
        </form>

        <button className="log-toggle-button" onClick={() => setIsLogVisible(!isLogVisible)}>
          {isLogVisible ? 'Скрыть лог' : 'Показать лог'}
        </button>

        {isLogVisible && (
            <div className="log-container">
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
