import React from 'react';
import '../index.css';
import LandingNavbar from '../components/LandingNavbar'; // Überprüfe den Pfad
import Footer from '../components/footer';
import landingpagePic1 from '../images/landingpagePic.jpeg';
import landingpagePic2 from '../images/vernetzung.jpg';
import landingpagePic3 from '../images/landingpagePic3.jpeg';
import Arman from '../images/Arman.jpg';
import JeanLuc from '../images/Jean-Luc.jpeg';
import Luke from '../images/Luke.jpeg';
import Sönke from '../images/Sönke.jpeg';

const Landingpage = () => {
  return (
    <div className='relative'>
      {/* Navbar immer sichtbar */}
      <LandingNavbar />

      <section
        id='first-section'
        className='min-h-screen flex flex-col items-center justify-center text-center bg-[#8c52ff]'
      >
        <div
          className='hover:transform hover:-translate-y-2 transition-transform duration-300'
          style={{
            backgroundImage: `url(${require('../images/logonew.png')})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '50%',
            width: '75px',
            height: '75px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', // Schattierung
            border: '5px solid white', // Weißer Rahmen
            transition: 'transform 0.3s ease', // Animation
          }}
        />
        <h1 className='text-4xl font-bold text-white mb-4'>
          Willkommen bei TrackMyGoal
        </h1>
        <button
          className='bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700'
          onClick={() =>
            document
              .getElementById('second-section')
              .scrollIntoView({ behavior: 'smooth' })
          }
        >
          Jetzt Starten
        </button>

        <p className='mt-4 text-white text-2xl hover-trigger'>
          {'Your Journey, Your Success!'.split('').map((char, index) => (
            <span
              key={index}
              className='inline-block hover-letter'
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {char}
            </span>
          ))}
        </p>

        <br></br>
        <p className='mt-4 text-white text-1x1'>
          Um deine Träume zu verwirklichen, ist es wichtig, zunächst
          herauszufinden, was deine wahren Leidenschaften sind und was du
          wirklich erreichen möchtest. Setze dir klare und erreichbare Ziele, um
          diese Träume Schritt für Schritt Wirklichkeit werden zu lassen. Bleib
          beharrlich und lasse dich von Rückschlägen nicht entmutigen, denn
          Hindernisse sind Teil des Weges. Feiere jeden kleinen Fortschritt, den
          du machst, und genieße die Reise zu deinem persönlichen Erfolg.
          Verwirkliche deine Träume!
        </p>
      </section>
      <br></br>

      <section
        id='second-section'
        className='min-h-screen flex items-center justify-center bg-purple-700 '
      >
        <div className='text-center'>
          {' '}
          {/* Text zentrieren */}
          <h2 className='text-4xl font-bold text-white mb-4'>Unsere Vision</h2>
          <p className='mt-4 text-white text-2xl italic'>
            "Unsere Vision ist es, eine Welt zu schaffen, in der jeder Mensch
            die Möglichkeit hat, seine Träume zu verwirklichen. Wir streben
            danach, innovative Lösungen zu entwickeln, die das Leben bereichern
            und das tägliche Leben einfacher, sicherer und erfüllender machen.
            Mit Leidenschaft und Entschlossenheit arbeiten wir daran, eine
            nachhaltige Zukunft zu gestalten, in der Technologie und Mensch im
            Einklang stehen. Unsere Webseite ermöglicht es den Nutzern, ihre
            Ziele festzulegen und diese mit ihren Freunden zu teilen. So können
            sie sich gegenseitig motivieren und gemeinsam Erfolge feiern. Wir
            glauben fest daran, dass durch den Austausch und die Unterstützung
            innerhalb der Community jeder in der Lage ist, seine Ziele zu
            erreichen. Gemeinsam können wir Großes erreichen und eine positive
            Veränderung bewirken. Unsere Vision ist unsere Motivation und unser
            Antrieb, jeden Tag unser Bestes zu geben." ~ TrackMyGoal Team
          </p>
          <div className='flex justify-center mt-6'>
            {' '}
            {/* Flex-Container für den Button */}
            <button
              className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
              onClick={() =>
                document
                  .getElementById('third-section')
                  .scrollIntoView({ behavior: 'smooth' })
              }
            >
              Deine Vorteile
            </button>
          </div>
        </div>
      </section>

      <br></br>

      <section
        id='third-section'
        className=' min-h-screen flex flex-col items-center justify-center bg-white '
        style={{ backgroundColor: '#8c52ff' }}
      >
        {/* Erstes Div mit Bild und Text */}
        <div
          className='flex items-start gap-4 shadow-lg p-4 rounded-lg bg-white mb-16  hover:transform hover:-translate-y-2 transition-transform duration-300 mt-10 ml-10 mr-10'
          style={{ width: '90%', margin: '0 auto' }}
        >
          <img
            src={landingpagePic1}
            alt='Your Journey, Your Succes!'
            className='w-full max-w-xs h-auto rounded-lg object-cover'
          />

          <div>
            <h3 className='text-lg font-medium text-gray-900'>
              Erreiche dein Ziel, egal wo du stehst{' '}
            </h3>
            <p className='mt-0.5 text-gray-700'>
              Egal, ob du gerade erst beginnst oder schon mitten in deinem
              Vorhaben steckst – unsere Webseite hilft dir, deine Ziele an einem
              zentralen Ort zu speichern und den Überblick zu behalten. Trage
              deine Pläne, Ideen und Projekte ein, um sie jederzeit griffbereit
              zu haben und besser organisiert zu bleiben. So verlierst du nie
              den Fokus und kannst deine Fortschritte klar nachvollziehen.
              <br />
              Unsere Plattform bietet dir die Flexibilität, deine Ziele
              anzupassen und zu aktualisieren, wann immer du möchtest. Ob du
              neue Meilensteine setzt, deine Ziele erweiterst oder deine Pläne
              änderst – du hast alles im Griff. Mit einer klaren Übersicht und
              der Möglichkeit, alle deine Ziele an einem Ort zu bündeln, bleibst
              du motiviert und kannst deine Träume Schritt für Schritt
              verwirklichen.
            </p>
          </div>
        </div>
        <br></br>
        {/* Zweites Div  */}
        <div
          className='flex items-start gap-4 shadow-lg p-4 rounded-lg bg-white mb-8 hover:transform hover:-translate-y-2 transition-transform duration-300 ml-10 mr-10 mt-10'
          style={{ width: '90%', margin: '0 auto' }}
        >
          <img
            src={landingpagePic2}
            alt='Your Journey, Your Succes!'
            className='w-full max-w-xs h-auto rounded-lg object-cover'
          />

          <div>
            <h3 className='text-lg font-medium text-gray-900'>
              Teile deine Ziele und erreiche sie gemeinsam
            </h3>
            <p className='mt-0.5 text-gray-700'>
              Unsere Plattform ermöglicht es dir, deine Ziele mit Freunden zu
              teilen und sie auf deinem Weg einzubeziehen. Lade Freunde ein, an
              deinen Projekten mitzuwirken, oder unterstütze ihre Ziele, indem
              ihr gemeinsam daran arbeitet. So könnt ihr euch gegenseitig
              motivieren und Erfolge zusammen feiern. Teile deine Ziele
              International mit anderen Menschen!
              <br />
              Verwandele deine Ziele in eine gemeinsame Mission und nutze die
              Kraft der Gemeinschaft, um schneller ans Ziel zu kommen. Gemeinsam
              macht es nicht nur mehr Spaß, sondern erhöht auch die Chance,
              dranzubleiben und das Beste aus euch herauszuholen.
            </p>
          </div>
        </div>
        <br></br>
        {/* Drittes Div  */}
        <div
          className='flex items-start gap-4 shadow-lg p-4 rounded-lg bg-white mb-8 hover:transform hover:-translate-y-2 transition-transform duration-300 ml-10 mr-10'
          style={{ width: '90%', margin: '0 auto' }}
        >
          <img
            src={landingpagePic3}
            alt='Your Journey, Your Succes!'
            className='w-full max-w-xs h-auto rounded-lg object-cover'
          />

          <div>
            <h3 className='text-lg font-medium text-gray-900'>
              Verfolge deine Fortschritte und bleibe motiviert
            </h3>
            <p className='mt-0.5 text-gray-700'>
              Mit unserer Webseite kannst du deine Fortschritte einfach
              dokumentieren und analysieren. Halte fest, welche Schritte du
              bereits unternommen hast, und sieh auf einen Blick, wie weit du
              gekommen bist. Diese Übersicht hilft dir, deine Erfolge zu feiern
              und gibt dir das nötige Feedback, um motiviert zu bleiben.
              <br />
              Durch regelmäßige Updates deiner Ziele und das Nachverfolgen von
              Meilensteinen kannst du sicherstellen, dass du auf dem richtigen
              Weg bist. Die visuelle Darstellung deiner Fortschritte inspiriert
              dich dazu, weiterzumachen und deine Träume in die Realität
              umzusetzen. Mit jedem kleinen Erfolg wächst dein Selbstvertrauen
              und deine Entschlossenheit, weiterhin an deinen Zielen
              festzuhalten.
            </p>
          </div>
        </div>

        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-white mb-4'>Vorteile</h2>
          <p className='mt-4 text-white mb-4'>für dich</p>
          <button
            className='mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
            onClick={() =>
              document
                .getElementById('fourth-section')
                .scrollIntoView({ behavior: 'smooth' })
            }
          >
            Erzähle mir mehr
          </button>
        </div>
      </section>

      <br></br>

      <section
        id='fourth-section'
        className='min-h-screen flex items-center justify-center bg-purple-700'
      >
        <div>
          <h2 className='text-3xl font-bold text-white mb-4'>
            TrackMyGoal Team
          </h2>
          <p className='mt-4 text-white mb-8'>Das sind wir</p>
          {/* Button in der Mitte */}
          <button
            className='mt-8 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 '
            onClick={() =>
              document
                .getElementById('last-section')
                .scrollIntoView({ behavior: 'smooth' })
            }
          >
            Nächste Sektion
          </button>
        </div>

        {/* Container für die Quadrate */}
        <div className='flex justify-between items-start w-full max-w-6xl ml-10 mt-4'>
          {/* Linke Seite mit zwei Quadraten */}
          <div className='flex flex-col gap-4'>
            {/* Erstes Quadrat */}
            <div className='flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 w-80 h-80 mb-4 hover:transform hover:-translate-y-2 transition-transform duration-300'>
              <img
                src={Luke}
                alt='Bild 1'
                className='rounded-md mb-2 w-32 h-48 object-cover'
              />
              <h3 className='text-lg font-medium text-gray-900'>
                Luke Schröder
              </h3>
              <p className='mt-1 text-gray-700'>Kurze Beschreibung</p>
            </div>

            {/* Zweites Quadrat */}
            <div className='flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 w-80 h-80 hover:transform hover:-translate-y-2 transition-transform duration-300'>
              <img
                src={Sönke}
                alt='Bild 2'
                className='rounded-md mb-2 w-32 h-48 object-cover'
              />
              <h3 className='text-lg font-medium text-gray-900'>
                Sönke Vogelsberg
              </h3>
              <p className='mt-1 text-gray-700'>Kurze Beschreibung</p>
            </div>
          </div>

          {/* Rechte Seite mit zwei Quadraten */}
          <div className='flex flex-col gap-4'>
            {/* Drittes Quadrat */}
            <div className='flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 w-80 h-80 mb-4 hover:transform hover:-translate-y-2 transition-transform duration-300 '>
              <img
                src={JeanLuc}
                alt='Bild 3'
                className='rounded-md mb-2 w-32 h-48 object-cover'
              />
              <h3 className='text-lg font-medium text-gray-900'>
                Jean-Luc Höfler
              </h3>
              <p className='mt-1 text-gray-700'>Kurze Beschreibung</p>
            </div>

            {/* Viertes Quadrat */}
            <div className='flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 w-80 h-80 hover:transform hover:-translate-y-2 transition-transform duration-300'>
              <img
                src={Arman}
                alt='Arman'
                className='rounded-md mb-2 w-32 h-48 object-cover'
              />
              <h3 className='text-lg font-medium text-gray-900'>
                Arman Rashoyan
              </h3>
              <p className='mt-1 text-gray-700'>Kurze Beschreibung</p>
            </div>
          </div>
        </div>
      </section>

      <br></br>

      <section
        id='last-section'
        className='min-h-screen flex flex-col items-center justify-center bg-white'
        style={{ backgroundColor: '#8c52ff' }}
      >
        <h2 className='text-3xl font-bold text-white mb-6'>Häufige Fragen</h2>

        <div className='flex flex-col gap-4 w-3/4'>
          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Wie kann ich meine Ziele auf TrackMyGoal erstellen und speichern?
            </summary>
            <p className='mt-2 text-gray-700'>
              Um ein Ziel zu erstellen, melde dich einfach auf unserer Webseite
              an und navigiere zum Bereich "Meine Ziele". Dort kannst du ein
              neues Ziel hinzufügen, deine Meilensteine definieren und Notizen
              hinzufügen, um den Überblick zu behalten. Deine Ziele werden
              sicher gespeichert, sodass du jederzeit darauf zugreifen kannst.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              {' '}
              Kann ich meine Fortschritte bei meinen Zielen verfolgen?
            </summary>
            <p className='mt-2 text-gray-700'>
              Ja, du kannst den Fortschritt deiner Ziele leicht verfolgen.
              Unsere Plattform bietet dir die Möglichkeit, Updates hinzuzufügen,
              Meilensteine zu markieren und deine Erfolge zu visualisieren,
              damit du stets den Überblick behältst.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Wie teile ich meine Ziele mit Freunden?
            </summary>
            <p className='mt-2 text-gray-700'>
              Du kannst deine Ziele ganz einfach mit deinen Freunden teilen,
              indem du sie zu deinem Ziel einlädst. Sie können deine
              Fortschritte sehen und dich unterstützen. Diese Funktion hilft
              dir, motiviert zu bleiben und gemeinsam Erfolge zu feiern.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Kann ich die Ziele meiner Freunde sehen und sie unterstützen?
            </summary>
            <p className='mt-2 text-gray-700'>
              Ja, wenn deine Freunde dir den Zugriff erlauben, kannst du ihre
              Ziele sehen und sie dabei unterstützen. Ihr könnt
              zusammenarbeiten, Tipps austauschen und euch gegenseitig
              motivieren, eure Ziele zu erreichen.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Wie hilft mir TrackMyGoal, motiviert zu bleiben?
            </summary>
            <p className='mt-2 text-gray-700'>
              TrackMyGoal zeigt dir deine Fortschritte visuell an und erinnert
              dich an deine Erfolge. Außerdem kannst du dich mit Freunden
              verbinden, die dich unterstützen und motivieren. Gemeinsame
              Herausforderungen und der Austausch innerhalb der Community helfen
              dir, dranzubleiben.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Kann ich meine Ziele anpassen oder ändern?
            </summary>
            <p className='mt-2 text-gray-700'>
              Natürlich! Du kannst deine Ziele jederzeit bearbeiten,
              Meilensteine hinzufügen oder aktualisieren. TrackMyGoal bietet dir
              die Flexibilität, deine Pläne anzupassen, wenn sich deine
              Prioritäten ändern.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Wie sicher sind meine Daten auf TrackMyGoal?
            </summary>
            <p className='mt-2 text-gray-700'>
              Wir legen großen Wert auf Datenschutz und Sicherheit. Deine Daten
              sind bei uns sicher gespeichert, und wir verwenden moderne
              Sicherheitsmaßnahmen, um sicherzustellen, dass deine persönlichen
              Informationen geschützt bleiben.
            </p>
          </details>

          <details className='bg-white p-4 rounded-lg shadow-lg cursor-pointer'>
            <summary className='text-lg font-medium text-gray-900'>
              Was passiert, wenn ich mein Ziel erreicht habe?
            </summary>
            <p className='mt-2 text-gray-700'>
              {' '}
              Sobald du ein Ziel erreicht hast, kannst du es als abgeschlossen
              markieren und deinen Erfolg feiern. Du hast auch die Möglichkeit,
              ein Feedback zu hinterlassen und zu reflektieren, was dir geholfen
              hat, das Ziel zu erreichen, um dich für zukünftige
              Herausforderungen vorzubereiten.
            </p>
          </details>
        </div>

        <button
          className='mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
          onClick={() =>
            document
              .getElementById('first-section')
              .scrollIntoView({ behavior: 'smooth' })
          }
        >
          Zurück zum Anfang
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default Landingpage;
