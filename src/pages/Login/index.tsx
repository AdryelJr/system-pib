
import LogoImg from '../../assets/logo-removebg-preview.png'
import './style.scss'

export function Login() {
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
                    <form>
                        <div className='div-acesso'>
                            <h1>Acesso</h1>
                        </div>
                        <input
                            type="text"
                            placeholder='Usuário'
                        />
                        <input
                            type="password"
                            placeholder='Senha'
                        />
                        <button type='submit'>Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}