import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Box, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text } from '@chakra-ui/react';

export interface OrderLineLabelProps {
  label: {
    brand: string;
    brandAddress: string;
    brandEmail: string;
    ean: string;
    asin: string;
  }
  isOpen: boolean;
  onClose: () => void;
}


const OrderLineLabel: React.FC<OrderLineLabelProps> = ({ label, isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateBarcode = () => {
      if (isOpen && label.ean) {

        setIsGenerating(true);

        if (barcodeRef.current) {

          JsBarcode(barcodeRef.current, label.ean, {
            format: 'CODE128',
            displayValue: true,
            lineColor: "#000",
            width: 2,
            height: 50,
            margin: 10,
          });
        }
        setIsGenerating(false);
      }
    };
    generateBarcode()
  }, [isOpen, label.ean]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Etiqueta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb={2}>{label.brand}</Text>
          <Text fontSize="sm">Direción{label.brandAddress}</Text>
          <Text fontSize="sm">E-Mail{label.brandEmail}</Text>
          <Center mt={4}>
            {isGenerating ? (
              <Spinner size="xl" />
            ) : (
              <canvas ref={barcodeRef} />
            )}
          </Center>


          <Text fontSize="sm" mt={2}>ASIN: {label.asin}</Text>
        </ModalBody>
      </ModalContent>
    </Modal >
  );
};

export default OrderLineLabel;

