import React from 'react';
import Wait from '../components/Wait'
import Status from '../components/Status'
import PlayAgain from '../components/PlayAgain'
import {initializeSocketConection} from '../socket'
import QueryString from 'qs'

const Game = () => {
    const [game, setGame] = React.useState(new Array(9).fill(null));
    const [turn, setTurn] = React.useState(true);
    const [end, setEnd] = React.useState(false); 
    const [room, setRoom] = React.useState('');
    const [statusMessage, setStatusMessage] = React.useState('');
    const [currentPlayerScore, setCurrentPlayerScore] = React.useState(0);
    const [opponentPlayer, setOpponentPlayer] = React.useState({});
    const [waiting, setWaiting] = React.useState(false);
    const [joinError, setJoinError] = React.useState(false);
    let socketId = '';
    let piece = '';
    React.useEffect(() => {
        let socket = initializeSocketConection();
        const { room, name } = QueryString.parse(window.location.search, {
            ignoreQueryPrefix: true
        })
        setRoom(room);
        socket.emit('newRoomJoin', { room, name })
        socket.on('waiting', () => {
            setWaiting(true);
            setCurrentPlayerScore(0);
            setOpponentPlayer([]);
        });
        return () => {socket = null;}
    }, []);
    const getGameByState = () => {
        if (joinError) {
            return (
                <Redirect to={`/`} />
            )
        } else {
            return (
                <>
                    <Wait display={waiting} room={room} />
                    <Status message={statusMessage} />
                    <div className="board">
                        Here we will develop our awesome board
                    </div>
                    <PlayAgain end={end} onClick={() => {}} />
                </>
            )
        }
    };

    return getGameByState();
}

export default Game;