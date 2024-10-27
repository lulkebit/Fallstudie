import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';

const Kontakt = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name ist erforderlich';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'E-Mail ist erforderlich';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Nachricht ist erforderlich';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                // Here you would typically send the data to your backend
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } catch (error) {
                setSubmitStatus('error');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 relative'>
            <LandingNavbar hideNavItems={true} />

            {/* Decorative Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/5 dark:bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/5 dark:bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 pt-24 pb-24'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <div className='inline-block mb-4'>
                        <div className='h-16 w-16 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center shadow-lg mx-auto'>
                            <Mail className='w-8 h-8 text-white' />
                        </div>
                    </div>
                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                        Kontaktieren Sie uns
                    </h1>
                    <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
                        Haben Sie Fragen oder Anregungen? Wir freuen uns über
                        Ihre Nachricht und werden uns zeitnah bei Ihnen melden.
                    </p>
                </div>

                <div className='max-w-6xl mx-auto'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Contact Information Card */}
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none p-8'>
                            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
                                Kontaktinformationen
                            </h2>

                            <div className='space-y-8'>
                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4785FF] to-[#8c52ff] rounded-xl flex items-center justify-center'>
                                        <MapPin className='w-6 h-6 text-white' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-gray-900 dark:text-white mb-2'>
                                            Adresse
                                        </p>
                                        <p className='text-gray-600 dark:text-gray-300'>
                                            TrackMyGoal GmbH
                                            <br />
                                            Musterstraße 123
                                            <br />
                                            12345 Musterstadt
                                            <br />
                                            Deutschland
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4785FF] to-[#8c52ff] rounded-xl flex items-center justify-center'>
                                        <Phone className='w-6 h-6 text-white' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-gray-900 dark:text-white mb-2'>
                                            Telefon
                                        </p>
                                        <p className='text-gray-600 dark:text-gray-300'>
                                            +49 (0) 123 4567890
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4785FF] to-[#8c52ff] rounded-xl flex items-center justify-center'>
                                        <Mail className='w-6 h-6 text-white' />
                                    </div>
                                    <div>
                                        <p className='font-medium text-gray-900 dark:text-white mb-2'>
                                            E-Mail
                                        </p>
                                        <a
                                            href='mailto:info@trackmygoal.com'
                                            className='text-[#4785FF] hover:text-[#8c52ff] transition-colors duration-200'
                                        >
                                            info@trackmygoal.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Card */}
                        <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl dark:shadow-none p-8'>
                            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
                                Kontaktformular
                            </h2>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div>
                                    <label
                                        htmlFor='name'
                                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                    >
                                        Name
                                    </label>
                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 bg-white dark:bg-white/5 border rounded-xl
                             text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/40
                             focus:ring-2 focus:ring-[#4785FF] focus:border-transparent dark:focus:ring-[#4785FF]/50
                             transition-all duration-200 ${
                                 errors.name
                                     ? 'border-red-500'
                                     : 'border-gray-200 dark:border-white/10'
                             }`}
                                        placeholder='Ihr Name'
                                    />
                                    {errors.name && (
                                        <p className='mt-1 text-sm text-red-500'>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor='email'
                                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                    >
                                        E-Mail
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 bg-white dark:bg-white/5 border rounded-xl
                             text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/40
                             focus:ring-2 focus:ring-[#4785FF] focus:border-transparent dark:focus:ring-[#4785FF]/50
                             transition-all duration-200 ${
                                 errors.email
                                     ? 'border-red-500'
                                     : 'border-gray-200 dark:border-white/10'
                             }`}
                                        placeholder='Ihre E-Mail-Adresse'
                                    />
                                    {errors.email && (
                                        <p className='mt-1 text-sm text-red-500'>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor='message'
                                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                                    >
                                        Nachricht
                                    </label>
                                    <textarea
                                        id='message'
                                        name='message'
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows='4'
                                        className={`w-full px-4 py-2.5 bg-white dark:bg-white/5 border rounded-xl
                             text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/40
                             focus:ring-2 focus:ring-[#4785FF] focus:border-transparent dark:focus:ring-[#4785FF]/50
                             transition-all duration-200 ${
                                 errors.message
                                     ? 'border-red-500'
                                     : 'border-gray-200 dark:border-white/10'
                             }`}
                                        placeholder='Ihre Nachricht'
                                    />
                                    {errors.message && (
                                        <p className='mt-1 text-sm text-red-500'>
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                           text-white py-3 rounded-xl font-medium shadow-md hover:shadow-xl
                           hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                           focus:outline-none focus:ring-2 focus:ring-[#4785FF] focus:ring-offset-2
                           dark:focus:ring-offset-gray-800 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isSubmitting ? (
                                        <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    ) : (
                                        <>
                                            <Send className='h-5 w-5' />
                                            Nachricht senden
                                        </>
                                    )}
                                </button>

                                {submitStatus === 'success' && (
                                    <p className='text-green-500 text-center mt-4'>
                                        Ihre Nachricht wurde erfolgreich
                                        gesendet!
                                    </p>
                                )}
                                {submitStatus === 'error' && (
                                    <p className='text-red-500 text-center mt-4'>
                                        Ein Fehler ist aufgetreten. Bitte
                                        versuchen Sie es später erneut.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Kontakt;
