# TrackMyGoal

Eine Full-Stack-Webanwendung, die Benutzern hilft, ihre Ziele zu setzen, zu verfolgen und zu erreichen, während sie sich mit Freunden verbinden und an globalen Herausforderungen teilnehmen können.

Besuchen Sie uns unter [trackmygoal.de](https://trackmygoal.de)

## Funktionen

-   **Benutzerauthentifizierung**

    -   Registrierungs- und Anmeldefunktion
    -   Passwortverwaltung mit Passwort-Zurücksetzen
    -   Profilanpassung mit Avatar und Bildbearbeitung

-   **Zielverwaltung**

    -   Erstellen und Verwalten privater Ziele
    -   Ziele mit Freunden teilen
    -   Teilnahme an globalen Zielen
    -   Fortschrittsverfolgung
    -   Kanban-Board für Zielverwaltung

-   **Soziale Funktionen**

    -   Freunde hinzufügen und verwalten
    -   Geteilte Ziele von Freunden ansehen
    -   Auf Ziele reagieren
    -   Erweitertes Benachrichtigungssystem

-   **Admin-Bereich**

    -   Benutzerverwaltung
    -   Verwaltung globaler Ziele
    -   Systemstatistiken und Nutzungsanalysen
    -   Benutzer-Wachstumszeitlinie

-   **Datenschutz & Sicherheit**
    -   Cookie-Verwaltung mit Banner
    -   Datenschutzeinstellungen
    -   Sichere Passwortverwaltung

## Technologie-Stack

### Frontend

-   React.js
-   Tailwind CSS (Utility-First CSS Framework)
-   Context API für State Management

### Backend

-   Node.js
-   Express.js
-   MongoDB

## Installation & Einrichtung

### Voraussetzungen

-   Node.js (Version 14 oder höher)
-   npm

### Automatische Installation

Für Windows-Benutzer steht ein automatisches Start-Skript zur Verfügung:

1. Öffnen Sie den Projektordner
2. Doppelklicken Sie auf `start-local.bat`
3. Warten Sie, bis beide Server gestartet sind

Das Skript übernimmt automatisch:

-   Installation aller Abhängigkeiten
-   Start des Backend-Servers
-   Start des Frontend-Servers

### Manuelle Installation

#### Backend-Einrichtung

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

Der Server läuft auf Port 8000.

#### Frontend-Einrichtung

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

Die Anwendung öffnet sich automatisch unter `http://localhost:3000`.

## Projektstruktur

```
├── app/                    # Frontend React-Anwendung
│   ├── public/            # Statische Dateien
│   └── src/
│       ├── components/    # React-Komponenten
│       │   ├── containers/    # Container-Komponenten
│       │   └── dialogs/      # Dialog-Komponenten
│       ├── context/       # Context-Provider
│       ├── images/        # Bildressourcen
│       ├── pages/         # Seiten-Komponenten
│       │   └── auth/         # Authentifizierungsseiten
│       └── Routes.jsx     # Anwendungsrouting
│
└── server/                # Backend Node.js-Anwendung
    ├── controllers/       # Routen-Controller
    ├── helpers/          # Hilfsfunktionen
    ├── middleware/       # Express Middleware
    ├── models/           # Datenbankmodelle
    ├── ressources/       # Statische Ressourcen
    ├── routes/           # API-Routen
    └── utils/            # Dienstprogramme
```

## Detaillierte Funktionen

### Benutzerverwaltung

-   Benutzerregistrierung und -authentifizierung
-   Erweiterte Profilanpassung mit Avatarbearbeitung
-   Umfassende Passwortverwaltung inkl. Zurücksetzen
-   Freundesystem mit Anfragen und Benachrichtigungen

### Zielsystem

-   Private Ziele zur persönlichen Verfolgung
-   Geteilte Ziele, sichtbar für Freunde
-   Globale Ziele für die Community-Teilnahme
-   Fortschrittsverfolgung und Aktualisierungen
-   Kanban-Board für übersichtliche Zielverwaltung

### Soziale Funktionen

-   Freundschaftsanfragen und -verwaltung
-   Echtzeit-Benachrichtigungssystem
-   Zielreaktionen und Interaktionen
-   Zeitleiste der persönlichen Entwicklung

### Administrative Funktionen

-   Erweiterte Benutzerkontoverwaltung
-   Erstellung und Verwaltung globaler Ziele
-   Detaillierte Systemüberwachung und Statistiken
-   Nutzungsanalysen und Wachstumstrends

### Datenschutz & Sicherheit

-   Cookie-Verwaltung mit anpassbarem Banner
-   Detaillierte Datenschutzeinstellungen
-   Verschlüsselte Datenspeicherung
-   Sichere Authentifizierung

## Mitwirkende

-   Luke
-   Sönke
-   Jean-Luc
-   Arman

## Lizenz

Dieses Projekt ist unter der ISC-Lizenz lizenziert.
