import dotenv from 'dotenv';
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { BaseStyles } from 'rimble-ui';
import { Store } from '../reducers/types';
import Routes from '../Routes';
import { WalletStoreProvider } from '../hooks/useWalletStore';
import { TakerProvider } from '../hooks/useTaker';
import { BitcoinWalletProvider } from '../hooks/useBitcoinWallet';
import { EthereumWalletProvider } from '../hooks/useEthereumWallet';

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => {
  dotenv.config();

  return (
    <Provider store={store}>
      <BitcoinWalletProvider>
        <EthereumWalletProvider>
          <TakerProvider>
            <WalletStoreProvider>
              <ConnectedRouter history={history}>
                <BaseStyles>
                  <Routes />
                </BaseStyles>
              </ConnectedRouter>
            </WalletStoreProvider>
          </TakerProvider>
        </EthereumWalletProvider>
      </BitcoinWalletProvider>
    </Provider>
  );
};

export default hot(Root);
