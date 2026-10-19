import { app, BrowserWindow, shell } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

// Register deep link protocol kwachatrack:// for OAuth & password recovery
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('kwachatrack', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('kwachatrack');
}

function handleDeepLink(url: string) {
  if (!mainWindow || !url) return;
  // If URL has access_token or code, pass into renderer window
  if (url.includes('login-callback') || url.includes('access_token') || url.includes('type=recovery')) {
    const hash = url.includes('#') ? url.substring(url.indexOf('#')) : '';
    const query = url.includes('?') ? url.substring(url.indexOf('?')) : '';
    mainWindow.webContents.executeJavaScript(`
      if (window.location) {
        window.location.hash = '${hash}';
      }
    `);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 640,
    title: 'KwachaTrack — Personal Finance Management',
    backgroundColor: '#FAF9F5',
    icon: path.join(__dirname, '../public/images/kwachatrack-logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single instance lock for Windows deep linking
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // Deep linking URL for Windows is in commandLine args
    const deepLinkUrl = commandLine.find(arg => arg.startsWith('kwachatrack://'));
    if (deepLinkUrl) {
      handleDeepLink(deepLinkUrl);
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

// macOS deep linking
app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
