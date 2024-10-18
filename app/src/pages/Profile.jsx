import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ChangePasswordDialog from '../components/dialogs/ChangePasswordDialog';
import AvatarCropDialog from '../components/dialogs/AvatarCropDialog';

const Profile = () => {
    const { user, updateUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        avatar: null,
    });
    const [initialFormData, setInitialFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        avatar: null,
    });
    const { addToast } = useToast();
    const [isModified, setIsModified] = useState(false);
    const { addDialog } = useDialog();
    const [avatarError, setAvatarError] = useState('');
    const [showAvatarCropDialog, setShowAvatarCropDialog] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
            });

            setInitialFormData({
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
            });
        }
    }, [user]);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatarFile(file);
            setShowAvatarCropDialog(true);
        }
    };

    const handleAvatarSave = (croppedImageUrl) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: croppedImageUrl,
        }));
        setIsModified(true);
    };

    const validateImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width >= 128 && img.height >= 128) {
                        resolve(true);
                    } else {
                        reject(
                            'Das Bild muss mindestens 128x128 Pixel groß sein.'
                        );
                    }
                };
                img.onerror = () => reject('Ungültiges Bildformat.');
                img.src = e.target.result;
            };
            reader.onerror = () => reject('Fehler beim Lesen der Datei.');
            reader.readAsDataURL(file);
        });
    };

    const handleChange = async (event) => {
        const { name, value, files } = event.target;
        let newValue = files ? files[0] : value;

        if (name === 'avatar' && files) {
            try {
                if (!files[0].type.startsWith('image/')) {
                    setIsModified(false);
                    throw new Error('Bitte laden Sie nur Bilddateien hoch.');
                }
                await validateImage(files[0]);
                setAvatarError('');
            } catch (error) {
                setAvatarError(error.message || 'Ungültiges Bild.');
                newValue = null;
                event.target.value = '';
            }
        }

        if (!avatarError) {
            setFormData((prevFormData) => {
                const updatedFormData = {
                    ...prevFormData,
                    [name]: newValue,
                };
                setIsModified(
                    JSON.stringify(updatedFormData) !==
                        JSON.stringify(initialFormData)
                );
                return updatedFormData;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('userId', user._id);
        for (const key in formData) {
            if (
                key === 'avatar' &&
                formData[key] &&
                formData[key].startsWith('data:image')
            ) {
                const response = await fetch(formData[key]);
                const blob = await response.blob();
                formDataToSend.append(key, blob, 'avatar.jpg');
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }
        try {
            const { data } = await axios.put('/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            updateUser(data);
            addToast('Profil erfolgreich aktualisiert', 'success');
            setIsModified(false);
        } catch (error) {
            addToast('Fehler beim Aktualisieren des Profils', 'error');
        }
    };

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <div className='container mx-auto px-4 py-8'>
                <div className='max-w-lg mx-auto bg-white rounded-lg shadow-xl overflow-hidden'>
                    <div className='p-6 sm:p-8'>
                        <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>
                            Profil bearbeiten
                        </h2>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='flex flex-col items-center'>
                                {formData.avatar && (
                                    <img
                                        src={`data:image/jpeg;base64,${formData.avatar}`}
                                        alt='Avatar'
                                        className='w-24 h-24 rounded-full object-cover mb-2'
                                    />
                                )}
                                <input
                                    type='file'
                                    id='avatar'
                                    name='avatar'
                                    onChange={handleAvatarChange}
                                    accept='image/*'
                                    className='text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100'
                                />
                                {avatarError && (
                                    <p className='mt-2 text-sm text-red-600'>
                                        {avatarError}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor='username'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Benutzername
                                </label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    E-Mail
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='firstname'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Vorname
                                </label>
                                <input
                                    type='text'
                                    id='firstname'
                                    name='firstname'
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='lastname'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Nachname
                                </label>
                                <input
                                    type='text'
                                    id='lastname'
                                    name='lastname'
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={!isModified}
                                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    !isModified
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                Speichern
                            </button>
                        </form>
                        <button
                            onClick={() =>
                                addDialog({ component: ChangePasswordDialog })
                            }
                            className='w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                            Passwort ändern
                        </button>
                    </div>
                </div>
            </div>
            {showAvatarCropDialog && (
                <AvatarCropDialog
                    onClose={() => setShowAvatarCropDialog(false)}
                    onSave={handleAvatarSave}
                    imageFile={avatarFile}
                />
            )}
        </div>
    );
};

export default Profile;
