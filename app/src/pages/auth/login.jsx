import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/toastContext';

const Login = () => {
    const [data, setData] = useState({
        emailOrUsername: '',
        password: '',
    });
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const loginUser = async (event) => {
        event.preventDefault();
        const { emailOrUsername, password } = data;
        try {
            const { data } = await axios.post('/login', {
                emailOrUsername,
                password,
            });

            if (data.error) {
                addToast(data.error, 'error');
            } else {
                setUser(data.user);
                setData({});
                navigate('/dashboard');
                addToast('Login erfolgreich!', 'success');
            }
        } catch (error) {
            addToast(
                'Login fehlgeschlagen. Bitte versuchen Sie es erneut. ' + error,
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
                        <form onSubmit={loginUser} className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='emailOrUsername'
                                    className='block text-sm font-medium text-gray-700'
                                >
                                    E-Mail-Adresse oder Benutzername
                                </label>
                                <input
                                    id='emailOrUsername'
                                    name='emailOrUsername'
                                    type='text'
                                    required
                                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                    value={data.emailOrUsername}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            emailOrUsername: e.target.value,
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
                            <div className='flex items-center justify-between'>
                                <div className='text-sm'>
                                    <Link
                                        to='/forgot-password'
                                        className='font-medium text-blue-600 hover:text-blue-500'
                                    >
                                        Passwort vergessen?
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                >
                                    Einloggen
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='px-10 py-4 bg-gray-50 border-t border-gray-200 flex justify-center'>
                        <div className='text-sm'>
                            Noch kein Konto?
                            <Link
                                to='/register'
                                className='font-medium text-blue-600 hover:text-blue-500'
                            >
                                Jetzt registrieren
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
