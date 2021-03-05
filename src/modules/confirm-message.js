import React from 'react';
import '../css/confirm-message.css';
import Modal from './modal';

function ConfirmMessage(props) {
    return (
        <Modal close={props.onClose}>
            <div className='confirm-message'>
                <p>
                    {props.message}
                </p>
                <div className='confirm-message-buttons'>
                    <button
                        className='button primary-button'
                        onClick={props.yesClick}>
                        Да
                        </button>
                    <button
                        className='button'
                        onClick={props.noClick}>
                        Нет
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmMessage;