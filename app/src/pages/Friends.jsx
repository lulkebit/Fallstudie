import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPlus, UserCheck, UserX, Users, Globe, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog';
import FriendGoalsDialog from '../components/dialogs/FriendGoalsDialog';
import Loader from '../components/Loader';
import Waves from '../components/Waves';

const AddFriendSection = ({ username, setUsername, onSend }) => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-white p-6 rounded-xl shadow-lg'>
        <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                <UserPlus className='w-5 h-5 text-blue-600' />
            </div>
            <h2 className='text-lg font-bold text-gray-800'>
                Freund hinzufügen
            </h2>
        </div>
        <div className='flex gap-3'>
            <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Benutzername eingeben'
                className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         transition-all duration-200 outline-none'
            />
            <button
                onClick={onSend}
                className='px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium 
                         shadow-lg hover:bg-blue-700 transition-all duration-200 
                         hover:shadow-xl flex items-center gap-2 whitespace-nowrap'
            >
                <UserPlus className='w-5 h-5' />
                Anfrage senden
            </button>
        </div>
    </div>
);

const FriendRequestCard = ({ request, onAccept, onDecline }) => (
    <div className='bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200'>
        <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
                {request.userId?.avatar ? (
                    <img
                        src={`data:image/jpeg;base64,${request.userId.avatar}`}
                        alt={`${request.userId.firstname} ${request.userId.lastname}`}
                        className='w-10 h-10 rounded-lg object-cover'
                    />
                ) : (
                    <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center'>
                        <span className='text-blue-600 font-medium'>
                            {request.userId?.firstname?.[0] || '?'}
                        </span>
                    </div>
                )}
                <div>
                    <p className='font-medium text-gray-900'>
                        {request.userId?.username}
                    </p>
                    <p className='text-sm text-gray-500'>
                        {request.userId?.firstname} {request.userId?.lastname}
                    </p>
                </div>
            </div>
            <div className='flex gap-2'>
                <button
                    onClick={() => onAccept(request._id)}
                    className='px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium 
                             hover:bg-blue-100 transition-colors duration-200 flex items-center gap-1.5'
                >
                    <UserCheck className='w-4 h-4' />
                    Annehmen
                </button>
                <button
                    onClick={() => onDecline(request._id)}
                    className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium 
                             hover:bg-red-100 transition-colors duration-200 flex items-center gap-1.5'
                >
                    <UserX className='w-4 h-4' />
                    Ablehnen
                </button>
            </div>
        </div>
    </div>
);

const FriendCard = ({ friend, onShowGoals, onDelete }) => (
    <div className='bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200'>
        <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
                {friend.friendId?.avatar ? (
                    <img
                        src={`data:image/jpeg;base64,${friend.friendId.avatar}`}
                        alt={`${friend.friendId.firstname} ${friend.friendId.lastname}`}
                        className='w-10 h-10 rounded-lg object-cover'
                    />
                ) : (
                    <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center'>
                        <span className='text-blue-600 font-medium'>
                            {friend.friendId?.firstname?.[0] || '?'}
                        </span>
                    </div>
                )}
                <div>
                    <p className='font-medium text-gray-900'>
                        {friend.friendId?.username}
                    </p>
                    <p className='text-sm text-gray-500'>
                        {friend.friendId?.firstname} {friend.friendId?.lastname}
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Freund seit:{' '}
                        {new Date(friend.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className='flex gap-2'>
                <button
                    onClick={() => onShowGoals(friend.friendId._id)}
                    className='px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium 
                             hover:bg-blue-100 transition-colors duration-200 flex items-center gap-1.5'
                >
                    <Globe className='w-4 h-4' />
                    Öffentliche Ziele
                </button>
                <button
                    onClick={() => onDelete(friend.friendId._id)}
                    className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium 
                             hover:bg-red-100 transition-colors duration-200 flex items-center gap-1.5'
                >
                    <UserX className='w-4 h-4' />
                    Entfernen
                </button>
            </div>
        </div>
    </div>
);

const SectionContainer = ({ title, icon: Icon, children }) => (
    <div className='bg-white rounded-xl shadow-lg'>
        <div className='p-4 border-b border-gray-100'>
            <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center'>
                    <Icon className='w-4 h-4 text-blue-600' />
                </div>
                <h2 className='text-lg font-bold text-gray-800'>{title}</h2>
            </div>
        </div>
        <div className='p-4'>{children}</div>
    </div>
);

const EmptyState = ({ icon: Icon, message }) => (
    <div className='text-center py-8'>
        <Icon className='w-12 h-12 text-gray-400 mx-auto mb-3' />
        <p className='text-gray-500'>{message}</p>
    </div>
);

const Friends = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const { addDialog } = useDialog();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            fetchFriends();
            fetchFriendRequests();
        }
    }, [user]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`/friends/${user._id}`);
            setFriends(response.data);
        } catch (error) {
            addToast('Error fetching friends', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`/friends/requests/${user._id}`);
            setFriendRequests(response.data);
        } catch (error) {
            addToast('Error fetching friend requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendFriendRequest = async () => {
        try {
            await axios.post('/friends/send', {
                userId: user._id,
                friendUsername: newFriendUsername,
            });
            fetchFriendRequests();
            addToast('Freundschaftsanfrage gesendet.', 'success');
        } catch (error) {
            addToast('Error: ' + error, 'error');
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            await axios.put(`/friends/accept/${requestId}`);
            fetchFriends();
            fetchFriendRequests();
            addToast('Freundschaftsanfrage akzeptiert.', 'success');
        } catch (error) {
            addToast('Error accepting friend request', 'error');
        }
    };

    const declineFriendRequest = async (requestId) => {
        try {
            await axios.put(`/friends/decline/${requestId}`);
            fetchFriendRequests();
            addToast('Freundschaftsanfrage abgelehnt.', 'info');
        } catch (error) {
            addToast('Error declining friend request', 'error');
        }
    };

    const deleteFriend = async (friendId) => {
        try {
            await axios.delete(`/friends/${user._id}/${friendId}`);
            fetchFriends();
            addToast('Freund entfernt.', 'info');
        } catch (error) {
            addToast('Error deleting friend', 'error');
        }
    };

    const handleDeleteClick = (friendId) => {
        addDialog({
            component: ConfirmationDialog,
            props: {
                message: 'Möchten Sie diesen Freund wirklich entfernen?',
                onConfirm: () => deleteFriend(friendId),
            },
        });
    };

    const handleShowGoalsClick = (friendId) => {
        setSelectedFriendId(friendId);
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
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 pt-16'>
                <Waves />
                <div className='container mx-auto px-4 py-8 relative z-10'>
                    <h1 className='text-4xl font-bold mb-8 text-center text-gray-800'>
                        Freunde
                    </h1>

                    <div className='space-y-6'>
                        <AddFriendSection
                            username={newFriendUsername}
                            setUsername={setNewFriendUsername}
                            onSend={sendFriendRequest}
                        />

                        <div className='grid lg:grid-cols-2 gap-6'>
                            <SectionContainer
                                title='Freundschaftsanfragen'
                                icon={Users}
                            >
                                {loading ? (
                                    <div className='flex items-center justify-center py-8'>
                                        <Loader />
                                    </div>
                                ) : friendRequests.length === 0 ? (
                                    <EmptyState
                                        icon={Users}
                                        message='Keine offenen Anfragen'
                                    />
                                ) : (
                                    <div className='space-y-3'>
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
                            </SectionContainer>

                            <SectionContainer
                                title='Meine Freunde'
                                icon={Users}
                            >
                                {loading ? (
                                    <div className='flex items-center justify-center py-8'>
                                        <Loader />
                                    </div>
                                ) : friends.length === 0 ? (
                                    <EmptyState
                                        icon={Users}
                                        message='Du hast noch keine Freunde hinzugefügt'
                                    />
                                ) : (
                                    <>
                                        <div className='relative mb-4'>
                                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                                            <input
                                                type='text'
                                                placeholder='Freunde durchsuchen...'
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                                         transition-all duration-200 outline-none'
                                            />
                                        </div>
                                        <div className='space-y-3'>
                                            {filteredFriends.map((friend) => (
                                                <FriendCard
                                                    key={friend._id}
                                                    friend={friend}
                                                    onShowGoals={() =>
                                                        handleShowGoalsClick(
                                                            friend.friendId._id
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        handleDeleteClick(
                                                            friend.friendId._id
                                                        )
                                                    }
                                                />
                                            ))}
                                            {filteredFriends.length === 0 && (
                                                <EmptyState
                                                    icon={Search}
                                                    message='Keine Freunde gefunden'
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            </SectionContainer>
                        </div>
                    </div>
                </div>

                {selectedFriendId && (
                    <FriendGoalsDialog
                        friendId={selectedFriendId}
                        onClose={() => setSelectedFriendId(null)}
                    />
                )}
            </div>
        </>
    );
};

export default Friends;
