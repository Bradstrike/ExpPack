# ExpPack 🚀

ExpPack is a modern desktop dashboard application that detects global and local **NPM**, **Yarn**, and **NPX** packages on your computer, displays their disk locations, allows you to uninstall or reinstall them, and simplifies system **PATH** variable and **Cache** management.

Thanks to its lightweight structure, it does not consume excessive memory, launches in seconds, and accelerates your workflow.

---

## ✨ Features

* **📦 Global Package Scanner:** Lists globally installed NPM and Yarn packages, their versions, disk sizes, and CLI commands (e.g., `cmd: cline`, `cmd: gemini`) they expose to the terminal.
* **📂 Local Project Scanner:** Enter the absolute path of any Node.js project on your computer to analyze its `package.json` dependencies and local `node_modules` folder directly from the interface.
* **⚡ Smart Package Installer:** Enter just a package name (e.g., `typescript`) or paste a copied command directly (e.g., `npm install -g @google/clasp`); ExpPack automatically parses the command and initiates the installation using the appropriate package manager.
* **🖥️ Live Terminal (SSE Console):** Displays real-time terminal outputs for all package installations, updates, or removals in a simulated console on the interface (using Server-Sent Events).
* **🛣️ System PATH Management:** Lists system environment variables (PATH) paths (highlighting Node/npm/yarn paths in green) and allows you to add a new folder to the User PATH variable with a single click.
* **🧹 Cache Control:** Calculates the NPM cache size and offers one-click clearing (`npm cache clean --force`).

---

## 🛠️ Tech Stack

* **Desktop Layer:** [Electron](https://www.electronjs.org/)
* **Server Layer:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (REST APIs & Server-Sent Events)
* **Frontend (UI):** HTML5, Vanilla JavaScript, Custom CSS3 (Premium Dark Mode, Glassmorphism, Neon Glow effects, and micro-second animations)

---

## 🚀 Running and Development

Ensure that Node.js and npm are installed on your computer before running the project.

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the application in **Development Mode (Electron Interface)**:
   ```bash
   npm start
   ```

3. To start the application as a **Web Server only** and connect via a browser (`http://localhost:4200`):
   ```bash
   npm run server
   ```

---

## 📦 Distribution and Packaging

To package the application so it can run directly by double-clicking on external machines:

1. Run the following command (electron-builder will start the build process):
   ```bash
   npm run dist
   ```

2. When the build is complete, standalone Windows applications will be generated in the `dist/` directory:
   * **`dist/ExpPack 1.0.0.exe`**: Portable version. Does not require installation, runs directly.
   * **`dist/ExpPack Setup 1.0.0.exe`**: Standard installation wizard for Windows.

---

## 📄 License

This project is licensed under the **MIT** License.
