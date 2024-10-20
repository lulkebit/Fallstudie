import GlobalGoalTable from '../components/GlobalGoaltable';
import UserManagement from '../components/UserManagement';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
    return (
        <>
            <Navbar />
            <div className='bg-gray-100 min-h-screen pt-24'>
                <div className='container mx-auto px-4'>
                    <h1 className='text-3xl font-bold mb-4 text-center text-blue-600'>
                        Admin Panel
                    </h1>

                    <div className='flex flex-col md:flex-row flex-1 p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6'>
                        <div className='w-full md:w-1/2 space-y-6'>
                            <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
                                <GlobalGoalTable />
                            </div>
                        </div>
                        <div className='flex-grow space-y-6'>
                            <div className='bg-white rounded-lg shadow-md p-4 md:p-6'>
                                <UserManagement />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
