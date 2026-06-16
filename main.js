process.env.ELECTRON = 'true';

// Start the Express server
import './server.js';

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    title: 'ExpPack - Global & Yerel Paket Yöneticisi',
    backgroundColor: '#0b0f19',
    autoHideMenuBar: true, // Hide menu bar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:4200');

  // Handle link clicks to open in user's default browser instead of Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost:4200')) {
      return { action: 'allow' };
    }
    // Open external links in default browser
    import('open').then(({ default: open }) => {
      open(url);
    });
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
