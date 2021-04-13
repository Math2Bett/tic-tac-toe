import React from 'react';
import { Redirect } from 'react-router-dom'
import InitialGameState from '../components/InitialGameState';
import Loading from '../components/Loading';
import Error from '../components/Error';
import InputForm from '../components/InputForm';

const Home = () => {
    const [step, setStep] = React.useState(1);
    const [name, setName] = React.useState('');
    const [newGame, setNewGame] = React.useState(null);
    const [room, setRoom] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [serverConfirmed, setServerConfirmed] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const stepBack = () => {
        setStep(step - 1);
    }
    const stepForward = () => {
        setStep(step + 1);
    }
    const onInitialGameStateButtonClicked = (choice) => {
        const gameChoice = choice === 'new' ? true : false;
        setNewGame(gameChoice);
        stepForward();
    };
    const onUserWritingSomething = (event) => {
        const target = event.target.name;
        const value = event.target.value;
        if (target === 'name') {
            setName(value);
        } else if (target === 'room') {
            setRoom(value);
        }
    }
    const isMyFormValid = () => {
        if (newGame) {
            return name !== '';
        } else { 
            return name !== '' && room !== '';
        }
    }

    const displayError = (message) => {
        setError(true);
        setErrorMessage(message);
        setLoading(false);
        setTimeout(() => {
            setError(false);
            setErrorMessage('');
        }, 3000)
    }

    const onUserSubmitHisForm = () => {
        setLoading(true);
        if (isMyFormValid()) {
            if (newGame) {
                console.log('Je demande à appeler le serveur pour créer une nouvelle partie !')
            } else {
                console.log('Je demande à appeler le serveur pour rejoindre une nouvelle partie !')
            }
        } else {
            displayError(newGame ? 'Please fill out your name' : 'Please fill out your name and room id')
        }
    }
    React.useEffect(() => {
        const socket = initializeSocketConection();
        socket.on('newGameCreated', (room) => {
            setRoom(room);
            setServerConfirmed(true);
        })
        socket.on('joinConfirmed', () => {
            setServerConfirmed(true); 
        })
        socket.on('errorMessage', (message) => displayError(message));
        return () => {socket = null};
    }, []);
    const getHomeByGameState = () => {
        if (serverConfirmed) {
            return (
                <Redirect to={`/game?room=${room}&name=${name}`} />
            )
        } else {
            switch (step) {
                case (1):
                    return (
                        <InitialGameState onChoice={onInitialGameStateButtonClicked} />
                    );
                default:
                    return null
                    case(2):
                    return (
                        <>
                            <Loading loading={loading}/>
                            <Error display={error} message={errorMessage}/>
                            <InputForm 
                                stepBack={stepBack} 
                                onSubmit={console.log('Bienvenue !')}
                                onTyping={onUserWritingSomething}
                                newGame={newGame}
                                name = {name}
                                room = {room}/> 
                        </>
                    );
            }
        }
    };

    return getHomeByGameState();
}
export default Home;