const headers = [
    { text: '市', value: '市' },
    { text: '入院', value: '入院' },
    { text: '退院', value: '退院' },
    { text: '累計患者数', value: '累計患者数' }
  ]
  
  type DataType = {
      市: string
      入院: number 
      退院: number 
      累計患者数: number
  }
  
  type TableDataType = {
      市: DataType['市']
      入院: DataType['入院']
      退院: DataType['退院']
      累計患者数: DataType['累計患者数']
  }
  
  type TableDateType = {
    headers: typeof headers
    datasets: TableDataType[]
  }
  
  /**
   * Format for DataTable component
   *
   * @param data - Raw data
   */
  export default (data: DataType[]) => {
    const tableDate: TableDateType = {
      headers,
      datasets: []
    }
    data.forEach(d => {
      const TableRow: TableDataType = {
          市: d['市'],
          入院: d['入院'], 
          退院: d['退院'],
          累計患者数: d['累計患者数']
      }
      tableDate.datasets.push(TableRow)
    })
    tableDate.datasets.sort((a, b) => (a === b ? 0 : a < b ? 1 : -1))
    return tableDate
  }
  