import React, {useContext, useEffect, useRef, useState} from 'react';
import './App.css';
import { FormContext, FormProvider} from './store';
import {createAssistant, createSmartappDebugger} from "@sberdevices/assistant-client";
import {create} from "domain";

const initializeAssistant = (getState: any) => {
  return createSmartappDebugger({
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIzNTE5NWYxYi03YmJlLTQ5OGQtODJmMi1jNTc2ODQ0ODA2ODQiLCJzdWIiOiJkMTUwMDA2YTA1YmNmYzcyMTU5NmZhYjczZDNhZjExNmI0NzU1YzY4NGM5NWI4MjdhZTk2NzhhZDUxZGEyODIxNTM5YmU5MjcwMDQyNjI5OCIsImlzcyI6IktFWU1BU1RFUiIsImV4cCI6MTcyNDY4MzMzNSwiYXVkIjoiVlBTIiwidXNyIjoiMGMyZDY0NzEtMDg2YS00ZTU5LWJiYzYtNjgwNzI4ZjEyODJlIiwiaWF0IjoxNzI0NTk2OTI1LCJzaWQiOiIxNDQ5ZDVjNi03NDQyLTQ5MDYtODZkOS1jMzM2ODVmY2NhYTMifQ.IbtP2ht8OK170N_5mtBr0ATRM5jYhjVknFOOPxyHA7G0nO0Bh21AqMJQDGriue94LIyWOstVze83Plp3UZiJuZO6p-FEZ_A_Mo-zz1eB_1wJVncraJlnf2TDlKnQyZSMuFrhJQs5xwnGTsEBg_attm2iQHhA90doIqnRrtQnrvZa0MswJJoJh5H-EiosSgYLRoo5RtsnsnVh7AULNZR-mIt0enyJMsBdB1-0Qshdlk_QIfZuEQj_bKyWVK4I_NHyMTlua5eDV2IFa1n4XuKnw0nvjvwaGTZHyZ5pYTcda2gJ7-iHLNmNjJywlxG_I_0OVMXTX7fvXq2Nh0k1NV23EQBHFodS5-RRZo02gjiVe6DDlU1bEXkQioUsBLR819DuTuxzMgiGEdvaIvvkbe6HyuD715Lz3ZvdH9jBZIB7PNGTBwp2P6XoOgAjBMn1BC-ca_yBVvnYFG7YJA5LRBM5uK9oTeePFDWkW2qI4sOSb7d4Z63YT1Cfabf-cxCTzq-e3TxI9k_xFR0lfScBoPVeAy4aDrZBuKDthvYjTCdnlsfJ8xpQS5F-i-AzQIGiKbGw0mrXcZNmf-CoPHCX_2eU4OOfEBhF-lR3qrIRPutC5SED4QkZOvjq6G-Rf5lBb62T7v41ty8BK6gELKa1VhDwFgYC_C5OfJCjSZiWcs0rZz8",
    initPhrase: "Запусти Deploy Test",
    getState
  });
}

const App: React.FC = () => {
  const { state, dispatch } = useContext(FormContext);
  const [isLogVisible, setIsLogVisible] = useState(false);
  const assistantRef = useRef<ReturnType<typeof createAssistant>>();

  useEffect(() => {
    assistantRef.current = initializeAssistant(() => {});
    assistantRef.current.on("data", ({action}: any) => {
      if (action) {
        console.log(action)
      }
    })
  })

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
          {isLogVisible ? 'Показать лог' : 'Скрыть лог'}
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
