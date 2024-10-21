// src/hooks/PrintHook.ts
import useIndexedDB from 'src/hooks/IndexDBHook';
import { onMounted, ref } from 'vue';

interface IPrint {
  id?: number;
  printData: object;
  printTime: string;
}

const usePrintRecords = () => {
  const { initDB, addData, getAllData, deleteData } = useIndexedDB();
  const printRecords = ref();
  // 添加打印记录
  const addPrintRecord = async (record: IPrint) => {
    await addData('prints', record);
    getPrintRecords();
  };

  // 查询所有打印记录
  const getPrintRecords = async () => {
    printRecords.value = await getAllData('prints');
  };

  // 删除打印记录
  const removePrintRecord = async (id: number) => {
    await deleteData('prints', id);
    getPrintRecords();
  };

  onMounted(async ()=>{
    await initDB('my-database', 1, [
      { name: 'users', keyPath: 'id' },
      { name: 'todos', keyPath: 'id' },
      { name: 'prints', keyPath: 'id' },
    ]);
    await getPrintRecords();
  })

  const getPrinterList = async () => {
    return await window.electronAPI.invokeMessage('get-print-list');
  }
  // 处理具体打印
  const startPrint = async (printerName:string, data:object) => {
    return new Promise(async (resolve, reject) => {
      try {
        let printUrl = `${window.location.origin}/#/print/`
        if(window.location.href.includes('index.html')){
          printUrl = `${window.location.origin}/index.html#/print/`
        }
        await window.electronAPI.invokeMessage('print-data', {
          printerName,
          printUrl: printUrl,
          printData: JSON.parse(JSON.stringify(data)),
        });

        window.electronAPI.receiveMessage('print-success', () => {
          addPrintRecord({ printData: JSON.parse(JSON.stringify(data)), printTime: new Date().toLocaleString() });
          resolve(true);
        });
        window.electronAPI.receiveMessage('print-failure', () => {
          reject(false);
        });
      } catch (error) {
        reject(error);
      }
    })
  };

  return {
    printRecords,
    addPrintRecord,
    getPrintRecords,
    removePrintRecord,
    getPrinterList,
    startPrint,
  };
};

export default usePrintRecords;
