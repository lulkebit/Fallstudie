import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw, Camera } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

// Hilfsfunktionen bleiben unverändert
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });

const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    return canvas.toDataURL('image/png');
};

const getRadianAngle = (degreeValue) => {
    return (degreeValue * Math.PI) / 180;
};

const CropperControl = ({ icon: Icon, onClick, label }) => (
    <button
        onClick={onClick}
        className='p-3 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm
                border border-gray-200/50 dark:border-white/10
                hover:bg-gray-50 dark:hover:bg-white/5
                transition-all duration-200 hover:-translate-y-0.5
                group relative'
        title={label}
    >
        <Icon className='w-5 h-5 text-gray-600 dark:text-white/70' />
        <span
            className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs
                     bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded opacity-0 
                     group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'
        >
            {label}
        </span>
    </button>
);

const AvatarCropDialog = ({ onClose, onSave, imageFile }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const croppedImageBase64 = await getCroppedImg(
                URL.createObjectURL(imageFile),
                croppedAreaPixels,
                rotation
            );
            onSave(croppedImageBase64);
            onClose();
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    }, [imageFile, croppedAreaPixels, rotation, onSave, onClose]);

    return (
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div
                className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 
                          dark:border-white/10 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20 
                          w-full max-w-4xl h-[600px] flex flex-col overflow-hidden'
            >
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Camera className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Profilbild zuschneiden
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-white/60'>
                                    Passe Größe und Position deines Bildes an
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl 
                                     transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Cropper */}
                <div className='relative flex-1 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm'>
                    <Cropper
                        image={URL.createObjectURL(imageFile)}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        rotation={rotation}
                        cropShape='round'
                        showGrid={false}
                        style={{
                            containerStyle: {
                                background: 'transparent',
                            },
                            mediaStyle: {
                                background: 'transparent',
                            },
                        }}
                    />
                </div>

                {/* Controls */}
                <div
                    className='p-6 space-y-6 border-t border-gray-200/50 dark:border-white/10 
                              bg-white/50 dark:bg-white/5 backdrop-blur-sm'
                >
                    <div className='flex justify-center gap-3'>
                        <CropperControl
                            icon={ZoomOut}
                            onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                            label='Verkleinern'
                        />
                        <CropperControl
                            icon={ZoomIn}
                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                            label='Vergrößern'
                        />
                        <CropperControl
                            icon={RotateCw}
                            onClick={() => setRotation((rotation + 90) % 360)}
                            label='Rotieren'
                        />
                    </div>

                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={onClose}
                            className='px-6 py-3 rounded-xl font-medium
                                text-gray-700 dark:text-white/70 
                                bg-gray-100/50 dark:bg-gray-900/50
                                hover:bg-gray-200/50 dark:hover:bg-white/5
                                border border-gray-200/50 dark:border-white/10
                                transition-all duration-200'
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={handleSave}
                            className='px-6 py-3 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                   text-white rounded-xl font-medium shadow-lg 
                                   hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                   transition-all duration-200 hover:-translate-y-0.5'
                        >
                            Speichern
                        </button>
                    </div>
                </div>
            </div>
        </DialogContainer>
    );
};

export default AvatarCropDialog;
