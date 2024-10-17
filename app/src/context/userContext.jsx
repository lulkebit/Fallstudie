import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            axios
                .get('/profile')
                .then((response) => {
                    if (response.data.success) {
                        setUser(response.data.user);
                    } else {
                        setUser(null);
                    }
                })
                .catch(() => {
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        document.cookie = `user=${JSON.stringify(updatedUser)}; path=/;`;
    };

    return (
        <UserContext.Provider
            value={{ user, setUser, loading, setLoading, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};
