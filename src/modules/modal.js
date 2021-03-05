import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function scrollBar() {
    const documentWidth = parseInt(document.documentElement.clientWidth);
    const windowsWidth = parseInt(window.innerWidth);
    return windowsWidth - documentWidth
}

function Modal(props) {
    const modalRoot = document.getElementById('modal-root');

    useEffect(() => {
        document.body.style.marginRight = scrollBar() + 'px';
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.marginRight = -scrollBar() + 'px';
            document.body.style.overflow = '';
        }
    })

    function close(e) {
        if (e.target === e.currentTarget) {
            props.close()
        }
    }

    return ReactDOM.createPortal(
        <div className='auth-background'
            onClick={(e) => { close(e) }}>
            {props.children}
        </div>,
        modalRoot,
    );
};

export default Modal;