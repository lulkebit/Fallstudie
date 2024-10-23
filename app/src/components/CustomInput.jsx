const CustomInput = ({ id, label, value, onChange, icon: Icon }) => (
    <div className='space-y-1.5'>
        <label htmlFor={id} className='block text-sm font-medium text-gray-600'>
            {label}
        </label>
        <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Icon className='h-5 w-5 text-gray-400' />
            </div>
            <input
                type='password'
                id={id}
                value={value}
                onChange={onChange}
                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none'
                placeholder={`${label} eingeben`}
            />
        </div>
    </div>
);

export default CustomInput;
