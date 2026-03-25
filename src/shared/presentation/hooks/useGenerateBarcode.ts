import BwipJs from 'bwip-js';
interface Props {
    barcode: string,
    scale?: number,
    height?: number,
    includetext?: boolean,
    textxoffset?: number,
    textxalign?: "center" | "offleft" | "left" | "right" | "offright" | "justify" | undefined,
}
const useGenerateBarcode = () => {
    const definitionBcid = (barcode:string):string=> {
      switch(barcode.length){
        case 13: 
          return 'ean13';
        default:
          return 'code128'
      }
    }
    const generateBarcode = ({barcode, height, includetext, scale, textxalign}:Props) => {
      try {
        let canvas = document.createElement('canvas');
        BwipJs.toCanvas(canvas, {
          bcid: definitionBcid(barcode), // Tipo de código de barras
          text: barcode, // Valor del código
          scale: scale, // Resolución
          height: height, // Altura del código
          includetext: includetext, // Mostrar texto debajo
          textxalign: textxalign,
        });
        return canvas.toDataURL('image/png');
      } catch (e) {
        console.error("Error generando barcode:", e);
        return null;
      }
    };
    return {
        generateBarcode
    }
}

export { useGenerateBarcode };
