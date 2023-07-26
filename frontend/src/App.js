import SignInForm from './pages/SigInForm'
import SignUpForm from './pages/SignUpForm'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ListTable from './pages/ListTable'
import UserTable from './pages/UserTable'
import Protected from './components/Protected'
import SubscriptionPage from './pages/SubscriptionPage'
import TransactionTable from './pages/TransactionTable'
import { useEffect } from 'react'
import axios from 'axios'
import Profile from './pages/Profile'

function App() {

  useEffect(()=>{
    if(localStorage.getItem('token')){
      axios.defaults.headers.common['Authorization'] = "Bearer " +localStorage.getItem('token')
    }
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={
          <Protected>
            <HomePage />
          </Protected>
        } />
        <Route path="/signup" element={
          <SignUpForm/>
        } />
        <Route path="/signin" element={
          <SignInForm />
        } />
        <Route path="/profile" element={
          <Protected>
            <Profile />
          </Protected>
        }/>
        <Route path="/lists" element={
          <Protected>
            <ListTable/>
          </Protected>
        }/>
        <Route path="/users" element={
          <Protected>
            <UserTable/>
          </Protected>
        }/>
        <Route path="/subscribe" element={
          <Protected>
            <SubscriptionPage/>
          </Protected>
        }/>
        <Route path="/transactions" element={
          <Protected>
            <TransactionTable />
          </Protected>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
