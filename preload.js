const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('windowManager', {
    isMaximized: (setter) => { ipcRenderer.on("isMaximized", (event, value) => setter(value));},
    minimize: () => { ipcRenderer.send("minimize");},
    maximize: () =>{ ipcRenderer.send("maximize");},
    unmaximize: () => { ipcRenderer.send("unmaximize");},
    close: () => { ipcRenderer.send("close");},
})
