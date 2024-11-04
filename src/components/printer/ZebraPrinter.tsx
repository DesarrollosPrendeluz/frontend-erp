import { useEffect, useState } from 'react';
import { Box, Select, Text } from '@chakra-ui/react';

export interface ZebraPrinter {
  name: string;
  connection: any;
  deviceType: string;
  uid: string;
}

interface ZebraPrinterManagerProps {
  onPrinterReady: (printer: ZebraPrinter) => void;
}

const ZebraPrinterManager: React.FC<ZebraPrinterManagerProps> = ({ onPrinterReady }) => {
  const [printers, setPrinters] = useState<ZebraPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<ZebraPrinter | null>(null);

  useEffect(() => {
    const loadBrowserPrint = () => {
      const script = document.createElement("script");
      script.src = '/BrowserPrint-3.1.250.min.js';
      script.async = true;
      script.onload = initializePrinters;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    };

    const initializePrinters = () => {
      if ((window as any).BrowserPrint) {
        (window as any).BrowserPrint.getLocalDevices(
          (devices: any) => {
            const zebraPrinters = devices.filter((device: any) => device.deviceType === 'printer');
            setPrinters(zebraPrinters);
            if (zebraPrinters.length > 0) {
              setSelectedPrinter(zebraPrinters[0]);
              onPrinterReady(zebraPrinters[0]);
            }
          },
          (error: any) => console.error("Error al obtener impresoras:", error)
        );
      }
    };

    loadBrowserPrint();
  }, [onPrinterReady]);

  const handlePrinterSelect = (uid: string) => {
    const printer = printers.find((printer) => printer.uid === uid);
    setSelectedPrinter(printer || null);
    if (printer) onPrinterReady(printer);
  };

  return (
    <Box>
      <Text mb={2} fontWeight="bold">Selecciona Impresora Zebra:</Text>
      {printers.length > 0 ? (
        <Select
          placeholder="Selecciona una impresora"
          value={selectedPrinter?.uid || ""}
          onChange={(e) => handlePrinterSelect(e.target.value)}
        >
          {printers.map((printer) => (
            <option key={printer.uid} value={printer.uid}>
              {printer.name}
            </option>
          ))}
        </Select>
      ) : (
        <Text color="red.500">No se encontraron impresoras Zebra.</Text>
      )}
    </Box>
  );
};

export default ZebraPrinterManager;

