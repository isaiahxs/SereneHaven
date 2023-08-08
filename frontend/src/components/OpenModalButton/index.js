//will hold the code for the OpenModalButton component

import React from "react";
import { useModal } from "../../context/Modal";
import './OpenModal.css';

function OpenModalButton({
    modalComponent, //component to render inside the modal
    buttonText, //text of the button that opens the modal
    onButtonClick, //callback will be called once button that opens the modal is clicked
    onModalClose, //optional: callback will be called once modal is closed
    className
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = (e) => {
        e.stopPropagation();
        if (typeof onButtonClick === 'function') onButtonClick();
        if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        document.body.classList.add('no-scroll');
    };

    const combinedClassName = className ? `modal-button ${className}` : 'modal-button';

    return (
        <button className={combinedClassName} onClick={onClick}>{buttonText}</button>
    )
}

export default OpenModalButton;
