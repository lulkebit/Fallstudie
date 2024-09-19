import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
    });

    const registerUser = async (event) => {
        event.preventDefault();
        const { firstname, lastname, email, username, password } = data;
        try {
            const { data } = await axios.post('/register', {
                firstname,
                lastname,
                email,
                username,
                password,
            });

            if (data.error) {
                return alert(data.error);
            } else {
                setData({});
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-blue-300 to-red-300 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md'>
                <h2 className='text-center text-3xl font-bold text-white'>
                    TrackMyGoal
                </h2>
                <form className='mt-8 space-y-6' onSubmit={registerUser}>
                    <div className='rounded-md shadow-sm -space-y-px'>
                        <div className='flex space-x-4 mb-4'>
                            <div className='w-1/2'>
                                <label htmlFor='firstname' className='sr-only'>
                                    Vorname
                                </label>
                                <input
                                    id='firstname'
                                    name='firstname'
                                    type='text'
                                    required
                                    className='appearance-none rounded-md relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                                    placeholder='Vorname'
                                    value={data.firstname}
                                    onChange={(event) => {
                                        setData({
                                            ...data,
                                            firstname: event.target.value,
                                        });
                                    }}
                                />
                            </div>
                            <div className='w-1/2'>
                                <label htmlFor='lastname' className='sr-only'>
                                    Nachname
                                </label>
                                <input
                                    id='lastname'
                                    name='lastname'
                                    type='text'
                                    required
                                    className='appearance-none rounded-md relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                                    placeholder='Nachname'
                                    value={data.lastname}
                                    onChange={(event) => {
                                        setData({
                                            ...data,
                                            lastname: event.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='email-address' className='sr-only'>
                                Email address
                            </label>
                            <input
                                id='email-address'
                                name='email'
                                type='email'
                                required
                                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                                placeholder='Email address'
                                value={data.email}
                                onChange={(event) => {
                                    setData({
                                        ...data,
                                        email: event.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='username' className='sr-only'>
                                Username
                            </label>
                            <input
                                id='username'
                                name='username'
                                type='text'
                                required
                                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                                placeholder='Username'
                                value={data.username}
                                onChange={(event) => {
                                    setData({
                                        ...data,
                                        username: event.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='password' className='sr-only'>
                                Password
                            </label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                required
                                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                                placeholder='Password'
                                value={data.password}
                                onChange={(event) => {
                                    setData({
                                        ...data,
                                        password: event.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type='submit'
                            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white from-red-300 to-blue-300 bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg'
                        >
                            Registrieren
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
