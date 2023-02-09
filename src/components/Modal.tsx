import React from 'react';
import { createPortal } from 'react-dom';

const Modal: React.FC<{ text: React.ReactNode; buttons: React.ReactNode; key: string }> = ({ text, buttons, key }) => {
    return createPortal(
        <div className="Modal__Container">
            <div className="Modal__Overlay">
                <div className="ModalCard" role="alertdialog">
                    <div className="ModalCard__Text">{text}</div>
                    <div className="ModalCard__Buttons">{buttons}</div>
                </div>
            </div>
        </div>,
        document.body,
        key
    );
};

export default Modal;
