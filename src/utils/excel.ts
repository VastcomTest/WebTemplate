/* 读取文件 */

import * as XLSX from 'xlsx'

export const readFile = (file:Blob) => {
  return new Promise(resolve => {
      let reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = ev => {
          resolve(ev.target?.result)
      }
  })
}

export class ExcelUtil{
  static export_excel(excelData:any, fileName:string) {
    try {
      // insert data to table
      const data = XLSX.utils.json_to_sheet(excelData);
      // create work book
      const wb = XLSX.utils.book_new();
      // Append a worksheet to a workbook
      XLSX.utils.book_append_sheet(wb, data, "data");
      // generated doc and download
      XLSX.writeFile(wb, fileName + ".xlsx");
    } catch (error) {
      console.log(error);
      return false
    }
    return true
  }

  static async importData<T>(file:File):Promise<T>{
    let dataBinary = await readFile(file);
    let workBook = XLSX.read(dataBinary, { type: "binary", cellDates: true });
    let workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(workSheet);
    return data as unknown as T
  }
}
