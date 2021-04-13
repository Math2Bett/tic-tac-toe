import React from 'react';
import ChoiceButton from './ChoiceButton'

const InitialGameState = ({onChoice}) => {
    return (
        <>
        <div className='choice-container'>
            <ChoiceButton onClick={() => onChoice('new')} type='primary' label='Start New Game'/> 
            <ChoiceButton onClick={() => onChoice('join')} type='secondary' label='Join A Game'/> 
        </div>
        </>
    );
}

export default InitialGameState;
