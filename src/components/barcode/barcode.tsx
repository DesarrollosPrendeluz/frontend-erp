import { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Box, Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import ZebraPrinterManager, { ZebraPrinter } from '@/components/printer/ZebraPrinter';


export interface OrderLineLabelProps {
  label: {
    brand: string;
    brandAddress: string;
    brandEmail: string;
    ean: string;
    asin: string;
    company:string;
  };
  isOpen: boolean;
  onClose: () => void;
}


const OrderLineLabel: React.FC<OrderLineLabelProps> = ({ label, isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const barcodeRef = useRef<HTMLCanvasElement>(null);
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
    if (selectedPrinter && typeof selectedPrinter.send === 'function') {
      const zpl = `
                  ^XA
                  ^CI28
                  ${label.company}
                  ^FO20,5^A0,25,25^FDMarca: ${label.brand}^FS
                  ^FO20,25^A0,25,25^FDDirección: ${label.brandAddress}^FS
                  ^FO20,45^A0,25,25^FDE-Mail: ${label.brandEmail}^FS
                  ^FO20,70^BY2,2,60
                  ^BCN,50,Y,N,N^FD${label.ean}^FS
                  ^XZ
      `;
      selectedPrinter.send(zpl,
        () => console.log("Impresión exitosa"),
        (error: any) => console.error("Error de impresión:", error)
      );
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
          <Text fontWeight="bold" mb={2}>{label.company}</Text>
            <Text  mb={2}>{label.brand}</Text>
            <Text fontSize="sm">Dirección: {label.brandAddress}</Text>
            <Text fontSize="sm">E-Mail: {label.brandEmail}</Text>
            <Center mt={4}>
              {isGenerating ? (
                <Text>Generando código de barras...</Text>
              ) : (
                <canvas ref={barcodeRef} />
              )}
            </Center>
            <Text fontSize="sm" mt={2}>ASIN: {label.asin}</Text>
          </Box>

          <Center mt={4}>
            <Button onClick={handleZebra} colorScheme="blue">Imprimir Etiqueta</Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderLineLabel;

