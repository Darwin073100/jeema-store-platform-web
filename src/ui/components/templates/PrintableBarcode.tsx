import React from 'react'
import Barcode from 'react-barcode'

const PrintableBarcode = ({code}:{code: string}) => {
  return (
    <div>
      <Barcode 
        value={code} 
        width={1} 
        height={50} 
        fontSize={16}/>
    </div>
  )
}

export default PrintableBarcode
