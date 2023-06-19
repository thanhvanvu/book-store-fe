import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { ConfigProvider } from 'antd'

import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: 'rgb(255,205,1)',
      },
    }}
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ConfigProvider>
)
