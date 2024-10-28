import React from 'react';
import {
    UserCheck,
    UserX,
    Globe,
    ChevronRight,
    Calendar,
    Star,
} from 'lucide-react';

const FriendRequestCard = ({ request, onAccept, onDecline }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-start gap-4'>
                {/* Avatar/Initial */}
                {request.userId?.avatar ? (
                    <img
                        src={`data:image/jpeg;base64,${request.userId.avatar}`}
                        alt={`${request.userId.firstname} ${request.userId.lastname}`}
                        className='w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-gray-800 flex-shrink-0'
                    />
                ) : (
                    <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center text-white text-lg font-medium border-2 border-white dark:border-gray-800 flex-shrink-0'>
                        {request.userId?.firstname?.[0] || '?'}
                    </div>
                )}

                {/* User Info */}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                            {request.userId?.username}
                        </h3>
                        <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-[#4785FF]/10 dark:bg-[#4785FF]/20 text-[#4785FF] flex-shrink-0'>
                            Neu
                        </span>
                    </div>
                    <div className='flex items-center gap-2 mt-1'>
                        <span className='text-sm text-gray-500 dark:text-white/60 truncate'>
                            {request.userId?.firstname}{' '}
                            {request.userId?.lastname}
                        </span>
                        <span className='text-gray-300 dark:text-white/20'>
                            •
                        </span>
                        <span className='text-sm text-gray-500 dark:text-white/60 flex items-center gap-1 flex-shrink-0'>
                            <Calendar className='w-3 h-3' />
                            {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 w-full sm:w-auto flex-shrink-0'>
                <button
                    onClick={() => onAccept(request._id)}
                    className='flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                   text-white rounded-xl font-medium shadow-lg 
                   hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                   transition-all duration-200 hover:-translate-y-0.5
                   flex items-center justify-center gap-2 whitespace-nowrap'
                >
                    <UserCheck className='w-4 h-4' />
                    <span>Annehmen</span>
                </button>
                <button
                    onClick={() => onDecline(request._id)}
                    className='flex-1 sm:flex-none px-4 py-2.5 text-red-600 dark:text-red-500 rounded-xl font-medium
                   bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20
                   transition-all duration-200 hover:-translate-y-0.5
                   flex items-center justify-center gap-2 whitespace-nowrap'
                >
                    <UserX className='w-4 h-4' />
                    <span>Ablehnen</span>
                </button>
            </div>
        </div>
    </div>
);

const FriendCard = ({ friend, onShowGoals, onDelete }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
        <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4 min-w-0'>
                {/* Avatar/Initial */}
                {friend.friendId?.avatar ? (
                    <img
                        src={`data:image/jpeg;base64,${friend.friendId.avatar}`}
                        alt={`${friend.friendId.firstname} ${friend.friendId.lastname}`}
                        className='w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-gray-800 flex-shrink-0'
                    />
                ) : (
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center text-white text-lg font-medium border-2 border-white dark:border-gray-800 flex-shrink-0'>
                        {friend.friendId?.firstname?.[0] || '?'}
                    </div>
                )}

                {/* User Info */}
                <div className='flex items-center gap-3 min-w-0'>
                    <div className='flex items-center gap-2 min-w-0'>
                        <h3 className='text-base font-semibold text-gray-900 dark:text-white truncate'>
                            {friend.friendId?.username}
                        </h3>
                    </div>

                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-white/60'>
                            <Star className='w-3 h-3' />
                            <span className='whitespace-nowrap'>
                                {friend.sharedGoals || 0} Ziele
                            </span>
                        </div>
                        <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-white/60'>
                            <Calendar className='w-3 h-3' />
                            <span className='whitespace-nowrap'>
                                seit{' '}
                                {new Date(
                                    friend.createdAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 flex-shrink-0'>
                <button
                    onClick={() => onShowGoals(friend.friendId._id)}
                    className='px-4 py-2 bg-gradient-to-r from-[#4785FF] to-[#8c52ff] 
                   text-white rounded-xl font-medium shadow-lg 
                   hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10
                   transition-all duration-200 hover:-translate-y-0.5
                   flex items-center justify-center gap-2 whitespace-nowrap'
                >
                    <Globe className='w-4 h-4' />
                    <span>Ziele ansehen</span>
                    <ChevronRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
                </button>
                <button
                    onClick={() => onDelete(friend.friendId._id)}
                    className='px-4 py-2 text-red-600 dark:text-red-500 rounded-xl font-medium
                   bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20
                   transition-all duration-200 hover:-translate-y-0.5
                   flex items-center justify-center gap-2 whitespace-nowrap'
                >
                    <UserX className='w-4 h-4' />
                    <span>Entfernen</span>
                </button>
            </div>
        </div>
    </div>
);

export { FriendRequestCard, FriendCard };
