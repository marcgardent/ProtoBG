const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path"); 

let mainWindow


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload:  path.join(__dirname, `/preload.js`) 
    }
  })

  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/dist/index.html`),
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
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on("minimize", (event, args) => { BrowserWindow?.getFocusedWindow()?.minimize();})
ipcMain.on("maximize", (event, args) => { BrowserWindow?.getFocusedWindow()?.maximize();})
ipcMain.on("unmaximize", (event, args) => { BrowserWindow?.getFocusedWindow()?.unmaximize();})
ipcMain.on("close", (event, args) => {
  console.log("close");
   BrowserWindow?.getFocusedWindow()?.close();
   BrowserWindow?.getFocusedWindow()?.destroy();})
