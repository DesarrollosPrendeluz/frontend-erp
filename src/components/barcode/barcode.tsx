import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Box, Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { jsPDF } from 'jspdf';

import { ZebraPrinterManager, ZebraPrinter } from '../printer/ZebraPrinter';

export interface OrderLineLabelProps {
  label: {
    brand: string;
    brandAddress: string;
    brandEmail: string;
    ean: string;
    asin: string;
  };
  isOpen: boolean;
  onClose: () => void;
}


const OrderLineLabel: React.FC<OrderLineLabelProps> = ({ label, isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const barcodeRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<ZebraPrinter | null>(null);


  useEffect(() => {
    const generateBarcode = () => {
      if (isOpen && label.ean && barcodeRef.current) {
        setIsGenerating(true);
        try {
          JsBarcode(barcodeRef.current, label.ean, {
            format: 'CODE128',
            displayValue: true,
            lineColor: "#000",
            width: 2,
            height: 50,
            margin: 10,
          });
        } catch (error) {
          console.error("Error generando la etiqueta", error);
        } finally {
          setIsGenerating(false);
        }
      }
    };
    generateBarcode();
  }, [isOpen, label.ean]);


  const handleZebra = () => {
    if (selectedPrinter) {
      const zpl = `
        ^XA
        ^FO50,50^A0,25,25^FDMarca: ${label.brand}^FS
        ^FO50,80^A0,25,25^FDDirección: ${label.brandAddress}^FS
        ^FO50,110^A0,25,25^FDE-Mail: ${label.brandEmail}^FS
        ^FO50,140^A0,25,25^FDASIN: ${label.asin}^FS
        ^FO50,180^BY3^BCN,100,Y,N,N^FD${label.ean}^FS
        ^XZ
      `;
      selectedPrinter.connection.send(zpl,
        () => console.log("Impresión exitosa"),
        (error: any) => console.error("Error de impresión:", error)
      );
    }
  };





  const handlePrint = () => {
    if (barcodeRef.current) {
      const pdf = new jsPDF('p', 'mm', 'a5'); // Creamos un PDF en tamaño A5
      const zpl = `
      ^XA
      ^FO50,50^A0,25,25^FDMarca: ${label.brand}^FS
      ^FO50,80^A0,25,25^FDDirección: ${label.brandAddress}^FS
      ^FO50,110^A0,25,25^FDE-Mail: ${label.brandEmail}^FS
      ^FO50,140^A0,25,25^FDASIN: ${label.asin}^FS
      ^FO50,180^BY3^BCN,100,Y,N,N^FD${label.ean}^FS
      ^XZ
    `;
      // Añadimos el contenido textual
      pdf.setFontSize(14);
      pdf.text(label.brand, 10, 20);
      pdf.setFontSize(10);
      pdf.text(`Dirección: ${label.brandAddress}`, 10, 30);
      pdf.text(`E-Mail: ${label.brandEmail}`, 10, 40);
      pdf.text(`ASIN: ${label.asin}`, 10, 50);

      const barcodeImage = barcodeRef.current.toDataURL("image/png");
      pdf.addImage(barcodeImage, 'PNG', 10, 60, 100, 30);

      pdf.autoPrint();

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      if (iframeRef.current) {
        iframeRef.current.src = pdfUrl;
        iframeRef.current.onload = () => {
          iframeRef.current?.contentWindow?.print();
        };
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Etiqueta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ZebraPrinterManager onPrinterReady={(printer: ZebraPrinter) => setSelectedPrinter(printer)} />
          <Box p={4} bg="white">
            <Text fontWeight="bold" mb={2}>{label.brand}</Text>
            <Text fontSize="sm">Dirección: {label.brandAddress}</Text>
            <Text fontSize="sm">E-Mail: {label.brandEmail}</Text>
            <Center mt={4}>
              {isGenerating ? (
                <Text>Generando código de barras...</Text>
              ) : (
                <canvas ref={barcodeRef} />
              )}
            </Center>
            <Text fontSize="sm" mt={2}>ASIN: {"Prueba"}</Text>
          </Box>

          <Center mt={4}>
            <Button onClick={handleZebra} colorScheme="blue">Imprimir Etiqueta</Button>
          </Center>
        </ModalBody>
      </ModalContent>

      <iframe ref={iframeRef} style={{ display: 'none' }} title="pdf-iframe" />
    </Modal>
  );
};

export default OrderLineLabel;

