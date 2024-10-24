import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import {
    Mail,
    Lock,
    User,
    UserPlus,
    Eye,
    EyeOff,
    Github,
    ArrowLeft,
    CheckCircle2,
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
                <div className='flex gap-1 h-1'>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-full w-full rounded-full ${
                                i < strength ? getColor() : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                {requirements.map((req, index) => (
                    <div key={index} className='flex items-center gap-1.5'>
                        <CheckCircle2
                            className={`h-4 w-4 ${
                                req.met ? 'text-green-500' : 'text-gray-300'
                            }`}
                        />
                        <span
                            className={`text-xs ${
                                req.met ? 'text-gray-700' : 'text-gray-500'
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

const Register = () => {
    const [data, setData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { addToast } = useToast();

    const validateForm = () => {
        const newErrors = {};

        if (data.password.length < 8) {
            newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein';
        }

        if (!data.email.includes('@')) {
            newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        }

        if (data.username.length < 3) {
            newErrors.username =
                'Benutzername muss mindestens 3 Zeichen lang sein';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerUser = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            addToast('Bitte überprüfen Sie Ihre Eingaben.', 'error');
            return;
        }

        setLoading(true);
        try {
            const { data: responseData } = await axios.post('/register', data);

            if (responseData.error) {
                addToast(responseData.error, 'error');
            } else {
                setData({});
                navigate('/login');
                addToast(
                    'Registrierung erfolgreich! Sie können sich jetzt einloggen.',
                    'success'
                );
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden'>
            <Waves className='absolute inset-0' />

            <div className='flex min-h-screen items-center justify-center px-4 py-12 relative z-10'>
                <div className='w-full max-w-md'>
                    <div className='bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl'>
                        <div className='px-8 pt-8 pb-6'>
                            <div className='flex flex-col items-center space-y-2 mb-8'>
                                <img
                                    src='/Logo.png'
                                    alt='TrackMyGoal Logo'
                                    className='h-24 w-24 object-contain'
                                />
                                <h2 className='text-2xl font-bold text-gray-900'>
                                    Konto erstellen
                                </h2>
                                <p className='text-gray-500'>
                                    Erstelle ein Konto um TrackMyGoal zu nutzen
                                </p>
                            </div>

                            <form onSubmit={registerUser} className='space-y-5'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <InputField
                                        label='Vorname'
                                        id='firstname'
                                        value={data.firstname}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                firstname: e.target.value,
                                            })
                                        }
                                        icon={User}
                                        placeholder='Max'
                                        error={errors.firstname}
                                    />
                                    <InputField
                                        label='Nachname'
                                        id='lastname'
                                        value={data.lastname}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                lastname: e.target.value,
                                            })
                                        }
                                        icon={User}
                                        placeholder='Mustermann'
                                        error={errors.lastname}
                                    />
                                </div>

                                <InputField
                                    label='E-Mail'
                                    id='email'
                                    type='email'
                                    value={data.email}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            email: e.target.value,
                                        })
                                    }
                                    icon={Mail}
                                    placeholder='max.mustermann@beispiel.de'
                                    error={errors.email}
                                />

                                <InputField
                                    label='Benutzername'
                                    id='username'
                                    value={data.username}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            username: e.target.value,
                                        })
                                    }
                                    icon={User}
                                    placeholder='maxmustermann'
                                    error={errors.username}
                                />

                                <div>
                                    <InputField
                                        label='Passwort'
                                        id='password'
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
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
                                        error={errors.password}
                                    />
                                    <PasswordStrengthIndicator
                                        password={data.password}
                                    />
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
                                            <UserPlus className='h-5 w-5' />
                                            Registrieren
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className='px-8 py-6 bg-gray-50/80 backdrop-blur-sm rounded-b-2xl border-t border-gray-100'>
                            <div className='flex items-center justify-between'>
                                <Link
                                    to='/login'
                                    className='flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700'
                                >
                                    <ArrowLeft className='h-4 w-4' />
                                    Zurück zum Login
                                </Link>
                                <span className='text-sm text-gray-600'>
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
