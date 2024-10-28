import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useDialog } from '../context/DialogContext';
import ChangePasswordDialog from '../components/dialogs/ChangePasswordDialog';
import AvatarCropDialog from '../components/dialogs/AvatarCropDialog';
import { useNavigate } from 'react-router-dom';
import {
    Camera,
    Lock,
    Mail,
    Save,
    User,
    Shield,
    Bell,
    Settings,
    ChevronRight,
    ScrollText,
    FileSpreadsheet,
    Cookie,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CookieSettingsDialog from '../components/dialogs/CookieSettingsDialog';

const InputField = React.memo(
    ({ label, id, type = 'text', value, onChange, icon: Icon }) => (
        <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-white/70 mb-2'>
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Icon className='h-5 w-5 text-gray-400 dark:text-white/40' />
                </div>
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 
                border border-gray-200 dark:border-white/10
                focus:border-[#4785FF] focus:ring-2 focus:ring-[#4785FF]/20 dark:focus:ring-[#4785FF]/10 
                transition-all duration-200 outline-none
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-white/40'
                />
            </div>
        </div>
    )
);

const ProfileSection = ({ title, icon: Icon, children }) => (
    <div className='bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden'>
        <div className='p-6 border-b border-gray-200 dark:border-white/10'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                    <Icon className='w-5 h-5 text-white' />
                </div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                    {title}
                </h2>
            </div>
        </div>
        <div className='p-6'>{children}</div>
    </div>
);

const QuickAction = ({ icon: Icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className='w-full p-4 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10
             hover:shadow-lg dark:shadow-none transition-all duration-300 hover:-translate-y-1 group'
    >
        <div className='flex items-center gap-4'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                <Icon className='w-5 h-5 text-white' />
            </div>
            <div className='flex-1 text-left'>
                <h3 className='text-gray-900 dark:text-white font-medium'>
                    {title}
                </h3>
                <p className='text-sm text-gray-500 dark:text-white/60'>
                    {description}
                </p>
            </div>
            <ChevronRight className='w-5 h-5 text-gray-400 dark:text-white/40 group-hover:translate-x-1 transition-transform duration-200' />
        </div>
    </button>
);

const LegalLink = ({ icon: Icon, title, onClick }) => (
    <button
        onClick={onClick}
        className='flex items-center gap-3 p-3 rounded-xl 
                 bg-white/50 dark:bg-white/5 
                 border border-gray-200/50 dark:border-white/10 
                 hover:bg-white dark:hover:bg-white/10
                 transition-all duration-200 w-full group'
    >
        <div
            className='w-8 h-8 rounded-lg bg-gradient-to-br from-[#4785FF]/10 to-[#8c52ff]/10 
                      flex items-center justify-center'
        >
            <Icon className='w-4 h-4 text-[#4785FF]' />
        </div>
        <span className='text-sm font-medium text-gray-900 dark:text-white flex-grow text-left'>
            {title}
        </span>
        <ChevronRight
            className='w-4 h-4 text-gray-400 dark:text-white/40 
                               group-hover:translate-x-1 transition-transform duration-200'
        />
    </button>
);

const Profile = () => {
    const { user, updateUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        avatar: null,
    });
    const [initialFormData, setInitialFormData] = useState({});
    const { addToast } = useToast();
    const { addDialog } = useDialog();
    const [isModified, setIsModified] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const userData = {
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar,
            };
            setFormData(userData);
            setInitialFormData(userData);
        }
    }, [user]);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatarFile(file);
            addDialog({
                component: AvatarCropDialog,
                props: {
                    imageFile: file,
                    onSave: handleAvatarSave,
                },
            });
        }
    };

    const handleAvatarSave = (croppedImageUrl) => {
        setFormData((prev) => ({
            ...prev,
            avatar: croppedImageUrl,
        }));
        setIsModified(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            setIsModified(
                JSON.stringify(newData) !== JSON.stringify(initialFormData)
            );
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('userId', user._id);
        for (const key in formData) {
            if (key === 'avatar' && formData[key]?.startsWith('data:image')) {
                const response = await fetch(formData[key]);
                const blob = await response.blob();
                formDataToSend.append(key, blob, 'avatar.jpg');
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            const { data } = await axios.put('/profile', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUser(data);
            addToast('Profil erfolgreich aktualisiert', 'success');
            setIsModified(false);
            setInitialFormData(formData);
        } catch (error) {
            addToast('Fehler beim Aktualisieren des Profils', 'error');
        }
    };

    const navigateWithState = (path) => {
        navigate(path, { state: { fromProfile: true } });
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
            <Navbar />

            {/* Decorative Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-[#4785FF]/10 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8c52ff]/10 rounded-full blur-3xl animate-pulse delay-1000' />
            </div>

            <div className='container mx-auto px-4 py-8 relative z-10 pt-24'>
                {/* Hero Section */}
                <div className='text-center mb-12'>
                    <div className='flex items-center justify-center gap-2 mb-6'>
                        <div className='h-12 w-12 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                            <User className='h-6 w-6 text-white' />
                        </div>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                            Profil
                        </h1>
                    </div>
                    <p className='text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto'>
                        Verwalte deine persönlichen Informationen und
                        Einstellungen
                    </p>
                </div>

                <div className='grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
                    {/* Main Profile Section */}
                    <div className='lg:col-span-2 space-y-6'>
                        <ProfileSection
                            title='Persönliche Informationen'
                            icon={User}
                        >
                            <div className='flex flex-col items-center mb-8'>
                                <div className='relative group'>
                                    {formData.avatar ? (
                                        <img
                                            src={
                                                formData.avatar.startsWith(
                                                    'data:'
                                                )
                                                    ? formData.avatar
                                                    : `data:image/jpeg;base64,${formData.avatar}`
                                            }
                                            alt='Avatar'
                                            className='w-24 h-24 rounded-xl object-cover border-2 border-white dark:border-gray-800'
                                        />
                                    ) : (
                                        <div className='w-24 h-24 rounded-xl bg-gradient-to-br from-[#4785FF]/20 to-[#8c52ff]/20 flex items-center justify-center'>
                                            <User className='w-8 h-8 text-[#4785FF]' />
                                        </div>
                                    )}
                                    <label
                                        htmlFor='avatar'
                                        className='absolute inset-0 flex items-center justify-center 
                                                 bg-black/50 opacity-0 group-hover:opacity-100 
                                                 transition-opacity duration-200 rounded-xl 
                                                 cursor-pointer'
                                    >
                                        <Camera className='w-6 h-6 text-white' />
                                        <input
                                            type='file'
                                            id='avatar'
                                            name='avatar'
                                            onChange={handleAvatarChange}
                                            accept='image/*'
                                            className='hidden'
                                        />
                                    </label>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <InputField
                                        label='Benutzername'
                                        id='username'
                                        value={formData.username}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                    <InputField
                                        label='E-Mail'
                                        id='email'
                                        type='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        icon={Mail}
                                    />
                                    <InputField
                                        label='Vorname'
                                        id='firstname'
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                    <InputField
                                        label='Nachname'
                                        id='lastname'
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        icon={User}
                                    />
                                </div>

                                <button
                                    type='submit'
                                    disabled={!isModified}
                                    className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
                                             ${
                                                 !isModified
                                                     ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 cursor-not-allowed'
                                                     : 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10 hover:-translate-y-0.5'
                                             }
                                             transition-all duration-200`}
                                >
                                    <Save className='w-5 h-5' />
                                    Speichern
                                </button>
                            </form>
                        </ProfileSection>
                    </div>

                    {/* Right Sidebar */}
                    <div className='space-y-6'>
                        {/* Account Quick Actions */}
                        <ProfileSection title='Schnellzugriff' icon={Settings}>
                            <div className='space-y-4'>
                                <QuickAction
                                    icon={Lock}
                                    title='Passwort ändern'
                                    description='Aktualisiere dein Passwort regelmäßig'
                                    onClick={() =>
                                        addDialog({
                                            component: ChangePasswordDialog,
                                        })
                                    }
                                />
                                <QuickAction
                                    icon={Bell}
                                    title='Benachrichtigungen'
                                    description='Verwalte deine Benachrichtigungen'
                                    onClick={() => {
                                        navigate('/notifications');
                                    }}
                                />
                            </div>
                        </ProfileSection>

                        {/* Legal Links Section */}
                        <ProfileSection title='Rechtliches' icon={ScrollText}>
                            <div className='space-y-4'>
                                <LegalLink
                                    icon={ScrollText}
                                    title='Impressum'
                                    onClick={() => navigateWithState('/impressum')}
                                />
                                <LegalLink
                                    icon={Shield}
                                    title='Datenschutz'
                                    onClick={() => navigateWithState('/datenschutz')}
                                />
                                <LegalLink
                                    icon={FileSpreadsheet}
                                    title='AGB'
                                    onClick={() => navigateWithState('/agb')}
                                />
                                <LegalLink
                                    icon={Cookie}
                                    title='Cookie-Einstellungen'
                                    onClick={() => {
                                        addDialog({
                                            component: CookieSettingsDialog,
                                        });
                                    }}
                                />
                            </div>
                        </ProfileSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
