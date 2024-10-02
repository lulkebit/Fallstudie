import { useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const loginUser = async (event) => {
        event.preventDefault();
        const { email, password } = data;
        try {
            const { data } = await axios.post('/login', {
                email,
                password,
            });

            if (data.error) {
                return alert(data.error);
            } else {
                setUser(data.user);
                setData({});
                navigate('/dashboard');
                window.location.reload();
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-6 bg-gradient-to-r from-blue-300 to-red-300 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-md'>
                <h2 className='text-center text-3xl font-bold text-white'>
                    TrackMyGoal
                </h2>
                <form className='mt-8 space-y-6' onSubmit={loginUser}>
                    <div className='rounded-md shadow-sm -space-y-px'>
                        <div>
                            <label htmlFor='email-address' className='sr-only'>
                                Email address
                            </label>
                            <input
                                id='email-address'
                                name='email'
                                type='email'
                                required
                                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
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
                        <div>
                            <label htmlFor='password' className='sr-only'>
                                Password
                            </label>
                            <input
                                id='password'
                                name='password'
                                type='password'
                                required
                                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-transparent bg-white bg-opacity-20 text-white placeholder-white rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
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
                            Einloggen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
