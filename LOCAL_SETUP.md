# Lokale Entwicklungsumgebung für TrackMyGoal

Diese Anleitung beschreibt, wie Sie TrackMyGoal lokal auf Ihrem Computer ausführen können, falls die offizielle Website ([trackmygoal.de](https://trackmygoal.de)) nicht verfügbar ist.

## Vorab

### Tailwind CSS Erklärung

In diesem Projekt wird [Tailwind CSS](https://tailwindcss.com/) verwendet, was **kein** Component-Framework wie Material-UI oder Bootstrap mit vorgefertigten Komponenten ist. Stattdessen ist Tailwind CSS ein Utility-First CSS Framework, das lediglich CSS-Klassen bereitstellt, mit denen man eigene Komponenten von Grund auf neu gestaltet. Weitere Informationen zur Funktionsweise finden Sie in der [Tailwind CSS Dokumentation](https://tailwindcss.com/docs).

Beispiel für eine selbst gestaltete Komponente mit Tailwind:

```jsx
// Diese Komponente wurde komplett selbst designed und implementiert
// Tailwind stellt nur die CSS-Utilities bereit
<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
    Klick mich
</button>
```

Alle UI-Komponenten im Projekt wurden eigenständig entwickelt und gestaltet. Tailwind CSS diente dabei nur als Werkzeug zur effizienteren CSS-Entwicklung, ähnlich wie SASS oder LESS, und nicht als Komponenten-Bibliothek.

## Voraussetzungen

Stellen Sie sicher, dass folgende Software auf Ihrem System installiert ist:

-   Node.js (Version 14 oder höher)
-   npm (wird mit Node.js installiert)

## Automatische Installation und Start

Für Windows-Benutzer haben wir ein automatisches Start-Skript erstellt:

1. Öffnen Sie den Projektordner
2. Doppelklicken Sie auf `start-local.bat`
3. Warten Sie, bis beide Server gestartet sind

Das Skript wird automatisch:

-   Alle notwendigen Abhängigkeiten installieren
-   Den Backend-Server starten
-   Den Frontend-Server starten

## Manuelle Installation und Start

Falls Sie die Server manuell starten möchten:

### Backend starten:

1. Öffnen Sie ein Terminal
2. Navigieren Sie zum Server-Verzeichnis:
    ```bash
    cd server
    ```
3. Installieren Sie die Abhängigkeiten:
    ```bash
    npm install
    ```
4. Starten Sie den Server:
    ```bash
    npm start
    ```

### Frontend starten:

1. Öffnen Sie ein neues Terminal
2. Navigieren Sie zum App-Verzeichnis:
    ```bash
    cd app
    ```
3. Installieren Sie die Abhängigkeiten:
    ```bash
    npm install
    ```
4. Starten Sie die React-Anwendung:
    ```bash
    npm start
    ```

## Zugriff auf die Anwendung

Nach erfolgreichem Start können Sie auf die Anwendung wie folgt zugreifen:

-   Frontend: [http://localhost:3000](http://localhost:3000)
-   Backend-API: [http://localhost:8000](http://localhost:8000)

## Fehlerbehebung

Falls Probleme auftreten:

1. **Port bereits in Verwendung:**

    - Stellen Sie sicher, dass die Ports 3000 und 8000 nicht von anderen Anwendungen verwendet werden
    - Beenden Sie alle laufenden Node.js-Prozesse und versuchen Sie es erneut

2. **MongoDB-Verbindungsfehler:**

    - Überprüfen Sie, ob MongoDB läuft
    - Stellen Sie sicher, dass die Verbindungs-URL in der Server-Konfiguration korrekt ist

3. **Allgemeine Probleme:**
    - Löschen Sie die `node_modules` Ordner in beiden Verzeichnissen
    - Führen Sie `npm install` erneut aus
    - Starten Sie die Server neu
