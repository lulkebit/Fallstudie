import React, { useRef, useEffect } from 'react';

const PasswordInput = ({
    label,
    name,
    icon: Icon,
    value,
    onChange,
    ...props
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = value;
        }
    }, [value]);

    return (
        <div className='relative group'>
            <div className='absolute -inset-1'>
                <div className='w-full h-full rotate-180 opacity-30 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute inset-0 -z-10 group-hover:animate-[pulse_2s_infinite]'>
                        <div className='absolute inset-0 translate-x-0 blur-2xl bg-gradient-to-r from-[#4785FF]/30 to-[#8c52ff]/30' />
                    </div>
                </div>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-white/70 mb-2'>
                    {label}
                </label>
                <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Icon className='h-5 w-5 text-[#4785FF] dark:text-[#8c52ff]' />
                    </div>
                    <input
                        ref={inputRef}
                        type='password'
                        name={name}
                        onChange={onChange}
                        className='w-full pl-10 pr-4 py-3 rounded-xl
                        bg-white/70 dark:bg-gray-900/50
                        border border-gray-200/50 dark:border-white/10
                        focus:border-[#4785FF] dark:focus:border-[#8c52ff]
                        focus:ring-2 focus:ring-[#4785FF]/20 dark:focus:ring-[#8c52ff]/10
                        transition-all duration-200 outline-none
                        text-gray-900 dark:text-white
                        placeholder:text-gray-400 dark:placeholder:text-white/40'
                        {...props}
                    />
                </div>
            </div>
        </div>
    );
};

export default PasswordInput;
