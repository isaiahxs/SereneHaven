import React, {useRef, useState, useContext} from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

//create a React context called a ModalContext
const ModalContext = React.createContext();

//create and export a functional comp called ModalProvider that renders the ModalContext.Provider comp with all the children from the props as a child
    //make sure it is a named export and not a  default
export function ModalProvider({children}) {
    //create a React ref
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    //callback function that will  be called when modal is closing
    const [onModalClose, setOnModalClose] = useState(null);

    const closeModal = () => {
        setModalContent(null); //clear the modal contents
        //If callback function is truthy, call the callback function and reset it to null:
        if (typeof onModalClose === 'function') {
            setOnModalClose(null);
            onModalClose();
        }
    }

    const contextValue = {
        modalRef, //reference to modal div
        modalContent, //React component to render inside modal
        setModalContent, //function to set the React component to render inside modal
        setOnModalClose, //function to set the callback function to be called when modal is closing
        closeModal //function to close the modal
    }

    return (
        <>
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
        {/* set the ref prop on the rendered div to this modalRef */}
        <div ref={modalRef}/>
        </>
    )
}

export function Modal() {
    const {modalRef, modalContent, closeModal} = useContext(ModalContext);
    //if there is no div referenced by the modalRef or modalContent is not a truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    //render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div id='modal'>
            <div id='modal-background' onClick={closeModal}/>
            <div id='modal-content'>
                {modalContent}
            </div>
        </div>,
        modalRef.current
    )
}

export const useModal = () => useContext(ModalContext);
