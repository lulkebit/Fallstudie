# TrackMyGoal

TrackMyGoal ist eine Webanwendung, die Benutzern hilft, ihre Ziele zu verfolgen und zu verwalten. Diese Anwendung besteht aus einem Frontend, das mit React und Tailwind CSS erstellt wurde, und einem Backend, das mit Node.js und Express betrieben wird und MongoDB als Datenbank verwendet.

## Inhaltsverzeichnis

-   Installation
-   Verwendung
-   Projektstruktur
-   Umgebungsvariablen
-   Skripte
-   API-Endpunkte
-   Technologien
-   Mitwirkende
-   Lizenz

## Installation

### Voraussetzungen

-   Node.js (>= 14.x)
-   npm (>= 6.x)
-   MongoDB

### Schritte

1. Klone das Repository:

    ```sh
    git clone https://github.com/dein-benutzername/trackmygoal.git
    cd trackmygoal
    ```

2. Installiere die Abhängigkeiten für das Frontend:

    ```sh
    cd app
    npm install
    ```

3. Installiere die Abhängigkeiten für das Backend:

    ```sh
    cd ../server
    npm install
    ```

## Verwendung

### Frontend

Um das Frontend zu starten, navigiere in das `app` Verzeichnis und führe den folgenden Befehl aus:

```sh
npm start
```

Das Frontend wird auf `http://localhost:3000` laufen.

### Backend

Um das Backend zu starten, navigiere in das `server` Verzeichnis und führe den folgenden Befehl aus:

```sh
npm start
```

Das Backend wird auf `http://localhost:8000` laufen.

## Projektstruktur

```plaintext
.gitignore
.idea/
app/
    build/
    package.json
    public/
    src/
        components/
        context/
        index.css
        index.js
        pages/
    tailwind.config.js
server/
    controllers/
        authController.js
        friendController.js
    helpers/
    index.js
    models/
    package.json
    ressources/
        texts.js
    routes/
    utils/
        logger.js
        logs/
```

### Wichtige Dateien und Verzeichnisse

-   `index.js`: Einstiegspunkt für das Frontend.
-   `tailwind.config.js`: Tailwind CSS Konfigurationsdatei.
-   `index.js`: Einstiegspunkt für das Backend.
-   `texts.js`: Enthält Textnachrichten für das Backend.
-   `logger.js`: Logger-Konfiguration.

## Umgebungsvariablen

Erstelle eine `.env` Datei im `server` Verzeichnis und füge die folgenden Umgebungsvariablen hinzu:

```plaintext
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=8000
JWT_SECRET=your_jwt_secret
```

## Skripte

### Frontend

-   `npm start`: Startet die Entwicklungsumgebung.
-   `npm run build`: Erstellt eine Produktionsversion der Anwendung.

### Backend

-   `npm start`: Startet den Server mit [`nodemon`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Flukes%2FOneDrive%2FDokumente%2FSTORAGE%2FDHBW%2F3.%20Semester%2FWeb-Programmierung%2FEntwicklung%2FFallstudie%2Fserver%2Fpackage.json%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A6%2C%22character%22%3A18%7D%7D%5D%2C%225a5f6e08-46fb-43a6-be9c-5c72f246f04d%22%5D 'Go to definition') für die Entwicklung.

## API-Endpunkte

### Authentifizierung

-   `POST /api/auth/register`: Registriert einen neuen Benutzer.
-   `POST /api/auth/login`: Meldet einen Benutzer an.

### Ziele

-   `GET /api/goals`: Ruft die Ziele des angemeldeten Benutzers ab.
-   `POST /api/goals`: Erstellt ein neues Ziel.
-   `DELETE /api/goals/:id`: Löscht ein Ziel.

### Freunde

-   `GET /api/friends`: Ruft die Freundesliste des angemeldeten Benutzers ab.
-   `POST /api/friends/request`: Sendet eine Freundschaftsanfrage.
-   `POST /api/friends/accept`: Akzeptiert eine Freundschaftsanfrage.
-   `POST /api/friends/reject`: Lehnt eine Freundschaftsanfrage ab.

## Technologien

### Frontend

-   React
-   Tailwind CSS

### Backend

-   Node.js
-   Express
-   MongoDB
-   Mongoose

## Mitwirkende

-   Luke
-   Sönke
-   Jean-Luc
-   Arman

## Lizenz

Dieses Projekt ist unter der ISC-Lizenz lizenziert.
