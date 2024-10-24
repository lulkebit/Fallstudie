# TracMyGoal

Eine Full-Stack-Webanwendung, die Benutzern hilft, ihre Ziele zu setzen, zu verfolgen und zu erreichen, während sie sich mit Freunden verbinden und an globalen Herausforderungen teilnehmen können.

## Funktionen

-   **Benutzerauthentifizierung**

    -   Registrierungs- und Anmeldefunktion
    -   Passwortverwaltung
    -   Profilanpassung mit Avatar

-   **Zielverwaltung**

    -   Erstellen und Verwalten privater Ziele
    -   Ziele mit Freunden teilen
    -   Teilnahme an globalen Zielen
    -   Fortschrittsverfolgung

-   **Soziale Funktionen**

    -   Freunde hinzufügen und verwalten
    -   Geteilte Ziele von Freunden ansehen
    -   Auf Ziele reagieren
    -   Benachrichtigungssystem

-   **Admin-Bereich**
    -   Benutzerverwaltung
    -   Verwaltung globaler Ziele
    -   Systemstatistiken

## Technologie-Stack

### Frontend

-   React.js
-   Tailwind CSS
-   Context API für State Management

### Backend

-   Node.js
-   Express.js
-   MongoDB (basierend auf der Modellstruktur)

## Installation & Einrichtung

### Voraussetzungen

-   Node.js
-   npm
-   MongoDB-Instanz

### Backend-Einrichtung

1. In das Server-Verzeichnis wechseln:

```bash
cd server
```

2. Abhängigkeiten installieren:

```bash
npm install
```

3. Server starten:

```bash
npm start
```

Der Server läuft auf dem konfigurierten Port (Standard: 3001).

### Frontend-Einrichtung

1. In das App-Verzeichnis wechseln:

```bash
cd app
```

2. Abhängigkeiten installieren:

```bash
npm install
```

3. Entwicklungsserver starten:

```bash
npm start
```

Die Anwendung öffnet sich automatisch im Standard-Browser unter `http://localhost:3000`.

## Projektstruktur

```
├── app/                    # Frontend React-Anwendung
│   ├── public/            # Statische Dateien
│   └── src/
│       ├── components/    # React-Komponenten
│       ├── context/       # Context-Provider
│       ├── pages/         # Seiten-Komponenten
│       └── Routes.jsx     # Anwendungsrouting
│
└── server/                # Backend Node.js-Anwendung
    ├── controllers/       # Routen-Controller
    ├── helpers/          # Hilfsfunktionen
    ├── models/           # Datenbankmodelle
    ├── routes/           # API-Routen
    └── utils/            # Dienstprogramme
```

## Detaillierte Funktionen

### Benutzerverwaltung

-   Benutzerregistrierung und -authentifizierung
-   Profilanpassung
-   Passwortverwaltung
-   Freundesystem

### Zielsystem

-   Private Ziele zur persönlichen Verfolgung
-   Geteilte Ziele, sichtbar für Freunde
-   Globale Ziele für die Community-Teilnahme
-   Fortschrittsverfolgung und Aktualisierungen

### Soziale Funktionen

-   Freundschaftsanfragen und -verwaltung
-   Aktivitätsbenachrichtigungen
-   Zielreaktionen und Interaktionen
-   Zeitleiste der persönlichen Entwicklung

### Administrative Funktionen

-   Benutzerkontoverwaltung
-   Erstellung und Verwaltung globaler Ziele
-   Systemüberwachung und Statistiken

## Mitwirkende

-   Luke
-   Sönke
-   Jean-Luc
-   Arman

## Lizenz

Dieses Projekt ist unter der ISC-Lizenz lizenziert.
