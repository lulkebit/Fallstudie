# Fallstudie

Hier folgt die beschreibung unseres Projektes <br>
Das Projekt verwendet `live-server` für die lokale Entwicklung und `tailwindcss` für die Erstellung von CSS-Stilen.

## Inhaltsverzeichnis

-   [Installation](#installation)
-   [Entwicklungsserver starten](#entwicklungsserver-starten)
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

## Projektstruktur

Hier ist eine Übersicht der Projektstruktur:

```
.gitignore
package.json
README.md
src/
    css/
        global.css
    index.html
    js/
        index.js
    php/
        index.php
tailwind.config.js
```

-   `src/`: Enthält alle Quellcodedateien.
    -   `css/`: Enthält die CSS-Dateien.
        -   `global.css`: Haupt-CSS-Datei.
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
    git commit -am 'FAL-??? (Jira Vorgangsnummer) Beschreibe hier kurz deine änderung'
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
