import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

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
        <DialogContainer onClose={onClose}>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h3 className='text-xl font-bold text-gray-800'>
                    Avatar zuschneiden
                </h3>
                <button
                    onClick={onClose}
                    className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                    <X className='h-5 w-5 text-gray-400' />
                </button>
            </div>

            <div className='relative w-full h-64'>
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

            <div className='flex justify-center gap-3 p-4 bg-gray-50'>
                <button
                    onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                    className='p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors duration-200'
                >
                    <ZoomOut className='h-5 w-5' />
                </button>
                <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    className='p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors duration-200'
                >
                    <ZoomIn className='h-5 w-5' />
                </button>
                <button
                    onClick={() => setRotation((rotation + 90) % 360)}
                    className='p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors duration-200'
                >
                    <RotateCw className='h-5 w-5' />
                </button>
            </div>

            <div className='p-6 border-t border-gray-100 flex justify-end gap-3'>
                <button
                    onClick={onClose}
                    className='px-6 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 
                            hover:bg-gray-50 transition-colors duration-200'
                >
                    Abbrechen
                </button>
                <button
                    onClick={handleSave}
                    className='px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-lg 
                            hover:bg-blue-700 transition-all duration-200 hover:shadow-xl hover:scale-105'
                >
                    Speichern
                </button>
            </div>
        </DialogContainer>
    );
};

export default AvatarCropDialog;
