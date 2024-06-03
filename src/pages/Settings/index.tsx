import { useEffect, useState } from 'react';
import './style.scss';
import { useUser } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export function Settings() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [isNameUpdated, setIsNameUpdated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isNameUpdated) {
            const timer = setTimeout(() => {
                setIsNameUpdated(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isNameUpdated]);

    function handleHome() {
        navigate('/home');
    }

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (!user || !user.email) {
            setError('Usuário não está autenticado.');
            return;
        }

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);
                await updatePassword(currentUser, newPassword);
                setSuccess('Senha alterada com sucesso!');
                setNewPassword('');
                setConfirmPassword('');
                setCurrentPassword('');
            } else {
                setError('Usuário não está autenticado.');
            }
        } catch (error: any) {
            setError('Erro ao alterar a senha: ' + error.message);
        }
    };

    return (
        <div className="container-settings">
            <div className='content-settings'>
                <header>
                    <svg onClick={handleHome} width={50} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </header>
                <form onSubmit={handleChangePassword}>
                    <h2>Alterar Senha</h2>
                    <div className='div-new-senha'>
                        <input
                            type="password"
                            placeholder="Senha Atual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Nova Senha"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirmar Nova Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <div className='div-button'>
                        <button type="submit">Salvar Mudanças</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
