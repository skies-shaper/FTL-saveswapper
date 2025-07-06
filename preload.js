const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI', {
    onReceivedSaves : (callback) => ipcRenderer.on('savelist', (_event, value) => callback(value)),
    onLoadedIn : (callback) => ipcRenderer.on('loadedIn', (_event, value) => callback(value)),
    onGotFTLLocation : (callback) => ipcRenderer.on('locdetected', (_event, value) => callback(value)),
    onGetMessage : (callback) => ipcRenderer.on('message', (_event, value) => callback(value)),

    loadSave : (id, runApp)=>{
      ipcRenderer.send("loadSave", id, runApp)
    },
    getSavesList : ()=>{
        ipcRenderer.send("getSaves")
    },
    fireFetchNew :(fileName)=>{
      ipcRenderer.send("fetchNew", fileName)
    },
    getFTLLocation : ()=>{
      ipcRenderer.send("getFTLloc")
    },
    reloadFTLlocation : ()=>{
      ipcRenderer.send("reloadFTLloc")
    },
    refreshSave : (id)=>{
      ipcRenderer.send("reload", id)
    },
    deleteSave : (id)=>{
      ipcRenderer.send("remove", id)
    }
  })

//   onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value))