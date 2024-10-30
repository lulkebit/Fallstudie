import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, ChevronRight, Rocket, Target, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import Arman from '../images/Arman.jpg';
import JeanLuc from '../images/Jean-Luc.jpeg';
import Luke from '../images/Luke.jpeg';
import Sönke from '../images/Soenke.jpeg';
import Loader from '../components/Loader';

const avatars = [
    {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500',
        alt: 'Young professional man smiling',
    },
    {
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=500&h=500',
        alt: 'Professional woman with red hair',
    },
    {
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=500&h=500',
        alt: 'Young man in business casual',
    },
    {
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=500&h=500',
        alt: 'Woman smiling at camera',
    },
];

const Landingpage = () => {
    const [activeGoal, setActiveGoal] = useState(0);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location.state]);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get('/global-goals');
                const topGoals = response.data
                    .sort((a, b) => b.participationCount - a.participationCount)
                    .slice(0, 3)
                    .map((goal) => ({
                        title: goal.title,
                        progress: Math.round(
                            (goal.currentValue / goal.targetValue) * 100
                        ),
                        category: goal.category || 'Community',
                        currentValue: goal.currentValue,
                        targetValue: goal.targetValue,
                        unit: goal.unit,
                        participationCount: goal.participationCount,
                        streak: Math.floor(Math.random() * 30) + 1,
                    }));
                setGoals(topGoals);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching global goals:', error);
                setGoals([
                    {
                        title: 'Laden...',
                        progress: 0,
                        category: 'Laden...',
                        currentValue: 0,
                        targetValue: 100,
                        unit: '',
                        participationCount: 0,
                        streak: 0,
                    },
                ]);
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    useEffect(() => {
        if (goals.length === 0) return;

        const timer = setInterval(() => {
            setActiveGoal((prev) => (prev + 1) % goals.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [goals.length]);

    return (
        <div className='min-h-screen bg-white dark:bg-gray-900'>
            <LandingNavbar />

            {/* Modern Hero Section */}
            <section
                id='first-section'
                className='relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex overflow-hidden'
            >
                {/* Left Content Side */}
                <div className='w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-20 relative z-10'>
                    <div className='flex items-center gap-2 mb-8'>
                        <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                            <img
                                src='/Logo.png'
                                alt='TrackMyGoal Logo'
                                className='h-8 w-8 object-contain'
                            />
                        </div>
                        <span className='text-gray-600 dark:text-white/80 font-medium'>
                            TrackMyGoal
                        </span>
                    </div>

                    <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
                        Mach deine Ziele zur{' '}
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                            Erfolgsgeschichte
                        </span>
                    </h1>

                    <p className='text-lg text-gray-600 dark:text-white/70 mb-8 max-w-xl leading-relaxed'>
                        Visualisiere deinen Fortschritt, bleib motiviert und
                        erreiche deine Ziele mit einem intelligenten System, das
                        sich an deine Bedürfnisse anpasst.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 mb-12'>
                        <button
                            onClick={() => navigate('/register')}
                            className='px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-[#4785FF] to-[#8c52ff] hover:shadow-lg hover:shadow-[#4785FF]/20 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2'
                        >
                            <Rocket className='w-4 h-4' />
                            Jetzt starten
                        </button>
                    </div>

                    <div className='flex items-center gap-8'>
                        <div className='flex -space-x-3'>
                            {avatars.map((avatar, i) => (
                                <div
                                    key={i}
                                    className='w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden relative hover:-translate-y-1 transition-transform duration-200'
                                    style={{
                                        zIndex: avatars.length - i,
                                    }}
                                >
                                    <img
                                        src={avatar.src}
                                        alt={avatar.alt}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='text-gray-500 dark:text-white/60 text-sm'>
                            Bereits über{' '}
                            <span className='text-gray-900 dark:text-white font-medium'>
                                10.000+ Nutzer
                            </span>
                            <br />
                            vertrauen TrackMyGoal
                        </div>
                    </div>
                </div>

                {/* Right Interactive Side */}
                <div className='hidden lg:flex w-1/2 items-center justify-center relative'>
                    {/* Background Decorative Elements */}
                    <div className='absolute inset-0'>
                        <div className='absolute top-1/4 right-1/4 w-64 h-64 bg-[#4785FF]/20 rounded-full blur-3xl animate-pulse'></div>
                        <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
                    </div>

                    {/* Interactive Goal Cards */}
                    <div className='relative w-full max-w-md px-8'>
                        {loading ? (
                            <div className='flex items-center justify-center h-64'>
                                <Loader />
                            </div>
                        ) : (
                            goals.map((goal, index) => (
                                <div
                                    key={index}
                                    className={`absolute w-full p-6 bg-white dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-none transform transition-all duration-500 ${
                                        index === activeGoal
                                            ? 'translate-y-0 opacity-100 scale-100'
                                            : index < activeGoal
                                            ? '-translate-y-8 opacity-0 scale-95'
                                            : 'translate-y-8 opacity-0 scale-95'
                                    }`}
                                >
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <span className='text-gray-500 dark:text-white/60 text-sm'>
                                                {goal.category}
                                            </span>
                                            <h3 className='text-gray-900 dark:text-white text-xl font-medium'>
                                                {goal.title}
                                            </h3>
                                        </div>
                                        {goal.progress >= 75 ? (
                                            <div className='h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center'>
                                                <Check className='h-5 w-5 text-green-500' />
                                            </div>
                                        ) : (
                                            <div className='h-8 w-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center'>
                                                <TrendingUp className='h-5 w-5 text-gray-500 dark:text-white/80' />
                                            </div>
                                        )}
                                    </div>

                                    <div className='relative h-2 bg-gray-100 dark:bg-white/10 rounded-full mb-4'>
                                        <div
                                            className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] transition-all duration-1000'
                                            style={{
                                                width: `${goal.progress}%`,
                                            }}
                                        />
                                    </div>

                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500 dark:text-white/60'>
                                            Fortschritt
                                        </span>
                                        <span className='text-gray-900 dark:text-white font-medium'>
                                            {goal.progress}%
                                        </span>
                                    </div>

                                    <div className='mt-4 grid grid-cols-3 gap-2'>
                                        <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                                            <div className='text-gray-400 dark:text-white/40 text-xs'>
                                                Aktuell
                                            </div>
                                            <div className='text-gray-900 dark:text-white text-sm font-medium'>
                                                {goal.currentValue} {goal.unit}
                                            </div>
                                        </div>
                                        <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                                            <div className='text-gray-400 dark:text-white/40 text-xs'>
                                                Teilnahmen
                                            </div>
                                            <div className='text-gray-900 dark:text-white text-sm font-medium'>
                                                {goal.participationCount}
                                            </div>
                                        </div>
                                        <div className='bg-gray-50 dark:bg-white/5 rounded-lg p-2'>
                                            <div className='text-gray-400 dark:text-white/40 text-xs'>
                                                Streak
                                            </div>
                                            <div className='text-gray-900 dark:text-white text-sm font-medium'>
                                                {goal.streak} Tage
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile Goal Preview */}
                <div className='lg:hidden absolute inset-0 flex items-end justify-center pb-20 z-0 opacity-10'>
                    <div className='w-full max-w-sm px-6'>
                        <div className='bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/20 p-6'>
                            <div className='h-40'></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section
                id='second-section'
                className='py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden'
            >
                {/* Animated Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
                </div>

                <div className='container mx-auto px-4 relative'>
                    <div className='text-center max-w-4xl mx-auto mb-20'>
                        <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Unsere Vision für deine{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                Zukunft
                            </span>
                        </h2>
                        <p className='text-xl md:text-2xl text-gray-600 dark:text-white/70 font-light'>
                            Wir glauben an eine Zukunft, in der jeder sein
                            volles Potenzial entfalten kann
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative z-10'>
                        {[
                            {
                                icon: (
                                    <svg
                                        className='w-8 h-8'
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
                                ),
                                title: 'Innovation',
                                description:
                                    'Wir entwickeln intuitive Lösungen, die das Erreichen von Zielen revolutionieren',
                                gradient: 'from-[#4785FF] to-[#6769ff]',
                            },
                            {
                                icon: (
                                    <svg
                                        className='w-8 h-8'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                        />
                                    </svg>
                                ),
                                title: 'Gemeinschaft',
                                description:
                                    'Eine starke Community, die sich gegenseitig unterstützt und motiviert',
                                gradient: 'from-[#6769ff] to-[#8c52ff]',
                            },
                            {
                                icon: (
                                    <svg
                                        className='w-8 h-8'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                                        />
                                    </svg>
                                ),
                                title: 'Vertrauen',
                                description:
                                    'Sicherheit und Transparenz stehen bei uns an erster Stelle',
                                gradient: 'from-[#8c52ff] to-[#4785FF]',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className='group bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none'
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transform transition-transform duration-300`}
                                >
                                    {item.icon}
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                                    {item.title}
                                </h3>
                                <p className='text-gray-600 dark:text-white/70'>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 md:p-12 shadow-lg dark:shadow-none'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
                            {[
                                {
                                    number: '10k+',
                                    label: 'Aktive Nutzer',
                                    sublabel: 'die ihre Ziele erreichen',
                                },
                                {
                                    number: '50k+',
                                    label: 'Erreichte Ziele',
                                    sublabel: 'und counting',
                                },
                                {
                                    number: '95%',
                                    label: 'Zufriedenheit',
                                    sublabel: 'unserer Community',
                                },
                            ].map((stat, index) => (
                                <div key={index} className='text-center group'>
                                    <div className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff] mb-2 group-hover:scale-110 transform transition-transform duration-300'>
                                        {stat.number}
                                    </div>
                                    <div className='text-lg font-semibold text-gray-900 dark:text-white mb-1'>
                                        {stat.label}
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-white/60'>
                                        {stat.sublabel}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mt-16 text-center'>
                        <button
                            onClick={() =>
                                document
                                    .getElementById('third-section')
                                    .scrollIntoView({ behavior: 'smooth' })
                            }
                            className='group px-8 py-4 rounded-xl font-medium text-gray-700 dark:text-white bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 mx-auto shadow-lg dark:shadow-none'
                        >
                            Entdecke deine Möglichkeiten
                            <svg
                                className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M9 5l7 7-7 7'
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id='third-section'
                className='py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden'
            >
                {/* Animated Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
                </div>

                <div className='container mx-auto px-4 relative z-10'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Deine{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                Vorteile
                            </span>
                        </h2>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Mit TrackMyGoal erhältst du alle Werkzeuge, die du
                            brauchst, um deine Ziele erfolgreich zu erreichen
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {[
                            {
                                image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1000&h=600',
                                altText: 'Mann plant Ziele an einem Whiteboard',
                                category: 'Zielplanung',
                                title: 'Strukturiert zum Erfolg',
                                description:
                                    'Organisiere deine Ziele an einem zentralen Ort und behalte den Überblick über deine Projekte',
                                features: [
                                    'Übersichtliches Dashboard',
                                    'Flexible Zielsetzung',
                                    'Einfache Verwaltung',
                                ],
                                gradient: 'from-[#4785FF] to-[#6769ff]',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&h=600',
                                altText: 'Team arbeitet zusammen an Projekten',
                                category: 'Community',
                                title: 'Gemeinsam erfolgreich',
                                description:
                                    'Vernetze dich mit Gleichgesinnten und erreiche deine Ziele im Team',
                                features: [
                                    'Teile deine Fortschritte',
                                    'Gegenseitige Motivation',
                                    'Gemeinsame Projekte',
                                ],
                                gradient: 'from-[#6769ff] to-[#8c52ff]',
                            },
                            {
                                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&h=600',
                                altText:
                                    'Grafiken und Charts zeigen Fortschritt',
                                category: 'Tracking',
                                title: 'Visualisiere deinen Fortschritt',
                                description:
                                    'Behalte den Überblick über deine Entwicklung mit detaillierten Analysen',
                                features: [
                                    'Visuelle Statistiken',
                                    'Fortschrittsindikatoren',
                                    'Meilenstein-Tracking',
                                ],
                                gradient: 'from-[#8c52ff] to-[#4785FF]',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className='group bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 shadow-lg dark:shadow-none'
                            >
                                <div className='aspect-[16/10] relative overflow-hidden'>
                                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10'></div>
                                    <img
                                        src={feature.image}
                                        alt={feature.altText}
                                        className='w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute bottom-4 left-4 right-4 z-20'>
                                        <div
                                            className={`bg-gradient-to-r ${feature.gradient} text-white text-sm px-3 py-1 rounded-full w-fit mb-2`}
                                        >
                                            {feature.category}
                                        </div>
                                    </div>
                                </div>

                                <div className='p-6'>
                                    <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#4785FF] group-hover:to-[#8c52ff] transition-all duration-300'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-gray-600 dark:text-white/70 mb-6'>
                                        {feature.description}
                                    </p>
                                    <ul className='space-y-3'>
                                        {feature.features.map(
                                            (item, itemIndex) => (
                                                <li
                                                    key={itemIndex}
                                                    className='flex items-center text-gray-600 dark:text-white/70'
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}
                                                    >
                                                        <svg
                                                            className='w-4 h-4 text-white'
                                                            fill='none'
                                                            stroke='currentColor'
                                                            viewBox='0 0 24 24'
                                                        >
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                strokeWidth='2'
                                                                d='M5 13l4 4L19 7'
                                                            />
                                                        </svg>
                                                    </div>
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section
                id='fourth-section'
                className='py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden'
            >
                {/* Animated Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
                </div>

                <div className='container mx-auto px-4 relative z-10'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Finde deinen{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                perfekten Plan
                            </span>
                        </h2>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Wähle das passende Paket für deine Ziele und starte
                            noch heute
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                        {/* Basic Plan */}
                        <div className='group bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 shadow-lg dark:shadow-none'>
                            <div className='flex flex-col h-full'>
                                <div className='mb-8'>
                                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                        Basic
                                    </h3>
                                    <div className='flex items-baseline gap-2 mb-6'>
                                        <span className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#6769ff]'>
                                            Kostenlos
                                        </span>
                                    </div>
                                    <p className='text-gray-600 dark:text-white/70 mb-6'>
                                        Perfekt für Einsteiger, die ihre ersten
                                        Ziele erreichen möchten
                                    </p>
                                </div>

                                <div className='space-y-4 mb-8 flex-grow'>
                                    {[
                                        'Bis zu 3 persönliche Ziele',
                                        'Basis-Tracking',
                                        'Community Zugang',
                                        'Email Support',
                                    ].map((feature, index) => (
                                        <div
                                            key={index}
                                            className='flex items-center gap-3'
                                        >
                                            <div className='w-5 h-5 rounded-full bg-gradient-to-br from-[#4785FF] to-[#6769ff] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300'>
                                                <svg
                                                    className='w-3 h-3 text-white'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M5 13l4 4L19 7'
                                                    />
                                                </svg>
                                            </div>
                                            <span className='text-gray-600 dark:text-white/70'>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button className='cursor-not-allowed w-full py-3 px-4 rounded-xl text-gray-700 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-300 font-medium'>
                                    Aktuell nicht Verfügbar
                                </button>
                            </div>
                        </div>

                        {/* Pro Plan */}
                        <div className='relative group'>
                            <div className='absolute -inset-[1px] bg-gradient-to-r from-[#4785FF] to-[#8c52ff] rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300'></div>
                            <div className='relative bg-white dark:bg-gray-900 rounded-2xl p-8 h-full hover:-translate-y-2 transition-transform duration-300 shadow-xl'>
                                <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                    <div className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white text-sm px-4 py-1 rounded-full font-medium'>
                                        Beliebt
                                    </div>
                                </div>

                                <div className='flex flex-col h-full'>
                                    <div className='mb-8'>
                                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                            Pro
                                        </h3>
                                        <div className='flex items-baseline gap-2 mb-6'>
                                            <span className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                                9,99€
                                            </span>
                                            <span className='text-gray-600 dark:text-white/70'>
                                                /Monat
                                            </span>
                                        </div>
                                        <p className='text-gray-600 dark:text-white/70 mb-6'>
                                            Ideal für ambitionierte Nutzer mit
                                            mehreren Zielen
                                        </p>
                                    </div>

                                    <div className='space-y-4 mb-8 flex-grow'>
                                        {[
                                            'Unbegrenzte persönliche Ziele',
                                            'Detaillierte Analysen & Berichte',
                                            'Teamfunktionen & Kollaboration',
                                            'Meilenstein-Tracking',
                                            'Fortgeschrittene Statistiken',
                                            'Prioritäts-Support',
                                        ].map((feature, index) => (
                                            <div
                                                key={index}
                                                className='flex items-center gap-3'
                                            >
                                                <div className='w-5 h-5 rounded-full bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300'>
                                                    <svg
                                                        className='w-3 h-3 text-white'
                                                        fill='none'
                                                        stroke='currentColor'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            strokeWidth='2'
                                                            d='M5 13l4 4L19 7'
                                                        />
                                                    </svg>
                                                </div>
                                                <span className='text-gray-600 dark:text-white/70'>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate('/register')}
                                        className='w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300'
                                    >
                                        Jetzt upgraden
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div className='group bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 shadow-lg dark:shadow-none'>
                            <div className='flex flex-col h-full'>
                                <div className='mb-8'>
                                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                        Enterprise
                                    </h3>
                                    <div className='flex items-baseline gap-2 mb-6'>
                                        <span className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8c52ff] to-[#4785FF]'>
                                            Individuell
                                        </span>
                                    </div>
                                    <p className='text-gray-600 dark:text-white/70 mb-6'>
                                        Maßgeschneiderte Lösungen für
                                        Unternehmen und Teams
                                    </p>
                                </div>

                                <div className='space-y-4 mb-8 flex-grow'>
                                    {[
                                        'Alles aus Pro',
                                        'Individuelle Anpassungen',
                                        'API-Zugang',
                                        'Dedizierter Account Manager',
                                        'SLA-Garantie',
                                        'On-Premise Lösung möglich',
                                    ].map((feature, index) => (
                                        <div
                                            key={index}
                                            className='flex items-center gap-3'
                                        >
                                            <div className='w-5 h-5 rounded-full bg-gradient-to-br from-[#8c52ff] to-[#4785FF] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300'>
                                                <svg
                                                    className='w-3 h-3 text-white'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M5 13l4 4L19 7'
                                                    />
                                                </svg>
                                            </div>
                                            <span className='text-gray-600 dark:text-white/70'>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate('/kontakt')}
                                    className='w-full py-3 px-4 rounded-xl text-gray-700 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-300 font-medium'
                                >
                                    Kontaktiere uns
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='mt-16 text-center'>
                        <p className='text-gray-500 dark:text-white/60 mb-8'>
                            Alle Pläne beinhalten eine 14-tägige
                            Geld-zurück-Garantie
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section
                id='fifth-section'
                className='py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden'
            >
                {/* Animated Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
                </div>

                <div className='container mx-auto px-4 relative z-10'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Das Team hinter{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                TrackMyGoal
                            </span>
                        </h2>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Mit Leidenschaft und Expertise arbeiten wir daran,
                            deine Ziele Wirklichkeit werden zu lassen
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto'>
                        {[
                            {
                                name: 'Luke Schröter',
                                image: Luke,
                                role: 'Full Stack Developer',
                                skills: [
                                    'React',
                                    'UI/UX',
                                    'TailwindCSS',
                                    'Node.js',
                                    'MongoDB',
                                ],
                                social: {
                                    github: 'https://github.com/lulkebit',
                                    linkedin:
                                        'https://www.linkedin.com/in/luke-schr%C3%B6ter/',
                                },
                                gradient: 'from-[#4785FF] to-[#6769ff]',
                            },
                            {
                                name: 'Sönke Vogelsberg',
                                image: Sönke,
                                role: 'Quality Assurance Manager',
                                skills: [
                                    'Testmanagement',
                                    'Fehleranalyse',
                                    'Prozessoptimierung',
                                ],
                                social: {
                                    github: 'https://github.com/soenkevogelsberg',
                                    linkedin:
                                        'https://www.linkedin.com/in/soenkevogelsberg/',
                                },
                                gradient: 'from-[#6769ff] to-[#8c52ff]',
                            },
                            {
                                name: 'Jean-Luc Höfler',
                                image: JeanLuc,
                                role: 'Full Stack Developer',
                                skills: ['MongoDB', 'Node.js', 'React', 'Git'],
                                social: {
                                    github: 'https://github.com/Garf1x',
                                    linkedin:
                                        'https://www.linkedin.com/in/jean-luc-h%C3%B6fler-17713026b/',
                                },
                                gradient: 'from-[#8c52ff] to-[#4785FF]',
                            },
                            {
                                name: 'Arman Rashoyan',
                                image: Arman,
                                role: 'Marketing Manager',
                                skills: [
                                    'Marktanalyse',
                                    'Kampagnenmanagement',
                                    'Zielgruppenanalyse',
                                ],
                                social: {
                                    github: 'https://github.com/ArmanRashoyan',
                                    linkedin:
                                        'https://www.linkedin.com/in/arman-rashoyan-01ba8a264/',
                                },
                                gradient: 'from-[#4785FF] to-[#8c52ff]',
                            },
                        ].map((member, index) => (
                            <div
                                key={index}
                                className='group relative bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-lg dark:shadow-none'
                            >
                                <div className='relative h-[300px] overflow-hidden'>
                                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10 group-hover:opacity-90 transition-opacity duration-300'></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className='w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2'>
                                        <a
                                            href={member.social.github}
                                            className='bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors duration-200'
                                            title='GitHub'
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            <svg
                                                className='w-6 h-6 text-white'
                                                fill='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                                            </svg>
                                        </a>
                                        <a
                                            href={member.social.linkedin}
                                            className='bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-colors duration-200'
                                            title='LinkedIn'
                                            target='_blank'
                                            rel='noreferrer'
                                        >
                                            <svg
                                                className='w-6 h-6 text-white'
                                                fill='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className='p-6'>
                                    <div
                                        className={`inline-block bg-gradient-to-r ${member.gradient} text-white text-sm px-3 py-1 rounded-full mb-4`}
                                    >
                                        {member.role}
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                                        {member.name}
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {member.skills.map(
                                            (skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className='bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 px-3 py-1 rounded-full text-sm border border-gray-200 dark:border-white/10'
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mt-16 text-center'>
                        <p className='text-lg text-gray-600 dark:text-white/70 mb-8 max-w-2xl mx-auto'>
                            Interessiert daran, Teil unseres Teams zu werden?
                            Wir suchen immer nach talentierten Menschen, die
                            unsere Vision teilen.
                        </p>
                        <span className='cursor-not-allowed inline-flex items-center gap-2 text-gray-700 dark:text-white bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 group border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none'>
                            Aktuell keine offenen Stellen
                        </span>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section
                id='last-section'
                className='py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden'
            >
                {/* Animated Background Elements */}
                <div className='absolute inset-0'>
                    <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
                </div>

                <div className='container mx-auto px-4 relative z-10'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Häufig gestellte{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4785FF] to-[#8c52ff]'>
                                Fragen
                            </span>
                        </h2>
                        <p className='text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                            Hier findest du Antworten auf die wichtigsten
                            Fragen. Weitere Hilfe erhältst du in unserem
                            Support-Bereich.
                        </p>
                    </div>

                    <div className='max-w-3xl mx-auto'>
                        <div className='grid gap-6'>
                            {[
                                {
                                    question:
                                        'Wie kann ich meine Ziele erstellen und verwalten?',
                                    answer: 'Nach der Anmeldung kannst du im Dashboard ganz einfach neue Ziele erstellen. Definiere einen Titel, Zeitraum und Meilensteine. Du kannst deine Ziele jederzeit bearbeiten, den Fortschritt aktualisieren und Notizen hinzufügen.',
                                    icon: (
                                        <svg
                                            className='w-6 h-6'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                                            />
                                        </svg>
                                    ),
                                    gradient: 'from-[#4785FF] to-[#6769ff]',
                                },
                                {
                                    question:
                                        'Wie kann ich meine Ziele mit anderen teilen?',
                                    answer: 'In jedem Ziel findest du eine "Teilen"-Option. Dort kannst du Freunde per E-Mail einladen oder einen Teilungslink generieren. Du entscheidest, ob andere nur sehen oder auch kommentieren können.',
                                    icon: (
                                        <svg
                                            className='w-6 h-6'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
                                            />
                                        </svg>
                                    ),
                                    gradient: 'from-[#6769ff] to-[#8c52ff]',
                                },
                                {
                                    question:
                                        'Welche Tracking-Möglichkeiten gibt es?',
                                    answer: 'TrackMyGoal bietet verschiedene Tracking-Tools: Fortschrittsbalken, Statistiken, Diagramme und eine Timeline. Du kannst täglich oder wöchentlich Updates eintragen und siehst deinen Fortschritt visuell aufbereitet.',
                                    icon: (
                                        <svg
                                            className='w-6 h-6'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                                            />
                                        </svg>
                                    ),
                                    gradient: 'from-[#8c52ff] to-[#4785FF]',
                                },
                                {
                                    question: 'Wie sicher sind meine Daten?',
                                    answer: 'Deine Daten werden verschlüsselt gespeichert und nach höchsten Sicherheitsstandards geschützt. Wir verwenden moderne Technologien und regelmäßige Sicherheits-Updates, um deine Privatsphäre zu gewährleisten.',
                                    icon: (
                                        <svg
                                            className='w-6 h-6'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                            />
                                        </svg>
                                    ),
                                    gradient: 'from-[#4785FF] to-[#8c52ff]',
                                },
                            ].map((faq, index) => (
                                <details
                                    key={index}
                                    className='group bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 shadow-lg dark:shadow-none'
                                >
                                    <summary className='flex items-center gap-4 p-6 cursor-pointer marker:content-none'>
                                        <div
                                            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${faq.gradient} group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <div className='text-white'>
                                                {faq.icon}
                                            </div>
                                        </div>

                                        <div className='flex-grow'>
                                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#4785FF] group-hover:to-[#8c52ff] transition-colors duration-300'>
                                                {faq.question}
                                            </h3>
                                        </div>

                                        <div className='flex-shrink-0'>
                                            <svg
                                                className='w-6 h-6 text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/60 group-open:rotate-180 transition-all duration-300'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M19 9l-7 7-7-7'
                                                />
                                            </svg>
                                        </div>
                                    </summary>

                                    <div className='px-6 pb-6 pt-2'>
                                        <div className='pl-16'>
                                            <p className='text-gray-600 dark:text-white/70 leading-relaxed'>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>

                        {/* Support Section */}
                        <div className='mt-16 text-center'>
                            <div className='bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-8 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 shadow-lg dark:shadow-none'>
                                <p className='text-gray-600 dark:text-white/70 mb-6 text-lg'>
                                    Noch Fragen? Unser Support-Team ist für dich
                                    da.
                                </p>
                                <button
                                    onClick={() => navigate('/kontakt')}
                                    className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex items-center gap-2 mx-auto'
                                >
                                    <span>Kontaktiere unseren Support</span>
                                    <svg
                                        className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M14 5l7 7m0 0l-7 7m7-7H3'
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landingpage;
