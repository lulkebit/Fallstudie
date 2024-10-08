import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserPlus, UserCheck, UserX } from 'lucide-react';
import Navbar from '../components/navbar';
import { UserContext } from '../context/userContext';
import { useToast } from '../context/toastContext';
import { useDialog } from '../context/dialogContext';
import ConfirmationDialog from '../components/dialogs/confirmationDialog';

const Friends = () => {
    const { user } = useContext(UserContext);
    const { addToast } = useToast();
    const { addDialog } = useDialog();
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [newFriendUsername, setNewFriendUsername] = useState('');

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
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`/friends/requests/${user._id}`);
            setFriendRequests(response.data);
        } catch (error) {
            addToast('Error fetching friend requests', 'error');
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

    return (
        <div>
            <Navbar />
            <div className='container mx-auto px-4 py-8'>
                <h1 className='text-3xl font-bold mb-8 text-center text-blue-600'>
                    Freunde
                </h1>

                <div className='bg-white shadow-md rounded-lg p-6 mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>
                        Freundschaftsanfrage senden
                    </h2>
                    <div className='flex'>
                        <input
                            type='text'
                            value={newFriendUsername}
                            onChange={(e) =>
                                setNewFriendUsername(e.target.value)
                            }
                            placeholder='Freund Username'
                            className='flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button
                            onClick={sendFriendRequest}
                            className='bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300 flex items-center'
                        >
                            <UserPlus size={18} className='mr-2' />
                            Anfrage senden
                        </button>
                    </div>
                </div>

                <div className='grid md:grid-cols-2 gap-8'>
                    <div className='bg-white shadow-md rounded-lg p-6'>
                        <h2 className='text-xl font-semibold mb-4'>
                            Freundschaftsanfragen
                        </h2>
                        {friendRequests.length === 0 ? (
                            <p className='text-gray-500'>
                                Keine offenen Anfragen.
                            </p>
                        ) : (
                            <ul className='space-y-4'>
                                {friendRequests.map((request) => (
                                    <li
                                        key={request._id}
                                        className='flex items-center justify-between bg-gray-50 p-3 rounded-md'
                                    >
                                        <span>{request.userId.username}</span>
                                        <div className='space-x-2'>
                                            <button
                                                onClick={() =>
                                                    acceptFriendRequest(
                                                        request._id
                                                    )
                                                }
                                                className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300 flex items-center'
                                            >
                                                <UserCheck
                                                    size={16}
                                                    className='mr-1'
                                                />
                                                Annehmen
                                            </button>
                                            <button
                                                onClick={() =>
                                                    declineFriendRequest(
                                                        request._id
                                                    )
                                                }
                                                className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 flex items-center'
                                            >
                                                <UserX
                                                    size={16}
                                                    className='mr-1'
                                                />
                                                Ablehnen
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='bg-white shadow-md rounded-lg p-6'>
                        <h2 className='text-xl font-semibold mb-4'>
                            Freundesliste
                        </h2>
                        {friends.length === 0 ? (
                            <p className='text-gray-500'>
                                Du hast noch keine Freunde hinzugefügt.
                            </p>
                        ) : (
                            <ul className='space-y-2'>
                                {friends.map((friend) => (
                                    <li
                                        key={friend._id}
                                        className='flex items-center justify-between bg-gray-50 p-3 rounded-md'
                                    >
                                        <span>{friend.friendId.username}</span>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(
                                                    friend.friendId._id
                                                )
                                            }
                                            className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 flex items-center'
                                        >
                                            Entfernen
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Friends;
