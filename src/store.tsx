import React, {createContext, Dispatch, ReactNode, useReducer} from "react";

interface State {
    name: string;
    email: string;
    phone: string;
    log: string[];
}

type Action =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_PHONE'; payload: string }
    | { type: 'ADD_LOG'; payload: string };

// Начальное состояние
const initialState: State = {
    name: '',
    email: '',
    phone: '',
    log: [],
};

interface FormContextProps {
    state: State;
    dispatch: Dispatch<Action>;
}

export const FormContext = createContext<FormContextProps>({
    state: initialState,
    dispatch: () => null,
});

const formReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_EMAIL':
            return { ...state, email: action.payload };
        case 'SET_PHONE':
            return { ...state, phone: action.payload };
        case 'ADD_LOG':
            return { ...state, log: [...state.log, action.payload] };
        default:
            return state;
    }
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(formReducer, initialState);

    return (
        <FormContext.Provider value={{ state, dispatch }}>
            {children}
        </FormContext.Provider>
    );
};