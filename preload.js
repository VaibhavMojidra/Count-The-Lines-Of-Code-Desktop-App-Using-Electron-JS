const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('vaibhavmojidraAPI', {
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    getAllFilesList: path => ipcRenderer.invoke('getAllFilesList', path),
    getLineCount: path => ipcRenderer.invoke('getLineCount', path)
})