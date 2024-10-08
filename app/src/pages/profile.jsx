import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Navbar from '../components/navbar';
import { useToast } from '../context/toastContext';
import { useDialog } from '../context/dialogContext';
import ChangePasswordDialog from '../components/dialogs/changePasswordDialog';

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
    const navigate = useNavigate();

    const openChangePasswordDialog = () => {
        addDialog({ component: ChangePasswordDialog });
    };

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

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        const newValue = files ? files[0] : value;
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('userId', user._id);
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
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

    const handleLogout = async () => {
        try {
            const { data } = await axios.post('/logout');

            if (data.error) {
                return addToast(data.error, 'error');
            } else {
                localStorage.removeItem('token');
                navigate('/login');
                addToast(data.message, 'success');
            }
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    return (
        <div className='bg-gray-100'>
            <Navbar />
            <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl'>
                <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>
                    Profil bearbeiten
                </h2>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label
                            htmlFor='avatar'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Avatar
                        </label>
                        {formData.avatar && (
                            <img
                                src={`data:image/jpeg;base64,${formData.avatar}`}
                                alt='Avatar'
                                className='mt-2 w-24 h-24 rounded-full object-cover'
                            />
                        )}
                        <input
                            type='file'
                            id='avatar'
                            name='avatar'
                            onChange={handleChange}
                            className='mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100'
                        />
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
                        className={`w-full py-2 px-4 mb-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            !isModified ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Speichern
                    </button>
                </form>
                <button
                    onClick={openChangePasswordDialog}
                    className='w-full mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                    Passwort ändern
                </button>
            </div>
        </div>
    );
};

export default Profile;
