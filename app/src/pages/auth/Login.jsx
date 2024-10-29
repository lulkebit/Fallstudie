import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import {
    Lock,
    LogIn,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Sun,
    Moon,
    Rocket,
} from 'lucide-react';
import LandingNavbar from '../../components/LandingNavbar';

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
    onBlur,
}) => {
    // Nur Password-Felder sollten den Toggle-Button haben
    const isPasswordField = id === 'password';

    return (
        <div className='space-y-1.5'>
            <label
                htmlFor={id}
                className='block text-sm font-medium text-gray-700 dark:text-white/70'
            >
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
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`w-full pl-10 ${
                        isPasswordField ? 'pr-12' : 'pr-4'
                    } py-2.5 bg-white dark:bg-white/5 border rounded-xl
                             text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/40
                             focus:ring-2 focus:ring-[#4785FF] focus:border-transparent dark:focus:ring-[#4785FF]/50
                             transition-all duration-200 ${
                                 error
                                     ? 'border-red-500 dark:border-red-500/50'
                                     : 'border-gray-200 dark:border-white/10'
                             }`}
                />
                {isPasswordField && (
                    <button
                        type='button'
                        onClick={onTogglePassword}
                        className='absolute inset-y-0 right-0 flex items-center pr-3'
                    >
                        {showPassword ? (
                            <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60' />
                        ) : (
                            <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60' />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className='text-sm text-red-500 dark:text-red-400 mt-1'>
                    {error}
                </p>
            )}
        </div>
    );
};

const AuthNavbar = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <LandingNavbar
            hideNavItems={true}
            customActions={
                <div className='hidden lg:flex items-center gap-4'>
                    <button
                        onClick={toggleTheme}
                        className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
                    >
                        {isDarkMode ? <Sun /> : <Moon />}
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2'
                    >
                        <Rocket className='w-4 h-4' />
                        Jetzt starten
                    </button>
                </div>
            }
        />
    );
};

const Login = () => {
    const [data, setData] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [touched, setTouched] = useState({
        emailOrUsername: false,
        password: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'emailOrUsername':
                if (!value.trim()) {
                    error =
                        'Bitte geben Sie Ihre E-Mail oder Ihren Benutzernamen ein';
                } else if (
                    value.includes('@') &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                    error = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Bitte geben Sie Ihr Passwort ein';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, data[name]),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            emailOrUsername: validateField(
                'emailOrUsername',
                data.emailOrUsername
            ),
            password: validateField('password', data.password),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const loginUser = async (event) => {
        event.preventDefault();

        // Set all fields as touched
        setTouched({
            emailOrUsername: true,
            password: true,
        });

        if (!validateForm()) {
            addToast('Bitte füllen Sie alle Felder korrekt aus', 'error');
            return;
        }

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
        <div className='min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden'>
            <AuthNavbar />

            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/5 dark:bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/5 dark:bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            <div className='flex min-h-screen items-center justify-center px-4 pt-20 relative z-10'>
                <div className='w-full max-w-md'>
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none'>
                        <div className='px-8 pt-8 pb-6'>
                            <div className='flex flex-col items-center space-y-2 mb-8'>
                                <div className='h-16 w-16 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center shadow-lg'>
                                    <svg
                                        className='w-8 h-8 text-white'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M13 10V3L4 14h7v7l9-11h-7z'
                                        />
                                    </svg>
                                </div>
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Willkommen zurück
                                </h2>
                                <p className='text-gray-600 dark:text-white/60'>
                                    Melde dich an um fortzufahren
                                </p>
                            </div>

                            <form onSubmit={loginUser} className='space-y-5'>
                                <InputField
                                    label='E-Mail oder Benutzername'
                                    id='emailOrUsername'
                                    name='emailOrUsername'
                                    value={data.emailOrUsername}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    icon={User}
                                    placeholder='max.mustermann@beispiel.de'
                                    error={
                                        touched.emailOrUsername
                                            ? errors.emailOrUsername
                                            : ''
                                    }
                                />

                                <InputField
                                    label='Passwort'
                                    id='password'
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    icon={Lock}
                                    placeholder='••••••••'
                                    showPassword={showPassword}
                                    onTogglePassword={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    error={
                                        touched.password ? errors.password : ''
                                    }
                                />

                                <div className='flex items-center justify-between'>
                                    <label className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-200 dark:border-white/10 text-[#4785FF] focus:ring-[#4785FF]
                                                     dark:bg-white/5'
                                        />
                                        <span className='ml-2 text-sm text-gray-600 dark:text-white/70'>
                                            Angemeldet bleiben
                                        </span>
                                    </label>
                                    <Link
                                        to='/forgot-password'
                                        className='text-sm text-[#4785FF] hover:text-[#6769ff]'
                                    >
                                        Passwort vergessen?
                                    </Link>
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                             text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-xl
                                             hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                             focus:outline-none focus:ring-2 focus:ring-[#4785FF] focus:ring-offset-2
                                             dark:focus:ring-offset-gray-800 transition-all duration-200
                                             disabled:opacity-50 disabled:cursor-not-allowed'
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

                        <div className='px-8 py-6 bg-gray-50 dark:bg-white/5 rounded-b-2xl border-t border-gray-100 dark:border-white/10'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-gray-600 dark:text-white/70'>
                                    Noch kein Konto?
                                </span>
                                <Link
                                    to='/register'
                                    className='flex items-center gap-1 text-sm font-medium text-[#4785FF] hover:text-[#6769ff]
                                             group transition-colors duration-200'
                                >
                                    Jetzt registrieren
                                    <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform duration-200' />
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
