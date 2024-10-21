import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (channel: string, data: unknown) => {
    ipcRenderer.send(channel, data);
  },
  receiveMessage: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  invokeMessage: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
});
