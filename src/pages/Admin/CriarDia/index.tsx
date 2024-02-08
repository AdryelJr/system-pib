import { FormEvent, useState } from 'react'
import LogoImg from '../../../assets/logo-removebg-preview.png'
import './style.scss'
import { push, ref, set } from 'firebase/database';
import { database } from '../../../services/firebase';
import { useNavigate } from 'react-router-dom';

export function CriarDia() {
    const navigate = useNavigate();
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [tipoCulto, setTipoCulto] = useState('');

    const dados = {
        data: data,
        horario: horario,
        tipoCulto: tipoCulto
    }

    async function handleDados(event: FormEvent) {
        event.preventDefault();
        const diaRef = ref(database, 'dias');
        const newDiaRef = push(diaRef);

        await set(newDiaRef, {
            ...dados
        });

        setData('')
        setHorario('')
        setTipoCulto('')
        alert('Dia adicionado com sucesso!')
    }

    function handleVoltar() {
        navigate('/home')
    }

    return (
        <div className='container-criar-dia'>
            <header>
                <svg onClick={handleVoltar} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <img src={LogoImg} alt="logo-pib" />
            </header>
            <div className='content'>
                <div className='div-header'>
                    <div className='div-title'>
                        <h1>Louvor</h1>
                        <h2>PiB - Unaí</h2>
                    </div>
                </div>

                <div className='div-form'>
                    <form onSubmit={handleDados}>
                        <div className='div-acesso'>
                            <h1>Criar Dia   </h1>
                        </div>
                        <input
                            type="text"
                            placeholder='Data dd/mm/yyyy'
                            onChange={(e) => (setData(e.target.value))}
                            value={data}
                        />
                        <input
                            type="text"
                            placeholder='Horario 18:00'
                            onChange={(e) => (setHorario(e.target.value))}
                            value={horario}
                        />
                        <input
                            type="text"
                            placeholder="Culto Noite / Culto Dia"
                            onChange={(e) => (setTipoCulto(e.target.value))}
                            value={tipoCulto}
                        />
                        <button type='submit'>Criar Novo Dia</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

