const { contextBridge, dialog } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  showOpenDialog: (properties) => dialog.showOpenDialog({ properties }) // 将方法暴露给渲染器。注意：最好限制暴露的方法和参数。
});