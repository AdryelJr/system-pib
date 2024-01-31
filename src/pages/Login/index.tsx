
import { FormEvent, useState } from 'react'
import LogoImg from '../../assets/logo-removebg-preview.png'
import './style.scss'
import { useUser } from '../../context/AuthContext';

export function Login() {
    const { signIn } = useUser();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    function handleSignInForm(event: FormEvent) {
        event.preventDefault();

        const userLogin = {
            email: email,
            password: password
        }
        signIn(userLogin);
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
                            onChange={(e) => (setEmail(e.target.value))}
                            value={email}
                        />
                        <input
                            type="password"
                            placeholder='Senha'
                            onChange={(e) => (setPassword(e.target.value))}
                            value={password}
                        />
                        <button type='submit'>Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}