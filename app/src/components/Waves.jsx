const Waves = () => {
    return (
        <div className='fixed inset-x-0 bottom-0 pointer-events-none'>
            <svg
                className='w-full'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 1440 320'
                preserveAspectRatio='none'
            >
                <path
                    fill='#4F46E5'
                    fillOpacity='0.2'
                    d='M0,32L48,53.3C96,75,192,117,288,138.7C384,160,480,160,576,138.7C672,117,768,75,864,80C960,85,1056,139,1152,160C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                ></path>
            </svg>
            <svg
                className='w-full absolute bottom-0'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 1440 320'
                preserveAspectRatio='none'
            >
                <path
                    fill='#818CF8'
                    fillOpacity='0.3'
                    d='M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,202.7C960,192,1056,192,1152,192C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
                ></path>
            </svg>
        </div>
    );
};

export default Waves;
