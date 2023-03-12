import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { AVAILABLE, UNAVAILABLE, SELECTED } from "../../constants/colors";


export default function SeatsPage({setReservation}) {
    const { idSessao } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState();
    const [selectedSits, setSelected] = useState([])
    const [selectedIds, setId] = useState([])
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idSessao}/seats`)

        promise.then(info => {
            setMovie(info.data)
        })

        promise.catch(erro => console.log(erro.response.data))


    }, [])

    if (movie === undefined) {
        return <div>Carregando...</div>
    }


    function checkSelect(isAvailable, sitNumber, sitId) {
        if (isAvailable === false) {
            alert("Esse assento não está disponível")
            return
        }

        if (selectedSits.includes(sitNumber)) {
            const newSelectedSits = selectedSits.filter((n) => n !== sitNumber)
            const newSelectedIds = selectedIds.filter((n) => n !== sitId)
            setSelected(newSelectedSits)
            setId(newSelectedIds)
        }

        else {
            const newSelectedSits = [...selectedSits, sitNumber]
            const newSelectedIds = [...selectedIds, sitId]
            setSelected(newSelectedSits)
            setId(newSelectedIds)

        }
    }

    function sendInfo(){
        setReservation({
            name:movie.movie.title, hour:movie.name, sits:selectedSits, date: movie.day.date, buyer: name, cpf: cpf
        })
        console.log([selectedIds, name, cpf])
        const promise = axios.post("https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many", {ids: selectedIds, name: name, cpf: cpf})
        
        promise.then(info =>(navigate("/sucesso")))
                
        promise.catch(erro => console.log(erro.response.data))
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {movie.seats.map(s => (
                    <SeatItem key={s.id} data-test="seat" onClick={() => checkSelect(s.isAvailable, s.name, s.id)} selected={selectedSits.includes(s.name)} available={s.isAvailable}>{s.name}</SeatItem>
                ))}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle color={SELECTED.color} border={SELECTED.border} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle color={AVAILABLE.color} border={AVAILABLE.border} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle color={UNAVAILABLE.color} border={UNAVAILABLE.border} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer>
                Nome do Comprador:
                <input 
                    data-test="client-name"
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Digite seu nome..." 
                    />

                CPF do Comprador:
                <input 
                data-test="client-cpf" 
                type="number"
                value={cpf}
                onChange={e => setCpf(e.target.value)} 
                placeholder="Digite seu CPF..." />
                

                <button onClick={()=> sendInfo()} data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>





            <FooterContainer data-test="footer">
                <div>
                    <img src={movie.movie.posterURL} alt={movie.movie.title} />
                </div>
                <div>
                    <p>{movie.movie.title}</p>
                    <p>{movie.day.weekday} - {movie.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.div`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${props => props.border};         // Essa cor deve mudar
    background-color: ${props => props.color};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid;         // Essa cor deve mudar
    ${props => {
        if (props.available === true && props.selected === false) {
            return (
                `background-color: ${AVAILABLE.color};
                border-color: ${AVAILABLE.border}; 
                `
            )
        }

        else if (props.selected === true) {
            return (
                `background-color: ${SELECTED.color};
                border-color: ${SELECTED.border}; 
                `
            )
        }

        else {
            return (
                `background-color: ${UNAVAILABLE.color};
                border-color: ${UNAVAILABLE.border}; 
                `
            )
        }
    }}

    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`