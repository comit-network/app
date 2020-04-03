import React, { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { Action } from '../actions/wallet';

interface State {
  BTCBalance: number | undefined;
  ETHBalance: number | undefined;
  DAIBalance: number | undefined;
}

export const defaultState: State = {
  BTCBalance: undefined,
  ETHBalance: undefined,
  DAIBalance: undefined
};

export function reducer(state = defaultState, action: Action): State {
  console.log('reducer');
  console.log(state);
  console.log(action);
  switch (action.kind) {
    case 'setBTCBalance':
      return { ...state, BTCBalance: action.value };
    case 'setETHBalance':
      return { ...state, ETHBalance: action.value };
    case 'setDAIBalance':
      return { ...state, DAIBalance: action.value };
    default:
      return state;
  }
}

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const WalletStoreContext = createContext<ContextValue | null>(null);

export const WalletStoreProvider: React.FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const value = { state, dispatch };

  return (
    <WalletStoreContext.Provider value={value}>
      {children}
    </WalletStoreContext.Provider>
  );
};

WalletStoreProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// We cast the return result as ContextValue to do away with the
// default null value. The store will always be available so long as the
// consuming component is under a provider.
export const useWalletStore = () =>
  useContext(WalletStoreContext) as ContextValue;
