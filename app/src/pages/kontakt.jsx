import React from 'react';

const Kontakt = () => {
  return (
    <div className='kontakt-container'>
      <h1>Kontakt</h1>
      <p>
        Wir freuen uns über Ihre Nachricht. Sie erreichen uns unter folgenden
        Kontaktmöglichkeiten:
      </p>
      <h2>Adresse</h2>
      <p>
        TrackMyGoal GmbH
        <br />
        Musterstraße 123
        <br />
        12345 Musterstadt
        <br />
        Deutschland
      </p>
      <h2>Telefon</h2>
      <p>+49 (0) 123 4567890</p>
      <h2>E-Mail</h2>
      <p>
        <a href='mailto:info@trackmygoal.com'>info@trackmygoal.com</a>
      </p>
      <h2>Kontaktformular</h2>
      <form className='contact-form'>
        <label htmlFor='name'>Name:</label>
        <input type='text' id='name' name='name' placeholder='Ihr Name' />

        <label htmlFor='email'>E-Mail:</label>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Ihre E-Mail-Adresse'
        />

        <label htmlFor='message'>Nachricht:</label>
        <textarea
          id='message'
          name='message'
          placeholder='Ihre Nachricht'
        ></textarea>

        <button type='submit'>Absenden</button>
      </form>
    </div>
  );
};

export default Kontakt;
