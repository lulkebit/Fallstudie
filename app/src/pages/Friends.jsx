import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPlus, Users, Search, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog';
import FriendGoalsDialog from '../components/dialogs/FriendGoalsDialog';
import { FriendCard, FriendRequestCard } from '../components/FriendRequestCard';

const FriendsMetric = ({ title, value, icon: Icon }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
        <div className='flex items-center gap-4'>
            <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center flex-shrink-0'>
                <Icon className='h-6 w-6 text-white' />
            </div>
            <div>
                <h3 className='text-sm text-gray-500 dark:text-white/60'>
                    {title}
                </h3>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {value}
                </div>
            </div>
        </div>
    </div>
);

const Friends = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const { addDialog, removeDialog } = useDialog();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [user]);

    const fetchFriends = async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            const response = await axios.get(`/friends/${user._id}`);
            const friendsWithGoalCount = await Promise.all(
                response.data.map(async (friend) => {
                    try {
                        const goalsResponse = await axios.get(
                            `/goals/friend/${friend.friendId._id}`
                        );

                        return {
                            ...friend,
                            sharedGoals: goalsResponse.data,
                        };
                    } catch (error) {
                        addToast(
                            'Fehler beim Laden der Ziele für ' +
                                friend.friendId.username,
                            'error'
                        );
                        return {
                            ...friend,
                            sharedGoals: 0,
                        };
                    }
                })
            );
            setFriends(friendsWithGoalCount);
        } catch (error) {
            addToast(
                'Fehler beim Laden der Freunde: ' + error.message,
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendRequests = async () => {
        if (!user?._id) return;

        try {
            const response = await axios.get(`/friends/requests/${user._id}`);
            setFriendRequests(response.data);
        } catch (error) {
            addToast(
                'Fehler beim Laden der Anfragen: ' + error.message,
                'error'
            );
        }
    };

    const sendFriendRequest = async () => {
        if (!newFriendUsername.trim()) {
            addToast('Bitte geben Sie einen Benutzernamen ein', 'error');
            return;
        }

        try {
            await axios.post('/friends/send', {
                userId: user._id,
                friendUsername: newFriendUsername,
            });
            setNewFriendUsername('');
            fetchFriendRequests();
            addToast('Freundschaftsanfrage gesendet', 'success');
        } catch (error) {
            addToast(
                error.response?.data?.message ||
                    'Fehler beim Senden der Anfrage',
                'error'
            );
        }
    };

    const handleShowGoalsClick = async (friendId, friend) => {
        addDialog({
            component: FriendGoalsDialog,
            props: {
                friendId: friendId,
                friend: friend,
                onClose: removeDialog,
            },
        });
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            await axios.put(`/friends/accept/${requestId}`);
            await fetchFriends();
            await fetchFriendRequests();
            addToast('Freundschaftsanfrage akzeptiert', 'success');
        } catch (error) {
            addToast(
                'Fehler beim Akzeptieren der Anfrage: ' + error.message,
                'error'
            );
        }
    };

    const declineFriendRequest = async (requestId) => {
        try {
            await axios.put(`/friends/decline/${requestId}`);
            await fetchFriendRequests();
            addToast('Freundschaftsanfrage abgelehnt', 'info');
        } catch (error) {
            addToast(
                'Fehler beim Ablehnen der Anfrage: ' + error.message,
                'error'
            );
        }
    };

    const handleDeleteClick = (friendId) => {
        addDialog({
            component: ConfirmationDialog,
            props: {
                title: 'Freund löschen',
                message: 'Möchtest du diesen Freund wirklich löschen?',
                variant: 'danger',
                confirmText: 'Entfernen',
                onConfirm: async () => {
                    try {
                        await axios.delete(`/friends/${user._id}/${friendId}`);
                        await fetchFriends();
                        removeDialog();
                        addToast('Freund erfolgreich gelöscht!', 'success');
                    } catch (error) {
                        addToast(
                            'Fehler beim Löschen: ' + error.message,
                            'error'
                        );
                    }
                },
                onClose: removeDialog,
            },
        });
    };

    const filteredFriends = friends.filter(
        (friend) =>
            friend.friendId?.username
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            friend.friendId?.firstname
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            friend.friendId?.lastname
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <Navbar />

            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='container mx-auto px-4 py-8 relative z-10 pt-24'>
                {/* Hero Section */}
                <div className='text-center mb-12'>
                    <div className='flex items-center justify-center gap-2 mb-6'>
                        <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                            <Users className='h-6 w-6 text-white' />
                        </div>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                            Community
                        </h1>
                    </div>
                    <p className='text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                        Verbinde dich mit Gleichgesinnten und erreiche gemeinsam
                        eure Ziele
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
                    <FriendsMetric
                        title='Freunde'
                        value={friends.length}
                        icon={Users}
                    />
                    <FriendsMetric
                        title='Anfragen'
                        value={friendRequests.length}
                        icon={UserPlus}
                    />
                    <FriendsMetric
                        title='Geteilte Ziele'
                        value={friends.reduce(
                            (acc, friend) =>
                                acc + (friend.sharedGoals.length || 0),
                            0
                        )}
                        icon={Target}
                    />
                </div>

                {/* Add Friend Section */}
                <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-8 mb-8'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                                Freund hinzufügen
                            </h2>
                            <p className='text-gray-600 dark:text-white/70'>
                                Verbinde dich mit anderen TrackMyGoal Nutzern
                            </p>
                        </div>
                        <div className='flex gap-4 w-full md:w-auto'>
                            <input
                                type='text'
                                value={newFriendUsername}
                                onChange={(e) =>
                                    setNewFriendUsername(e.target.value)
                                }
                                placeholder='Benutzername eingeben'
                                className='flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                              border border-gray-200 dark:border-white/10 
                              focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                              transition-all duration-200 outline-none
                              text-gray-900 dark:text-white
                              placeholder:text-gray-400 dark:placeholder:text-white/40'
                            />
                            <button
                                onClick={sendFriendRequest}
                                className='px-6 py-2.5 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                            text-white rounded-xl font-medium shadow-lg 
                            hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                            transition-all duration-200 hover:-translate-y-0.5
                            flex items-center gap-2 whitespace-nowrap'
                            >
                                <UserPlus className='w-5 h-5' />
                                Hinzufügen
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='grid lg:grid-cols-2 gap-8'>
                    {/* Friend Requests */}
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10'>
                        <div className='p-6 border-b border-gray-200 dark:border-white/10'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                        <UserPlus className='w-5 h-5 text-white' />
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Anfragen
                                    </h2>
                                </div>
                                <span className='px-3 py-1 rounded-full text-sm font-medium bg-[#4785FF]/10 dark:bg-[#4785FF]/20 text-[#4785FF]'>
                                    {friendRequests.length} neu
                                </span>
                            </div>
                        </div>

                        <div className='p-6'>
                            {loading ? (
                                <div className='flex items-center justify-center py-12'>
                                    <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
                                </div>
                            ) : friendRequests.length === 0 ? (
                                <div className='text-center py-12'>
                                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
                                        <Users className='w-8 h-8 text-white' />
                                    </div>
                                    <p className='text-gray-500 dark:text-white/60'>
                                        Keine offenen Anfragen
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    {friendRequests.map((request) => (
                                        <FriendRequestCard
                                            key={request._id}
                                            request={request}
                                            onAccept={acceptFriendRequest}
                                            onDecline={declineFriendRequest}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Friends List */}
                    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10'>
                        <div className='p-6 border-b border-gray-200 dark:border-white/10'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                                        <Users className='w-5 h-5 text-white' />
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                                        Meine Freunde
                                    </h2>
                                </div>
                            </div>

                            <div className='mt-4 relative'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 w-4 h-4' />
                                <input
                                    type='text'
                                    placeholder='Freunde durchsuchen...'
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                                    border border-gray-200 dark:border-white/10
                                    focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 
                                    transition-all duration-200 outline-none
                                    text-gray-900 dark:text-white
                                    placeholder:text-gray-400 dark:placeholder:text-white/40'
                                />
                            </div>
                        </div>

                        <div className='p-6'>
                            {loading ? (
                                <div className='flex items-center justify-center py-12'>
                                    <div className='w-10 h-10 border-4 border-[#4785FF] border-t-transparent rounded-full animate-spin' />
                                </div>
                            ) : friends.length === 0 ? (
                                <div className='text-center py-12'>
                                    <div className='w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center opacity-50'>
                                        <Users className='w-8 h-8 text-white' />
                                    </div>
                                    <p className='text-gray-500 dark:text-white/60'>
                                        Noch keine Freunde hinzugefügt
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    {filteredFriends.map((friend) => (
                                        <FriendCard
                                            key={friend._id}
                                            friend={friend}
                                            onShowGoals={() =>
                                                handleShowGoalsClick(
                                                    friend.friendId._id,
                                                    friend.friendId
                                                )
                                            }
                                            onDelete={() =>
                                                handleDeleteClick(
                                                    friend.friendId._id
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Friends;
