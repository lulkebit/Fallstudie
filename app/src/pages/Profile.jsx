import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ChangePasswordDialog from '../components/dialogs/ChangePasswordDialog';
import AvatarCropDialog from '../components/dialogs/AvatarCropDialog';
import Waves from '../components/Waves';
import { Camera, Lock, Mail, Save, User } from 'lucide-react';

const InputField = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    icon: Icon,
}) => (
    <div>
        <label className='block text-sm font-medium text-gray-600 mb-1.5'>
            {label}
        </label>
        <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Icon className='h-5 w-5 text-gray-400' />
            </div>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className='w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         transition-all duration-200 outline-none'
            />
        </div>
    </div>
);

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
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <div className='max-w-2xl mx-auto'>
                        <div className='flex items-center gap-3 mb-8'>
                            <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
                                <User className='w-6 h-6 text-blue-600' />
                            </div>
                            <h1 className='text-2xl font-bold text-gray-800'>
                                Profil bearbeiten
                            </h1>
                        </div>

                        <div className='bg-white rounded-xl shadow-lg p-6 space-y-8'>
                            <div className='flex flex-col items-center'>
                                <div className='relative group'>
                                    {formData.avatar ? (
                                        <img
                                            src={`data:image/jpeg;base64,${formData.avatar}`}
                                            alt='Avatar'
                                            className='w-24 h-24 rounded-xl object-cover'
                                        />
                                    ) : (
                                        <div className='w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center'>
                                            <User className='w-8 h-8 text-blue-500' />
                                        </div>
                                    )}
                                    <label
                                        htmlFor='avatar'
                                        className='absolute inset-0 flex items-center justify-center 
                                                 bg-black/50 opacity-0 group-hover:opacity-100 
                                                 transition-opacity duration-200 rounded-xl 
                                                 cursor-pointer'
                                    >
                                        <Camera className='w-6 h-6 text-white' />
                                        <input
                                            type='file'
                                            id='avatar'
                                            name='avatar'
                                            onChange={handleAvatarChange}
                                            accept='image/*'
                                            className='hidden'
                                        />
                                    </label>
                                </div>
                                {avatarError && (
                                    <p className='mt-2 text-sm text-red-500'>
                                        {avatarError}
                                    </p>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <InputField
                                        label='Benutzername'
                                        id='username'
                                        value={formData.username}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                    <InputField
                                        label='E-Mail'
                                        id='email'
                                        type='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        icon={Mail}
                                    />
                                    <InputField
                                        label='Vorname'
                                        id='firstname'
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                    <InputField
                                        label='Nachname'
                                        id='lastname'
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                </div>

                                <div className='flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100'>
                                    <button
                                        type='submit'
                                        disabled={!isModified}
                                        className={`
                                            flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
                                            ${
                                                !isModified
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:scale-105'
                                            }
                                            transition-all duration-200
                                        `}
                                    >
                                        <Save className='w-5 h-5' />
                                        Speichern
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            addDialog({
                                                component: ChangePasswordDialog,
                                            })
                                        }
                                        className='flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium 
                                                 hover:bg-blue-100 transition-colors duration-200 
                                                 flex items-center justify-center gap-2'
                                    >
                                        <Lock className='w-5 h-5' />
                                        Passwort ändern
                                    </button>
                                </div>
                            </form>
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
        </>
    );
};

export default Profile;
