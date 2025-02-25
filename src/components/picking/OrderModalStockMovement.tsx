"use client";
import Cookies from 'js-cookie'

interface IncrementProps {
    isOpen: boolean;
    onClose: () => void;
    selectedId: number | null;
    fatherSku: string | null;
    receivedAmount: number;
    totalAmount: number;
    fetchOrder: () => Promise<void>;

}
import { Button, Input, Modal, Flex, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import axios from "axios";
import useFetchData from "@/hooks/fetchData";

import { useEffect, useState } from "react";
import ItemLocationStockStoreItem from "@/types/stores/itemLocationStocks/ItemLocationStocks";


const OrderModalStockMovement: React.FC<IncrementProps> = ({
    isOpen,
    onClose,
    selectedId,
    fatherSku,
    receivedAmount,
    totalAmount,
    fetchOrder
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
    const [select, setSelect] = useState<ItemLocationStockStoreItem[]>([]);
    const [stock, setStock] = useState<number>(0);
    const [selectedValue, setSelectedValue] = useState<number>(0)// Estado de error
    const {data: stockLocations, totalPages, isLoading, error,} = useFetchData<ItemLocationStockStoreItem>({
        url: `${apiUrl}/item_stock_location`,
        page: 0,
        limit: 50,
        params: { "main_sku": fatherSku }
    });

    useEffect(() => {
        setSelect(stockLocations);
        setStock(stockLocations[0]?.Stock ?? 0)
    }, [stockLocations]);

    useEffect(() => {
        if (isOpen) {
            setInputValue("")
            setStock(0)
        }
    }, [isOpen]);



    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.target.value
        const [num1, num2] = event.target.value.split('|').map(Number);
        setStock(num2)
        setSelectedValue(num1);
      };
      const stockMoves = async () => {
        if (selectedId === null || inputValue === "") return;
        const token = Cookies.get("erp_token");
        let inputValueNumber = Number(inputValue)
        let body = {
            productSku: fatherSku,
            beforeStoreLocationId:selectedValue,
            aftherStoreLocationId:86,
            stock:parseInt(inputValue),
        };

        if (inputValueNumber < 0) {
            body.beforeStoreLocationId = 86
            body.aftherStoreLocationId = selectedValue
            
        }
        let requestBody = { data: [body] };
        axios.patch(`${apiUrl}/item_stock_location/stockMovement`, requestBody, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            if (response.status === 202) {
                fetchOrder()
            }
        });
    }

    const incrementReceived = async () => {
        if (selectedId === null || inputValue === "") return;
        const token = Cookies.get("erp_token");
        const inputValueNumber = Number(inputValue)
        let newReceivedAmount = 0;
        let endpoint = ""
        if (inputValueNumber > 0) {
            newReceivedAmount = inputValueNumber
            endpoint = "/add"
        } else {
            newReceivedAmount = inputValueNumber * -1
            endpoint = "/remove"
        }


        axios.patch(`${apiUrl}/order/orderLines${endpoint}`, {
            data: [{
                id: selectedId,
                recived_quantity: newReceivedAmount,
            }],
        }, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            if (response.status === 202) {
                stockMoves()
            }
        }).catch((error) => {
            console.error("Error incrementando la cantidad recibida:", error);
        }).finally(() => {
            onClose();
        });


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
                    <Flex justifyContent="space-between"  direction={{ base: "column", md: "row" }}>
                    <Input
                    my={2}
                        type="number"
                        min="1"
                        width={{ base: "100%", md: "50%" }}
                        value={inputValue}
                        placeholder="Ingrese la cantidad"
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    <Text my={2}> Stock disponible: {stock}</Text>

                    </Flex>
                    <Flex my={4}  justifyContent="space-between" alignItems="center">
                    <select id="framework-select" value={selectedValue+"|"+stock} onChange={handleChange} defaultValue={selectedValue+"|"+stock}>
                    <option value={0}>{"No seleccionado"}</option>
                        {
                            select && select.length > 0 && select.map((location) => (
                                <option key={location?.ID+"|"+location?.Stock} value={location?.StoreLocationID+"|"+location?.Stock}>{location?.StoreLocations?.Code ?? ""}</option>
                            ))
                        }

                    </select>

                    </Flex>

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
export default OrderModalStockMovement
