import React from 'react';
import { Modal } from './shopping-cart.js';
import '../css/confirm-message.css';

function ConfirmMessage(props) {
    return (
        <Modal>
            <div className='confirm-message-background'>
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
            </div>
        </Modal>
    )
}

export default ConfirmMessage;