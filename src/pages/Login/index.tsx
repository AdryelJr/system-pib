import { FormEvent, useState } from 'react'
import LogoImg from '../../assets/logo-removebg-preview.png'
import './style.scss'
import { useUser } from '../../context/AuthContext';

export function Login() {
    const { signIn } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

    async function handleSignInForm(event: FormEvent) {
        event.preventDefault();

        const userLogin = {
            email: email,
            password: password
        }

        setLoading(true); // Define o estado de carregamento como verdadeiro durante o login

        try {
            await signIn(userLogin);
        } catch (error) {
            console.error(error);
            // Lidar com erros, se necessário
        } finally {
            setLoading(false); // Define o estado de carregamento como falso após o término do login
        }
    }

    return (
        <div className='container-login'>
            <div className='content'>
                <div className='div-header'>
                    <div className='div-title'>
                        <h1>Louvor</h1>
                        <h2>PiB - Unaí</h2>
                    </div>
                    <img src={LogoImg} alt="logo-pib" />
                </div>

                <div className='div-form'>
                    <form onSubmit={handleSignInForm}>
                        <div className='div-acesso'>
                            <h1>Acesso</h1>
                        </div>
                        <input
                            type="email"
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            type="password"
                            placeholder='Senha'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button type='submit' disabled={loading}>
                            {loading ? "Carregando..." : "Entrar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
