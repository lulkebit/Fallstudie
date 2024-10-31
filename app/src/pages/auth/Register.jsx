import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import {
    Mail,
    Lock,
    User,
    UserPlus,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle2,
    Sun,
    Moon,
    LogIn,
    Check,
    Rocket,
    Zap,
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

const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const strength = getStrength();
    const getColor = () => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-green-500';
        return 'bg-green-600';
    };

    const requirements = [
        { text: 'Mindestens 8 Zeichen', met: password.length >= 8 },
        { text: 'Großbuchstaben (A-Z)', met: /[A-Z]/.test(password) },
        { text: 'Kleinbuchstaben (a-z)', met: /[a-z]/.test(password) },
        { text: 'Zahlen (0-9)', met: /[0-9]/.test(password) },
        {
            text: 'Sonderzeichen (!@#$%^&*)',
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <div className='mt-4 space-y-3'>
            <div className='space-y-2'>
                <div className='flex gap-1 h-1.5'>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-full w-full rounded-full ${
                                i < strength
                                    ? getColor()
                                    : 'bg-gray-200 dark:bg-white/10'
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {requirements.map((req, index) => (
                    <div key={index} className='flex items-center gap-1.5'>
                        <CheckCircle2
                            className={`h-4 w-4 ${
                                req.met
                                    ? 'text-green-500'
                                    : 'text-gray-300 dark:text-white/20'
                            }`}
                        />
                        <span
                            className={`text-xs ${
                                req.met
                                    ? 'text-gray-700 dark:text-white'
                                    : 'text-gray-500 dark:text-white/40'
                            }`}
                        >
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PricingToggle = ({ selectedPlan, onPlanChange }) => {
    return (
        <div className='space-y-1.5 mb-8'>
            <label className='block text-sm font-medium text-gray-700 dark:text-white/70'>
                Wähle deinen Plan
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div
                    className={`cursor-not-allowed p-4 rounded-xl border transition-all duration-200 ${
                        selectedPlan === 'basic'
                            ? 'border-[#4785FF] dark:border-[#4785FF] bg-[#4785FF]/5 dark:bg-[#4785FF]/10'
                            : 'border-gray-200 dark:border-white/10 hover:border-[#4785FF]/50 dark:hover:border-[#4785FF]/50'
                    }`}
                >
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-900 dark:text-white'>
                            Basic
                        </h3>
                        {selectedPlan === 'basic' && (
                            <Check className='w-5 h-5 text-[#4785FF]' />
                        )}
                    </div>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        Kostenlos
                    </p>
                </div>

                <div
                    onClick={() => onPlanChange('pro')}
                    className={`cursor-pointer p-4 rounded-xl border relative transition-all duration-200 ${
                        selectedPlan === 'pro'
                            ? 'border-[#4785FF] dark:border-[#4785FF] bg-[#4785FF]/5 dark:bg-[#4785FF]/10'
                            : 'border-gray-200 dark:border-white/10 hover:border-[#4785FF]/50 dark:hover:border-[#4785FF]/50'
                    }`}
                >
                    <div className='absolute -top-2 -right-2'>
                        <div className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white text-xs px-2 py-1 rounded-full'>
                            Empfohlen
                        </div>
                    </div>
                    <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-900 dark:text-white'>
                            Pro
                        </h3>
                        {selectedPlan === 'pro' && (
                            <Check className='w-5 h-5 text-[#4785FF]' />
                        )}
                    </div>
                    <p className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        9,99€{' '}
                        <span className='text-sm font-normal text-gray-500'>
                            /Monat
                        </span>
                    </p>
                </div>
            </div>
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
                <div className='flex items-center gap-4'>
                    <button
                        onClick={toggleTheme}
                        className='text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
                    >
                        {isDarkMode ? <Sun /> : <Moon />}
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2'
                    >
                        <LogIn className='w-4 h-4' />
                        <span className='hidden sm:inline'>Login</span>
                    </button>
                </div>
            }
        />
    );
};

const Register = () => {
    const [data, setData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
    });
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        firstname: false,
        lastname: false,
        email: false,
        username: false,
        password: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'firstname':
                if (!value.trim()) {
                    error = 'Bitte gib deinen Vornamen ein';
                } else if (value.trim().length < 2) {
                    error = 'Der Vorname muss mindestens 2 Zeichen lang sein';
                } else if (!/^[a-zA-ZäöüßÄÖÜ\s-]+$/.test(value)) {
                    error =
                        'Der Vorname darf nur Buchstaben und Bindestriche enthalten';
                }
                break;
            case 'lastname':
                if (!value.trim()) {
                    error = 'Bitte gib deinen Nachnamen ein';
                } else if (value.trim().length < 2) {
                    error = 'Der Nachname muss mindestens 2 Zeichen lang sein';
                } else if (!/^[a-zA-ZäöüßÄÖÜ\s-]+$/.test(value)) {
                    error =
                        'Der Nachname darf nur Buchstaben und Bindestriche enthalten';
                }
                break;
            case 'email':
                if (!value) {
                    error = 'Bitte gib deine E-Mail-Adresse ein';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Bitte gib eine gültige E-Mail-Adresse ein';
                }
                break;
            case 'username':
                if (!value) {
                    error = 'Bitte gib einen Benutzernamen ein';
                } else if (value.length < 3) {
                    error =
                        'Der Benutzername muss mindestens 3 Zeichen lang sein';
                } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
                    error =
                        'Der Benutzername darf nur Buchstaben, Zahlen, Punkte, Unterstriche und Bindestriche enthalten';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Bitte gib ein Passwort ein';
                } else {
                    const requirements = [
                        value.length >= 8,
                        /[A-Z]/.test(value),
                        /[a-z]/.test(value),
                        /[0-9]/.test(value),
                        /[^A-Za-z0-9]/.test(value),
                    ];

                    if (!requirements[0]) {
                        error =
                            'Das Passwort muss mindestens 8 Zeichen lang sein';
                    } else if (!requirements[1]) {
                        error =
                            'Das Passwort muss mindestens einen Großbuchstaben enthalten';
                    } else if (!requirements[2]) {
                        error =
                            'Das Passwort muss mindestens einen Kleinbuchstaben enthalten';
                    } else if (!requirements[3]) {
                        error =
                            'Das Passwort muss mindestens eine Zahl enthalten';
                    } else if (!requirements[4]) {
                        error =
                            'Das Passwort muss mindestens ein Sonderzeichen enthalten';
                    }
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
        const newErrors = {};
        Object.keys(data).forEach((key) => {
            const error = validateField(key, data[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerUser = async (event) => {
        event.preventDefault();

        setTouched({
            firstname: true,
            lastname: true,
            email: true,
            username: true,
            password: true,
        });

        if (!validateForm()) {
            addToast('Bitte fülle alle Felder korrekt aus', 'error');
            return;
        }

        setLoading(true);
        try {
            const { data: responseData } = await axios.post('/register', {
                ...data,
                plan: selectedPlan,
            });

            if (responseData.error) {
                addToast(responseData.error, 'error');
            } else {
                setData({});
                navigate('/login');
                addToast(
                    'Registrierung erfolgreich! Du kannst dich jetzt einloggen.',
                    'success'
                );
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
            addToast(errorMessage, 'error');
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

            <div className='flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative z-10'>
                <div className='w-full max-w-md'>
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none'>
                        <div className='px-4 sm:px-8 pt-8 pb-6'>
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
                                <h2 className='text-2xl font-bold text-gray-900 dark:text-white text-center'>
                                    Konto erstellen
                                </h2>
                                <p className='text-gray-600 dark:text-white/60 text-center'>
                                    Erstelle ein Konto um TrackMyGoal zu nutzen
                                </p>
                            </div>

                            <form onSubmit={registerUser} className='space-y-5'>
                                <PricingToggle
                                    selectedPlan={selectedPlan}
                                    onPlanChange={setSelectedPlan}
                                />

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <InputField
                                        label='Vorname'
                                        id='firstname'
                                        name='firstname'
                                        value={data.firstname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        icon={User}
                                        placeholder='Max'
                                        error={
                                            touched.firstname
                                                ? errors.firstname
                                                : ''
                                        }
                                    />
                                    <InputField
                                        label='Nachname'
                                        id='lastname'
                                        name='lastname'
                                        value={data.lastname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        icon={User}
                                        placeholder='Mustermann'
                                        error={
                                            touched.lastname
                                                ? errors.lastname
                                                : ''
                                        }
                                    />
                                </div>

                                <InputField
                                    label='E-Mail'
                                    id='email'
                                    name='email'
                                    type='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    icon={Mail}
                                    placeholder='max.mustermann@beispiel.de'
                                    error={touched.email ? errors.email : ''}
                                />

                                <InputField
                                    label='Benutzername'
                                    id='username'
                                    name='username'
                                    value={data.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    icon={User}
                                    placeholder='maxmustermann'
                                    error={
                                        touched.username ? errors.username : ''
                                    }
                                />

                                <div>
                                    <InputField
                                        label='Passwort'
                                        id='password'
                                        name='password'
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
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
                                            touched.password
                                                ? errors.password
                                                : ''
                                        }
                                    />
                                    <PasswordStrengthIndicator
                                        password={data.password}
                                    />
                                </div>

                                {selectedPlan === 'pro' && (
                                    <div className='bg-[#4785FF]/5 dark:bg-[#4785FF]/10 border border-[#4785FF]/20 rounded-xl p-4'>
                                        <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                            Zahlungsübersicht
                                        </h4>
                                        <div className='space-y-2'>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-gray-600 dark:text-white/70'>
                                                    Pro Plan (Monatlich)
                                                </span>
                                                <span className='text-gray-900 dark:text-white font-medium'>
                                                    8,39€
                                                </span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-gray-600 dark:text-white/70'>
                                                    MwSt. (19%)
                                                </span>
                                                <span className='text-gray-900 dark:text-white font-medium'>
                                                    1,60€
                                                </span>
                                            </div>
                                            <div className='border-t border-[#4785FF]/20 pt-2 mt-2'>
                                                <div className='flex justify-between'>
                                                    <span className='font-medium text-gray-900 dark:text-white'>
                                                        Gesamt
                                                    </span>
                                                    <span className='font-medium text-gray-900 dark:text-white'>
                                                        9,99€
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Datenschutz Information statt Checkbox */}
                                <div className='text-sm text-gray-600 dark:text-white/70'>
                                    Mit der Registrierung stimmst du unseren{' '}
                                    <Link
                                        to='/datenschutz'
                                        className='text-[#4785FF] hover:text-[#6769ff]'
                                    >
                                        Datenschutzrichtlinien
                                    </Link>{' '}
                                    zu.
                                </div>

                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white py-2.5 rounded-xl
                                             font-medium shadow-md hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                                             focus:outline-none focus:ring-2 focus:ring-[#4785FF] focus:ring-offset-2 dark:focus:ring-offset-gray-800
                                             transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loading ? (
                                        <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    ) : (
                                        <>
                                            <UserPlus className='h-5 w-5' />
                                            <span className='hidden sm:inline'>
                                                Registrieren{' '}
                                                {selectedPlan === 'pro' &&
                                                    '& Bezahlen'}
                                            </span>
                                            <span className='sm:hidden'>
                                                {selectedPlan === 'pro'
                                                    ? 'Registrieren'
                                                    : "Los geht's"}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className='px-4 sm:px-8 py-6 bg-gray-50 dark:bg-white/5 rounded-b-2xl border-t border-gray-100 dark:border-white/10'>
                            <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0'>
                                <Link
                                    to='/login'
                                    className='flex items-center gap-1 text-sm font-medium text-[#4785FF] hover:text-[#6769ff] dark:text-[#4785FF] dark:hover:text-[#6769ff] transition-colors duration-200'
                                >
                                    <ArrowLeft className='h-4 w-4' />
                                    Zurück zum Login
                                </Link>
                                <span className='text-sm text-gray-600 dark:text-white/70'>
                                    Bereits registriert?
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
