import React, { useState } from 'react';

const Table = () => {
    const [cards, setCards] = useState([
        {
            id: 1,
            title: 'Projekt A',
            description: 'Ein innovatives Softwareprojekt',
        },
        {
            id: 2,
            title: 'Aufgabe B',
            description: 'Wichtige Deadline nächste Woche',
        },
        { id: 3, title: 'Idee C', description: 'Neue Produktidee für Q4' },
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const handleAddCard = () => {
        setCurrentCard(null);
        setNewTitle('');
        setNewDescription('');
        setIsDialogOpen(true);
    };

    const handleEditCard = (card) => {
        setCurrentCard(card);
        setNewTitle(card.title);
        setNewDescription(card.description);
        setIsDialogOpen(true);
    };

    const handleSaveCard = () => {
        if (currentCard) {
            setCards(
                cards.map((card) =>
                    card.id === currentCard.id
                        ? {
                              ...card,
                              title: newTitle,
                              description: newDescription,
                          }
                        : card
                )
            );
        } else {
            const newCard = {
                id: cards.length + 1,
                title: newTitle,
                description: newDescription,
            };
            setCards([...cards, newCard]);
        }
        setIsDialogOpen(false);
    };

    const handleDeleteCard = (id) => {
        if (
            window.confirm(
                'Sind Sie sicher, dass Sie dieses Ziel löschen möchten?'
            )
        ) {
            setCards(cards.filter((card) => card.id !== id));
        }
    };

    return (
        <div className='container mx-auto p-6 bg-gray-100 min-h-screen'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-800'>
                    Meine Ziele
                </h1>
                <button
                    onClick={handleAddCard}
                    className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
                >
                    + Neues Ziel
                </button>
            </div>
            <div className='space-y-4'>
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className='bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg'
                    >
                        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                            {card.title}
                        </h2>
                        <p className='text-gray-600 mb-4'>{card.description}</p>
                        <div className='flex justify-between items-center'>
                            <button
                                onClick={() => handleEditCard(card)}
                                className='text-blue-500 hover:text-blue-600 font-medium transition duration-300 ease-in-out'
                            >
                                Bearbeiten
                            </button>
                            <button
                                onClick={() => handleDeleteCard(card.id)}
                                className='text-red-500 hover:text-red-600 font-medium transition duration-300 ease-in-out'
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isDialogOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>
                        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                            {currentCard
                                ? 'Ziel bearbeiten'
                                : 'Neues Ziel erstellen'}
                        </h2>
                        <div className='mb-4'>
                            <label
                                htmlFor='title'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Titel
                            </label>
                            <input
                                type='text'
                                id='title'
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Titel eingeben'
                            />
                        </div>
                        <div className='mb-6'>
                            <label
                                htmlFor='description'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Kurzbeschreibung
                            </label>
                            <textarea
                                id='description'
                                value={newDescription}
                                onChange={(e) =>
                                    setNewDescription(e.target.value)
                                }
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                rows='3'
                                placeholder='Kurze Beschreibung eingeben'
                            ></textarea>
                        </div>
                        <div className='flex justify-end space-x-4'>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition duration-300 ease-in-out'
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSaveCard}
                                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out'
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
