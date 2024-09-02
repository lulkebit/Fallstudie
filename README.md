# Fallstudie

Hier folgt die beschreibung unseres Projektes <br>
Das Projekt verwendet `live-server` für die lokale Entwicklung und `tailwindcss` für die Erstellung von CSS-Stilen.

## Inhaltsverzeichnis

-   [Installation](#installation)
-   [Entwicklungsserver starten](#entwicklungsserver-starten)
-   [Tailwind CSS konfigurieren](#tailwind-css-konfigurieren)
-   [Projektstruktur](#projektstruktur)
-   [Beitragen](#beitragen)
-   [Autoren](#autoren)

## Installation

Stelle sicher, dass Node.js und npm auf deinem Rechner installiert sind. Du kannst die neueste Version von Node.js [hier](https://nodejs.org/) herunterladen.

1. Klone das Repository:

    ```sh
    git clone https://github.com/lulkebit/Fallstudie.git
    cd fallstudie
    ```

2. Installiere die Abhängigkeiten:
    ```sh
    npm install
    ```

## Entwicklungsserver starten

Um den Entwicklungsserver zu starten, verwende den folgenden Befehl:

```sh
npm start
```

Dies startet `live-server` und überwacht die Dateien im `src`-Verzeichnis. Änderungen an den Dateien werden automatisch im Browser aktualisiert.

## Tailwind CSS konfigurieren

Tailwind CSS ist bereits in diesem Projekt konfiguriert. Die Konfiguration befindet sich in der Datei `tailwind.config.js`. Die wichtigsten Einstellungen sind:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,php}'],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

Um die CSS-Datei zu erstellen, führe den folgenden Befehl aus:

```sh
npm run build:css
```

Dies generiert die Datei `style.css` basierend auf den Anweisungen in `tailwind.css`.

## Projektstruktur

Hier ist eine Übersicht der Projektstruktur:

```
.gitignore
package.json
README.md
src/
    css/
        style.css
        tailwind.css
    index.html
    js/
        index.js
    php/
        index.php
tailwind.config.js
```

-   `src/`: Enthält alle Quellcodedateien.
    -   `css/`: Enthält die CSS-Dateien.
        -   `style.css`: Generierte Datei, die die Tailwind CSS-Stile enthält.
        -   `tailwind.css`: Quelle für Tailwind CSS.
    -   `index.html`: Haupt-HTML-Datei.
    -   `js/`: Enthält JavaScript-Dateien.
        -   `index.js`: Haupt-JavaScript-Datei.
    -   `php/`: Enthält PHP-Dateien.
        -   `index.php`: Beispiel-PHP-Datei.
-   `tailwind.config.js`: Konfigurationsdatei für Tailwind CSS.
-   `package.json`: Enthält Projektinformationen und Skripte.

## Beitragen

Wenn du zu diesem Projekt beitragen möchtest, folge bitte diesen Schritten:

1. Forke das Repository.
2. Führe deine Änderungen durch und committe sie:
    ```sh
    git commit -am 'Beschreibe hier kurz deine änderung'
    ```
3. Pushe deine Änderungen direkt zur `main`-Branch:
    ```sh
    git push origin main
    ```

## Autoren

-   Luke
-   Sönke
-   Jean-Luc
-   Arman
