import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import DialogContainer from '../containers/DialogContainer';

const ForgotPasswordDialog = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'Bitte gib deine E-Mail-Adresse ein';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Bitte gib eine gültige E-Mail-Adresse ein';
        }
        return '';
    };

    const handleBlur = () => {
        setTouched(true);
        if (touched) {
            setError(validateEmail(email));
        }
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (touched) {
            setError(validateEmail(e.target.value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(true);

        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSubmitted(true);
        } catch (error) {
            setError(
                'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContainer onClose={onClose}>
            <div className='fixed inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-90' />

            {/* Decorative Elements */}
            <div className='absolute -inset-x-20 -inset-y-20 pointer-events-none'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='relative bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20 max-w-md w-full'>
                {/* Header */}
                <div className='p-6 border-b border-gray-200/50 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                <Mail className='w-6 h-6 text-white' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                    Passwort zurücksetzen
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className='p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors duration-200'
                        >
                            <X className='h-5 w-5 text-gray-400 dark:text-white/40' />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                    <p className='text-gray-600 dark:text-white/70 text-base mb-6'>
                        {submitted
                            ? 'Überprüfe deine E-Mails für weitere Anweisungen'
                            : 'Gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen'}
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='space-y-1.5'>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-gray-700 dark:text-white/70'
                                >
                                    E-Mail
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                        <Mail className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        value={email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder='max.mustermann@beispiel.de'
                                        className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border rounded-xl
                                                 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/40
                                                 focus:ring-2 focus:ring-[#4785FF] focus:border-transparent dark:focus:ring-[#4785FF]/50
                                                 transition-all duration-200 ${
                                                     error && touched
                                                         ? 'border-red-500 dark:border-red-500/50'
                                                         : 'border-gray-200 dark:border-white/10'
                                                 }`}
                                    />
                                </div>
                                {error && touched && (
                                    <p className='text-sm text-red-500 dark:text-red-400 mt-1'>
                                        {error}
                                    </p>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div className='space-y-4'>
                            <p className='text-gray-600 dark:text-white/70'>
                                Wir haben dir einen Link zum Zurücksetzen
                                deines Passworts an <strong>{email}</strong>{' '}
                                gesendet.
                            </p>
                            <p className='text-sm text-gray-500 dark:text-white/50'>
                                Überprüfe auch deinen Spam-Ordner, falls du
                                die E-Mail nicht finden kannst.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3 p-6 border-t border-gray-200/50 dark:border-white/10'>
                    <button
                        onClick={onClose}
                        className='px-6 py-3 rounded-xl font-medium
                            text-gray-700 dark:text-white/70 
                            bg-gray-100/50 dark:bg-gray-900/50
                            hover:bg-gray-200/50 dark:hover:bg-white/5
                            border border-gray-200/50 dark:border-white/10
                            transition-all duration-200'
                    >
                        Schließen
                    </button>
                    {!submitted && (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className='px-6 py-3 rounded-xl font-medium
                                bg-gradient-to-r from-[#4785FF] to-[#8c52ff]
                                text-white
                                shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10
                                hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20
                                transition-all duration-200 hover:-translate-y-0.5
                                disabled:opacity-50 disabled:cursor-not-allowed
                                disabled:hover:shadow-none disabled:hover:translate-y-0'
                        >
                            {loading ? (
                                <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            ) : (
                                'Link senden'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </DialogContainer>
    );
};

export default ForgotPasswordDialog;
