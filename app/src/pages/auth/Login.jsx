import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

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
        <div className='min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
                <svg
                    className='absolute bottom-0 left-0 w-full h-full'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1440 320'
                    preserveAspectRatio='none'
                >
                    <path
                        fill='#4F46E5'
                        fillOpacity='0.35'
                        d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                    ></path>
                </svg>
                <svg
                    className='absolute bottom-0 left-0 w-full h-full'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 1440 320'
                    preserveAspectRatio='none'
                >
                    <path
                        fill='#818CF8'
                        fillOpacity='0.4'
                        d='M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,122.7C960,139,1056,149,1152,138.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                    ></path>
                </svg>
            </div>

            <div className='w-full max-w-md z-10'>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                    <div className='px-10 pt-10 pb-8'>
                        <div className='flex justify-center mb-8'>
                            <img
                                src='/Logo.png'
                                alt='TrackMyGoal Logo'
                                className='h-32'
                            />
                        </div>
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
                                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
                                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
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
                                        className='font-medium text-indigo-600 hover:text-indigo-500'
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
                            Noch kein Konto?{' '}
                            <Link
                                to='/register'
                                className='font-medium text-indigo-600 hover:text-indigo-500'
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
