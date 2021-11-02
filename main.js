const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs').promises;
const { autoUpdater } = require('electron-updater');
const glob = require("glob");

//const args = process.argv.slice(1), serve = args.some(val => val === '--serve');
const serve = true;

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
  if (serve) {
    mainWindow.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    mainWindow.loadURL('http://localhost:4200');
  }
  else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
  }

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
let TheFolderPath;

function openFolder() {
  return dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    if (!result.canceled) {
      console.debug("folders selected", result.filePaths);
      if (result.filePaths.length == 1) {
        TheFolderPath = result.filePaths[0];
        mainWindow.webContents.send("folderChanged", TheFolderPath);
        return TheFolderPath;
      }
      else {
        console.warn("select only on folder", result.filePaths);
        throw "select only on folder";
      }
    }
  })
}

function saveDump(payload) {
  if (TheFolderPath !== undefined) {
    const filePath = path.join(TheFolderPath, ".blueprint");
    fs.writeFile(filePath, payload, 'utf-8').catch((e) => {
      console.error("Can't save the file", e);
    });
  }
  else {
    console.error("Can't save the file", "Folder not selected");
  }
}

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })
  return arrayOfFiles
}

function loadDump() {
  if (TheFolderPath !== undefined) {
    const filePath = path.join(TheFolderPath, ".blueprint");
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

function loadFromTheFolder() {
  if (TheFolderPath !== undefined) {

    glob(TheFolderPath + "/**/*.yml", function (er, files) {
      const promises = [];
      for (let file_path of files) {
        promises.push(
          fs.readFile(file_path, 'utf8').then(payload=> {
            return {
              name: path.relative(TheFolderPath, file_path).replace("\\", "/"),
              content: payload,
              type: "glossary"
            }
        }));
      }
      Promise.all(promises).then(resources=> {
        if (resources.length > 0) {
          const workspace = {
            saved: new Date().toUTCString(),
            currentResource: resources[0].name,
            resources: resources
          }
          mainWindow.webContents.send("dumpLoaded", workspace);
        } else {
          console.error("Can't load the folder", "Folder is empty");
        }
      });

    });
  } else {
    console.error("Can't load the folder", "Folder not selected");
  }
}

ipcMain.on("saveDump", (event, payload) => {
  if (TheFolderPath !== undefined) {
    saveDump(payload);
  }
  else {
    openFolder().then(result => {
      saveDump(payload);
    })
  }
});

ipcMain.on("loadDump", (event, args) => {
  openFolder().then(() => { loadFromTheFolder() });
});

ipcMain.on("reloadDump", (event, args) => {
  loadFromTheFolder();
});
