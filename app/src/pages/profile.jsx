import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const Profile = () => {
    const { user, updateUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        avatar: null,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('userId', user._id); // Include user ID
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
            alert('Profil erfolgreich aktualisiert');
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Profils:', error);
            alert('Fehler beim Aktualisieren des Profils');
        }
    };

    if (!user) {
        return <div>Lade...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
            />
            <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
            />
            <input
                type='text'
                name='firstname'
                value={formData.firstname}
                onChange={handleChange}
            />
            <input
                type='text'
                name='lastname'
                value={formData.lastname}
                onChange={handleChange}
            />
            {formData.avatar && (
                <img
                    src={`data:image/jpeg;base64,${formData.avatar}`}
                    alt='Avatar'
                />
            )}
            <input type='file' name='avatar' onChange={handleChange} />
            <button type='submit'>Aktualisieren</button>
        </form>
    );
};

export default Profile;
