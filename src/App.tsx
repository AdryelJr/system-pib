import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import './styles/global.scss'
import { AdminAccount } from './pages/AdminAccount'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminAccount />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
