import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import State from './store/State.tsx';
import { Observer } from 'mobx-react-lite'
import instance from './axiosInstance.ts';

instance.interceptors.request.use(config => {
  try {
    config.headers['Authenticate'] = State.getUser().token;
  } catch {
    console.log('error')
  }
  return config;
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Observer render={() => (
    <>
      <App />
    </>
  )} />,
)
