const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs').promises;
const { autoUpdater } = require('electron-updater');

let mainWindow
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, `/preload.js`)
    }
  })

  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/www/index.html`),
  //     protocol: "file:",
  //     slashes: true
  //   })
  // );

  mainWindow.loadURL(
    "http://localhost:4200" //[DEBUG WITH VSCODE] use angular's endpoint
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools() //[DEBUG WITH VSCODE] the VS debugger attach to devtools and not to the page!

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.removeMenu()

  mainWindow.maximize()
  mainWindow.on("maximize", () => { mainWindow.webContents.send("isMaximized", true) });
  mainWindow.on("unmaximize", () => { mainWindow.webContents.send("isMaximized", false) });
  mainWindow.once('ready-to-show', () => { autoUpdater.checkForUpdatesAndNotify(); });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on("minimize", (event, args) => { BrowserWindow?.getFocusedWindow()?.minimize(); })
ipcMain.on("maximize", (event, args) => { BrowserWindow?.getFocusedWindow()?.maximize(); })
ipcMain.on("unmaximize", (event, args) => { BrowserWindow?.getFocusedWindow()?.unmaximize(); })
ipcMain.on("close", (event, args) => { BrowserWindow?.getFocusedWindow()?.close(); BrowserWindow?.getFocusedWindow()?.destroy(); })

autoUpdater.on('updateAvailable', () => { mainWindow.webContents.send('updateAvailable'); });
autoUpdater.on('updateDownloaded', () => { mainWindow.webContents.send('updateDownloaded'); });
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
let folderPath;

function openFolder() {
  return dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      console.debug("folders selected", result.filePaths);
      if (result.filePaths.length == 1) {
        folderPath = result.filePaths[0];
        mainWindow.webContents.send("folderChanged", folderPath);
        return folderPath;
      }
      else {
        console.warn("select only on folder", result.filePaths);
        throw "select only on folder";
      }
    }
  })
}

function saveDump(payload) {
  if (folderPath !== undefined) {
    const filePath = path.join(folderPath, ".blueprint");
    fs.writeFile(filePath, payload, 'utf-8').catch((e) => {
      console.error("Can't save the file", e);
    });
  }
  else {
    console.error("Can't save the file", "Folder not selected");
  }
}

function loadDump() {
  if (folderPath !== undefined) {
    const filePath = path.join(folderPath, ".blueprint");
    fs.readFile(filePath, 'utf-8').then((payload) => {
      mainWindow.webContents.send("dumpLoaded", payload);
    }).catch((e) => {
      console.error("Can't save the file", e);
    });
  }
  else {
    console.error("Can't save the file", "Folder not selected");
  }
}

ipcMain.on("saveDump", (event, payload) => {
  if (folderPath !== undefined) {
    saveDump(payload);
  }
  else {
    openFolder().then(result => {
      saveDump(payload);
    })
  }
});

ipcMain.on("loadDump", (event, args) => {
  openFolder().then(() => { loadDump() });
});

ipcMain.on("reloadDump", (event, args) => {
  reloadDump();
});

