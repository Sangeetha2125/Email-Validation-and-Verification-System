import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import axios from 'axios'

axios.defaults.baseURL=process.env.REACT_APP_API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)