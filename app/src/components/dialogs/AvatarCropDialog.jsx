import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

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
        <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-600 bg-opacity-75'>
            <div className='relative w-full max-w-md mx-auto my-6'>
                <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
                    <div className='flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t'>
                        <h2 className='text-2xl font-semibold text-gray-700'>
                            Avatar zuschneiden
                        </h2>
                        <button
                            className='p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors duration-200 ease-in-out hover:text-gray-600'
                            onClick={onClose}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className='relative w-full h-64 overflow-hidden'>
                        <Cropper
                            image={URL.createObjectURL(imageFile)}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            rotation={rotation}
                        />
                    </div>
                    <div className='flex justify-center space-x-4 mt-4'>
                        <button
                            onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                            className='p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200'
                        >
                            <ZoomOut size={24} />
                        </button>
                        <button
                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                            className='p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200'
                        >
                            <ZoomIn size={24} />
                        </button>
                        <button
                            onClick={() => setRotation((rotation + 90) % 360)}
                            className='p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200'
                        >
                            <RotateCw size={24} />
                        </button>
                    </div>
                    <div className='flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-gray-100 rounded'
                        >
                            Abbrechen
                        </button>
                        <button
                            type='button'
                            onClick={handleSave}
                            className='bg-blue-600 text-white active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 transform hover:scale-105'
                        >
                            Speichern
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarCropDialog;
