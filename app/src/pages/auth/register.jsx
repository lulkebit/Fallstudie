import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/toastContext';

const Register = () => {
    const [data, setData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
    });
    const navigate = useNavigate();
    const { addToast } = useToast();

    const registerUser = async (event) => {
        event.preventDefault();
        const { firstname, lastname, email, username, password } = data;
        try {
            const { data } = await axios.post('/register', {
                firstname,
                lastname,
                email,
                username,
                password,
            });

            if (data.error) {
                addToast(data.error, 'error');
            } else {
                setData({});
                navigate('/login');
                addToast('Registrierung erfolgreich!', 'success');
            }
        } catch (error) {
            addToast(
                'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
                'error'
            );
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-300 to-red-300'>
            <div className='absolute inset-0 bg-white opacity-20 backdrop-filter backdrop-blur-sm'></div>
            <div className='relative w-full max-w-md'>
                <div className='absolute inset-0 bg-white opacity-75 rounded-xl shadow-2xl transform -rotate-6'></div>
                <div className='relative bg-white bg-opacity-90 rounded-xl shadow-xl overflow-hidden'>
                    <div className='px-10 pt-10 pb-8'>
                        <h2 className='text-center text-4xl font-extrabold text-blue-600 mb-8'>
                            TrackMyGoal
                        </h2>
                        <form onSubmit={registerUser} className='space-y-4'>
                            <div className='flex space-x-4'>
                                <div className='flex-1'>
                                    <label
                                        htmlFor='firstname'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Vorname
                                    </label>
                                    <input
                                        id='firstname'
                                        name='firstname'
                                        type='text'
                                        required
                                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                        value={data.firstname}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                firstname: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className='flex-1'>
                                    <label
                                        htmlFor='lastname'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Nachname
                                    </label>
                                    <input
                                        id='lastname'
                                        name='lastname'
                                        type='text'
                                        required
                                        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                        value={data.lastname}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                lastname: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    E-Mail-Adresse
                                </label>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    required
                                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                    value={data.email}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            email: e.target.value,
                                        })
                                    }
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
                                    id='username'
                                    name='username'
                                    type='text'
                                    required
                                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                    value={data.username}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            username: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    Passwort
                                </label>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    required
                                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                    value={data.password}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                >
                                    Registrieren
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='px-10 py-4 bg-gray-50 border-t border-gray-200 flex justify-center'>
                        <div className='text-sm'>
                            Bereits ein Konto?{' '}
                            <Link
                                to='/login'
                                className='font-medium text-blue-600 hover:text-blue-500'
                            >
                                Jetzt einloggen
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
