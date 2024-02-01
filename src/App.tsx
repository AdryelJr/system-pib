import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import './styles/global.scss';
import { AdminAccount } from './pages/Admin/AdminAccount';
import { UserProvider } from './context/AuthContext';
import { CriarDia } from './pages/Admin/CriarDia';
import { DetalhesDia } from './pages/DetalhesDia';
import { useEffect, useState } from 'react';
import LoadingSpinner from './componentes/loadingComponent';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/detalhes/:id" element={<DetalhesDia />} />
            <Route path="/admin" element={<AdminAccount />} />
            <Route path="/criardia" element={<CriarDia />} />
          </Routes>
        )}
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
