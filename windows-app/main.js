const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let win;
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.setAppUserModelId('com.helpbook.register');

  function create() {
    win = new BrowserWindow({
      width: 1100, height: 820, minWidth: 360, minHeight: 560,
      backgroundColor: '#f3f6f4', title: 'Household Help Register',
      icon: path.join(__dirname, 'build', 'icon.png'), autoHideMenuBar: true,
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
    });
    Menu.setApplicationMenu(null);
    win.loadFile(path.join(__dirname, 'www', 'index.html'));
    // Links to websites open in the normal browser, never inside the app window.
    win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
    win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); } });
    win.on('closed', () => { win = null; });
  }
  app.whenReady().then(create);
  app.on('window-all-closed', () => app.quit());
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) create(); });
}
