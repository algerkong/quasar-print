/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

export const getPrintList = async (win: BrowserWindow) => {
  try {
    const printList = await win.webContents.getPrintersAsync();
    return printList;
  } catch (error) {
    console.error('获取打印列表失败', error);
    return [];
  }
};

export const printHandle = (mainWindow: BrowserWindow) => {
  ipcMain.handle('get-print-list', async () => {
    const printList = await getPrintList(mainWindow as BrowserWindow);
    return printList;
  });

  ipcMain.handle('print-html', async (event, { printText, printerName }) => {
    let tempPath = '';
    let printWindow: any = null;
    try {
      const fileExtension = '.html';
      tempPath = path.resolve(
        `./files/print-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${fileExtension}`,
      );
      console.log('tempPath', tempPath);

      await fs.writeFile(tempPath, printText);
      await fs.access(tempPath);

      const windowOptions = {
        title: '打印页',
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webSecurity: false,
          enableRemoteModule: true,
        },
      };
      printWindow = new BrowserWindow(windowOptions);
      printWindow.loadFile(tempPath);
      printWindow.webContents.openDevTools();

      printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print(
          { silent: true, printBackground: true, deviceName: printerName },
          (success: any, errorType: any) => {
            if (success) {
              console.log('打印成功');
              event.sender.send('print-success');
              // 关闭窗口
              printWindow.close();
              fs.unlink(tempPath);
            } else {
              console.error('打印失败:', errorType);
              event.sender.send('print-failure', errorType);
            }
          },
        );
      });
    } catch (error) {
      console.error('打印文件时出错:', error);
      return { success: false, error: error };
    }
  });

  ipcMain.handle(
    'print-data',
    async (event, { printerName, printUrl, printData }) => {
      let printWindow: any = null;
      try {
        const currentDir = fileURLToPath(new URL('.', import.meta.url));
        const windowOptions = {
          title: '打印页',
          show: false,
          useContentSize: true,
          webPreferences: {
            contextIsolation: true,
            preload: path.resolve(
              currentDir,
              path.join(
                process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
                'electron-preload' +
                  process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
              ),
            ),
          },
        };
        printWindow = new BrowserWindow(windowOptions);
        printWindow.loadURL(encodeURI(printUrl));
        if (process.env.DEV) {
          printWindow.loadURL(process.env.APP_URL);
        } else {
          printWindow.loadFile('index.html');
        }
        const awaitMsg = (key:string) => {
          return new Promise(async (resolve) => {
            ipcMain.on(key, () => {
              resolve('ok');
            });
          });
        };

        await  printWindow.webContents.on('did-finish-load', () => {
          setTimeout(() => {
            printWindow.webContents.send('to-print', printData);
          }, 1000);
        })
        await awaitMsg('print-load');
        printWindow.webContents.send('print-data', printData);
        await awaitMsg('print-start');
        printWindow.webContents.print(
          { silent: true, printBackground: true, deviceName: printerName },
          (success: any, errorType: any) => {
            if (success) {
              console.log('打印成功');
              event.sender.send('print-success');
            } else {
              console.error('打印失败:', errorType);
              event.sender.send('print-failure', errorType);
            }
            printWindow.close();
          },
        );
      } catch (error) {
        console.error('打印文件时出错:', error);
        printWindow.close();
        return { success: false, error: error };
      }
    },
  );
};
