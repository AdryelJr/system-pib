import { FormEvent, useState } from 'react'
import LogoImg from '../../../assets/logo-removebg-preview.png'
import { createUser } from '../../../services/operacoes';
import './style.scss'

export function AdminAccount() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleCreateAccountForm(event: FormEvent) {
        event.preventDefault();

        const newUser = {
            name: name,
            email: email,
            password: password
        };
        createUser(newUser)
            .then(() => {
                setName('');
                setEmail('');
                setPassword('');
                alert('New user created');
            })
            .catch((error) => {
                console.error('Erro ao criar usuário:', error.message);
            });
    }

    return (
        <div className='container-AdminAccount'>
            <div className='content'>
                <div className='div-header'>
                    <div className='div-title'>
                        <h1>Louvor</h1>
                        <h2>PiB - Unaí</h2>
                    </div>
                    <img src={LogoImg} alt="logo-pib" />
                </div>

                <div className='div-form'>
                    <form onSubmit={handleCreateAccountForm}>
                        <div className='div-acesso'>
                            <h1>Acesso</h1>
                        </div>
                        <input
                            type="text"
                            placeholder='Nome'
                            onChange={(e) => (setName(e.target.value))}
                            value={name}
                        />
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
                        <button type='submit'>Criar Novo Usuário</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

