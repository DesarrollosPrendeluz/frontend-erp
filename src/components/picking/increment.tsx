"use client";

interface IncrementProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: number | null;
  receivedAmount: number;
  totalAmount: number;
  fetchOrder: () => Promise<void>;

}
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const Increment: React.FC<IncrementProps> = ({
  isOpen,
  onClose,
  selectedId,
  receivedAmount,
  totalAmount,
  fetchOrder
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  useEffect(() => {
    if (isOpen) {
      setInputValue("")
    }
  }, [isOpen])

  const incrementReceived = async () => {
    if (selectedId === null || inputValue === "") return;
    const token = document.cookie.split("=")[1];
    const inputValueNumber = Number(inputValue)
    const newReceivedAmount = receivedAmount + inputValueNumber
    if (newReceivedAmount > totalAmount) {
      console.error("La cantidad recibida excede el total")
      return;
    }
    try {
      const response = await axios.patch(`${apiUrl}/order/orderLines`, {
        data: [{
          id: selectedId,
          recived_quantity: newReceivedAmount,
        }],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 202) {
        await fetchOrder();
      }
    } catch (err) {
      console.error("Error incrementando la cantidad recibida:", err);
    } finally {
      onClose();
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={4} mt={6}>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="number"
            min="1"
            value={inputValue}
            placeholder="Ingrese la cantidad"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={incrementReceived}>
            Confirmar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default Increment
