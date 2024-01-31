import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import './styles/global.scss'
import { AdminAccount } from './pages/AdminAccount'
import { UserProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminAccount />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
