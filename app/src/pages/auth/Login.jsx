import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import {
    Mail,
    Lock,
    LogIn,
    User,
    Eye,
    EyeOff,
    Github,
    ArrowRight,
} from 'lucide-react';
import Waves from '../../components/Waves';

const InputField = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    icon: Icon,
    placeholder,
    error,
    showPassword,
    onTogglePassword,
}) => (
    <div className='space-y-1.5'>
        <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
            {label}
        </label>
        <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <Icon className='h-5 w-5 text-gray-400' />
            </div>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className='w-full pl-10 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg
                         text-gray-900 text-sm placeholder:text-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200'
            />
            {type === 'password' && (
                <button
                    type='button'
                    onClick={onTogglePassword}
                    className='absolute inset-y-0 right-0 flex items-center pr-3'
                >
                    {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    ) : (
                        <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    )}
                </button>
            )}
        </div>
        {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
);

const Login = () => {
    const [data, setData] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const loginUser = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data: responseData } = await axios.post('/login', data);

            if (responseData.error) {
                addToast(responseData.error, 'error');
            } else {
                setUser(responseData.user);
                setData({});
                navigate('/dashboard');
                addToast('Login erfolgreich!', 'success');
            }
        } catch (error) {
            addToast(
                'Login fehlgeschlagen. Bitte versuchen Sie es erneut.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100'>
            <Waves />
            <div className='flex min-h-screen items-center justify-center px-4 py-12 relative z-50'>
                <div className='w-full max-w-md'>
                    <div className='bg-white rounded-2xl shadow-xl'>
                        <div className='px-8 pt-8 pb-6'>
                            <div className='flex flex-col items-center space-y-2 mb-8'>
                                <img
                                    src='/Logo.png'
                                    alt='TrackMyGoal Logo'
                                    className='h-24 w-24 object-contain'
                                />
                                <h2 className='text-2xl font-bold text-gray-900'>
                                    Willkommen zurück
                                </h2>
                                <p className='text-gray-500'>
                                    Melde dich an um fortzufahren
                                </p>
                            </div>

                            <form onSubmit={loginUser} className='space-y-5'>
                                <InputField
                                    label='E-Mail oder Benutzername'
                                    id='emailOrUsername'
                                    value={data.emailOrUsername}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            emailOrUsername: e.target.value,
                                        })
                                    }
                                    icon={User}
                                    placeholder='max.mustermann@beispiel.de'
                                />

                                <InputField
                                    label='Passwort'
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            password: e.target.value,
                                        })
                                    }
                                    icon={Lock}
                                    placeholder='••••••••'
                                    showPassword={showPassword}
                                    onTogglePassword={() =>
                                        setShowPassword(!showPassword)
                                    }
                                />

                                <div className='flex items-center justify-between'>
                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                        />
                                        <span className='ml-2 text-sm text-gray-600'>
                                            Angemeldet bleiben
                                        </span>
                                    </label>
                                    <Link
                                        to='/forgot-password'
                                        className='text-sm text-blue-600 hover:text-blue-700'
                                    >
                                        Passwort vergessen?
                                    </Link>
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg
                                             font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loading ? (
                                        <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    ) : (
                                        <>
                                            <LogIn className='h-5 w-5' />
                                            Einloggen
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className='px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-100'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600'>
                                    Noch kein Konto?
                                </span>
                                <Link
                                    to='/register'
                                    className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700'
                                >
                                    Jetzt registrieren
                                    <ArrowRight className='h-4 w-4' />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
