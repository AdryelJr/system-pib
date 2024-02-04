import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import './styles/global.scss';
import { AdminAccount } from './pages/Admin/AdminAccount';
import { UserProvider } from './context/AuthContext';
import { CriarDia } from './pages/Admin/CriarDia';
import { DetalhesDia } from './pages/DetalhesDia';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detalhes/:id" element={<DetalhesDia />} />
          <Route path="/admin" element={<AdminAccount />} />
          <Route path="/criardia" element={<CriarDia />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
