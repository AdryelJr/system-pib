import { FormEvent, useState } from 'react'
import LogoImg from '../../../assets/logo-removebg-preview.png'
import './style.scss'
import { push, ref, set } from 'firebase/database';
import { database } from '../../../services/firebase';

export function CriarDia() {
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

