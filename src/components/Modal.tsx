import React from 'react';
import { createPortal } from 'react-dom';

/**
 * * This component only creates the modal "shell", users are required to create the portal themselves
 */
const Modal: React.FC<{ text: React.ReactNode; buttons: React.ReactNode }> = ({ text, buttons }) => {
    return (
        <div className="Modal__Container">
            <div className="Modal__Overlay">
                <div className="ModalCard" role="alertdialog">
                    <div className="ModalCard__Text">{text}</div>
                    <div className="ModalCard__Buttons">{buttons}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
