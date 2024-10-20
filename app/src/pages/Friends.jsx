import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPlus, UserCheck, UserX, Users, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ConfirmationDialog from '../components/dialogs/ConfirmationDialog';
import FriendGoalsDialog from '../components/dialogs/FriendGoalsDialog';
import Loader from '../components/Loader';
import Waves from '../components/Waves';

const Friends = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const { addDialog } = useDialog();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFriendId, setSelectedFriendId] = useState(null);

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

    return (
        <>
            <Navbar />
            <div className='bg-gray-100 min-h-screen pt-24'>
                <Waves />
                <div className='container mx-auto px-4 relative z-10'>
                    <h1 className='text-3xl font-bold mb-8 text-center text-blue-600'>
                        Freunde
                    </h1>

                    <div className='bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-8'>
                        <h2 className='text-xl sm:text-2xl font-semibold mb-4 flex items-center'>
                            <UserPlus className='mr-2' />
                            Freund hinzufügen
                        </h2>
                        <div className='flex flex-col sm:flex-row'>
                            <input
                                type='text'
                                value={newFriendUsername}
                                onChange={(e) =>
                                    setNewFriendUsername(e.target.value)
                                }
                                placeholder='Freund Username'
                                className='flex-grow px-4 py-2 border rounded-md sm:rounded-l-md sm:rounded-r-none mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <button
                                onClick={sendFriendRequest}
                                className='bg-blue-500 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-blue-600 transition duration-300 flex items-center justify-center'
                            >
                                <UserPlus size={18} className='mr-2' />
                                Anfrage senden
                            </button>
                        </div>
                    </div>

                    <div className='grid gap-8 md:grid-cols-2'>
                        <div className='bg-white shadow-lg rounded-lg p-4 sm:p-6'>
                            <h2 className='text-xl sm:text-2xl font-semibold mb-4 flex items-center'>
                                <Users className='mr-2' />
                                Freundschaftsanfragen
                            </h2>
                            {loading ? (
                                <div className='flex items-center justify-center py-4'>
                                    <Loader />
                                </div>
                            ) : friendRequests.length === 0 ? (
                                <p className='text-gray-500'>
                                    Keine offenen Anfragen.
                                </p>
                            ) : (
                                <ul className='space-y-4'>
                                    {friendRequests.map((request) => (
                                        <li
                                            key={request._id}
                                            className='flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg shadow transition duration-300 hover:shadow-md'
                                        >
                                            <div className='flex items-center space-x-4 mb-2 sm:mb-0'>
                                                {request.userId &&
                                                request.userId.avatar ? (
                                                    <img
                                                        src={`data:image/jpeg;base64,${request.userId.avatar}`}
                                                        alt={`${request.userId.firstname} ${request.userId.lastname}`}
                                                        className='h-10 w-10 rounded-full'
                                                    />
                                                ) : (
                                                    <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                                                        <span className='text-gray-600 font-bold'>
                                                            {request.userId &&
                                                            request.userId
                                                                .firstname
                                                                ? request.userId
                                                                      .firstname[0]
                                                                : '?'}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className='font-medium text-gray-700'>
                                                    {request.userId
                                                        ? request.userId
                                                              .username
                                                        : 'Unknown User'}
                                                </span>
                                            </div>
                                            <div className='flex space-x-2'>
                                                <button
                                                    onClick={() =>
                                                        acceptFriendRequest(
                                                            request._id
                                                        )
                                                    }
                                                    className='bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center'
                                                >
                                                    <UserCheck
                                                        size={16}
                                                        className='mr-2'
                                                    />
                                                    Annehmen
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        declineFriendRequest(
                                                            request._id
                                                        )
                                                    }
                                                    className='bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center'
                                                >
                                                    <UserX
                                                        size={16}
                                                        className='mr-2'
                                                    />
                                                    Ablehnen
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className='bg-white shadow-lg rounded-lg p-4 sm:p-6'>
                            <h2 className='text-xl sm:text-2xl font-semibold mb-6 flex items-center'>
                                <Users className='mr-2' />
                                Meine Freunde
                            </h2>
                            {loading ? (
                                <div className='flex items-center justify-center py-4'>
                                    <Loader />
                                </div>
                            ) : friends.length === 0 ? (
                                <p className='text-gray-500'>
                                    Du hast noch keine Freunde hinzugefügt.
                                </p>
                            ) : (
                                <ul className='space-y-4'>
                                    {friends.map((friend) => (
                                        <li
                                            key={friend._id}
                                            className='bg-gray-50 p-4 rounded-lg shadow transition duration-300 hover:shadow-md'
                                        >
                                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between'>
                                                <div className='flex items-center space-x-4 mb-4 sm:mb-0'>
                                                    {friend.friendId &&
                                                    friend.friendId.avatar ? (
                                                        <img
                                                            src={`data:image/jpeg;base64,${friend.friendId.avatar}`}
                                                            alt={`${friend.friendId.firstname} ${friend.friendId.lastname}`}
                                                            className='h-12 w-12 rounded-full'
                                                        />
                                                    ) : (
                                                        <div className='h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center'>
                                                            <span className='text-gray-600 font-bold'>
                                                                {friend.friendId &&
                                                                friend.friendId
                                                                    .firstname
                                                                    ? friend
                                                                          .friendId
                                                                          .firstname[0]
                                                                    : '?'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className='font-medium text-gray-700 block'>
                                                            {friend.friendId
                                                                ? friend
                                                                      .friendId
                                                                      .username
                                                                : 'Unknown User'}
                                                        </span>
                                                        <p className='text-sm text-gray-500'>
                                                            {friend.friendId
                                                                ? `${friend.friendId.firstname} ${friend.friendId.lastname}`
                                                                : 'N/A'}
                                                        </p>
                                                        <p className='text-xs text-gray-400'>
                                                            Freund seit:{' '}
                                                            {new Date(
                                                                friend.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='flex flex-wrap gap-2 w-full sm:w-auto'>
                                                    <button
                                                        onClick={() =>
                                                            handleShowGoalsClick(
                                                                friend.friendId
                                                                    ._id
                                                            )
                                                        }
                                                        className='bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition duration-300 flex items-center justify-center flex-1 sm:flex-none'
                                                    >
                                                        <Globe
                                                            size={14}
                                                            className='mr-1'
                                                        />
                                                        Öffentliche Ziele
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                friend.friendId
                                                                    ._id
                                                            )
                                                        }
                                                        className='bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition duration-300 flex items-center justify-center flex-1 sm:flex-none'
                                                    >
                                                        <UserX
                                                            size={14}
                                                            className='mr-1'
                                                        />
                                                        Entfernen
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
