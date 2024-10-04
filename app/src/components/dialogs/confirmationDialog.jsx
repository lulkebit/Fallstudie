import React from 'react';
import DialogContainer from '../containers/dialogContainer';

const ConfirmationDialog = ({ message, onConfirm, onClose }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <DialogContainer onClose={onClose}>
            <p>{message}</p>
            <div className='mt-4 flex justify-end space-x-2'>
                <button
                    onClick={handleConfirm}
                    className='bg-green-500 text-white px-4 py-2 rounded'
                >
                    Bestätigen
                </button>
                <button
                    onClick={onClose}
                    className='bg-gray-500 text-white px-4 py-2 rounded'
                >
                    Abbrechen
                </button>
            </div>
        </DialogContainer>
    );
};

export default ConfirmationDialog;
