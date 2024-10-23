const DialogContainer = ({ children, onClose }) => (
    <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4'>
        <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden'>
            {children}
        </div>
    </div>
);

export default DialogContainer;
