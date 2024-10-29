import React, {
    useState,
    useContext,
    useCallback,
    useMemo,
    useEffect,
} from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import {
    Users,
    Search,
    Filter,
    Calendar,
    Activity,
    Target,
    Clock,
    ChevronDown,
} from 'lucide-react';

const EmptyState = () => (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
        <div className='bg-gradient-to-r from-[#4785FF] to-[#8c52ff] w-16 h-16 rounded-xl flex items-center justify-center mb-4'>
            <Users className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2 text-center'>
            Keine öffentlichen Ziele gefunden
        </h3>
        <p className='text-gray-500 dark:text-white/60 text-center max-w-sm'>
            Deine Freunde haben noch keine Ziele geteilt. Sobald sie Ziele
            teilen, werden sie hier erscheinen.
        </p>
    </div>
);

const GoalCard = ({ goal }) => {
    const progress =
        goal.progress || (goal.currentValue / goal.targetValue) * 100;
    const formattedProgress = Math.round(Math.min(Math.max(progress, 0), 100));

    const remainingDays = useMemo(() => {
        const now = new Date();
        const end = new Date(goal.endDate);
        const timeDiff = end - now;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }, [goal.endDate]);

    return (
        <div
            className='bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 
                     hover:border-white/40 transition-all duration-200 hover:shadow-md'
        >
            <div className='p-4'>
                {/* Header with Friend Info */}
                <div className='flex items-center gap-3 mb-3'>
                    <img
                        src={
                            goal?.friendAvatar
                                ? `data:image/jpeg;base64,${goal.friendAvatar}`
                                : 'https://api.dicebear.com/6.x/initials/svg?seed=JD'
                        }
                        alt='Profile'
                        className='h-8 w-8 rounded-lg object-cover'
                    />
                    <div>
                        <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                            {goal.friendName || 'Anonym'}
                        </h4>
                        <p className='text-xs text-gray-500 dark:text-white/60'>
                            Ziel erstellt am{' '}
                            {new Date(goal.startDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Goal Title & Category */}
                <div className='mb-3'>
                    <h3 className='text-base font-medium text-gray-900 dark:text-white mb-2'>
                        {goal.title}
                    </h3>
                    <span
                        className='px-3 py-1 text-xs font-medium rounded-full 
                                 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white'
                    >
                        {goal.category}
                    </span>
                </div>

                {/* Description */}
                <div className='mb-4'>
                    <p className='text-sm text-gray-600 dark:text-white/80'>
                        {goal.description}
                    </p>
                </div>

                {/* Progress Section */}
                <div className='mb-4'>
                    <div className='flex justify-between items-center mb-1'>
                        <span className='text-sm text-gray-600 dark:text-white/80'>
                            Fortschritt
                        </span>
                        <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            {formattedProgress}%
                        </span>
                    </div>
                    <div className='relative h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden'>
                        <div
                            className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                                     transition-all duration-300'
                            style={{ width: `${formattedProgress}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {remainingDays} Tage übrig
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Activity className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {goal.participationCount || 0} Teilnehmer
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Target className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {goal.currentValue}/{goal.targetValue} {goal.unit}
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Clock className='w-4 h-4 text-gray-400 dark:text-white/40' />
                        <span className='text-xs text-gray-600 dark:text-white/80'>
                            {new Date(goal.startDate).toLocaleDateString()} -{' '}
                            {new Date(goal.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PublicGoalTable = ({ onGoalsUpdate }) => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const [publicGoals, setPublicGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchPublicGoals = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await axios.get(`/goals/friends/${user._id}`);
            setPublicGoals(response.data);
            if (onGoalsUpdate) onGoalsUpdate();
        } catch (error) {
            addToast('Fehler beim Laden der Ziele: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [user, onGoalsUpdate, addToast]);

    useEffect(() => {
        fetchPublicGoals();
    }, [fetchPublicGoals]);

    const categories = useMemo(() => {
        return [...new Set(publicGoals.map((goal) => goal.category))];
    }, [publicGoals]);

    const filteredGoals = useMemo(() => {
        return publicGoals
            .filter((goal) => {
                const matchesSearch =
                    goal.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    goal.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    goal.friendName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase());
                const matchesCategory =
                    !selectedCategory || goal.category === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }, [publicGoals, searchTerm, selectedCategory]);

    if (loading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
            </div>
        );
    }

    if (!publicGoals.length) {
        return <EmptyState />;
    }

    return (
        <div className='space-y-6'>
            {/* Enhanced Filter Section */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1 relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500' />
                    <input
                        type='text'
                        placeholder='Suche nach Zielen oder Freunden...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 
                                 rounded-xl border-none focus:ring-2 focus:ring-[#4785FF] 
                                 transition-all duration-200 text-gray-900 dark:text-white 
                                 placeholder-gray-500 dark:placeholder-gray-400'
                    />
                </div>
                <div className='relative min-w-[180px]'>
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none'>
                        <Filter className='w-4 h-4 text-gray-400 dark:text-gray-500' />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className='w-full appearance-none pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 
                                 rounded-xl border-none focus:ring-2 focus:ring-[#4785FF] cursor-pointer
                                 transition-all duration-200 text-gray-900 dark:text-white'
                    >
                        <option value=''>Alle Kategorien</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                                          text-gray-400 dark:text-gray-500 pointer-events-none'
                    />
                </div>
            </div>

            {/* Goals Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredGoals.map((goal) => (
                    <GoalCard key={`${goal.friendId}-${goal.id}`} goal={goal} />
                ))}
            </div>
        </div>
    );
};

export default PublicGoalTable;
