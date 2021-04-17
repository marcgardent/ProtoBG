const { contextBridge, ipcRenderer, app} = require('electron')

contextBridge.exposeInMainWorld('windowManager', {
    isMaximized: (setter) => { ipcRenderer.on("isMaximized", (event, value) => setter(value));},
    minimize: () => { ipcRenderer.send("minimize");},
    maximize: () =>{ ipcRenderer.send("maximize");},
    unmaximize: () => { ipcRenderer.send("unmaximize");},
    close: () => { ipcRenderer.send("close");},
    version: () => { return app.getVersion(); }
})

contextBridge.exposeInMainWorld('fileManager', {
    folderChanged: (setter) => { ipcRenderer.on("folderChanged", (event, value) => setter(value)); },
    dumpLoaded: (setter) => { ipcRenderer.on("dumpLoaded", (event, value) => setter(value)); },
    loadDump: () => { ipcRenderer.send("loadDump");},
    reloadDump: () => { ipcRenderer.send("reloadDump");},
    saveDump: (value) => { ipcRenderer.send("saveDump", value);},
});
