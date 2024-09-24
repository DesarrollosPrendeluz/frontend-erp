"use client"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading, List, ListItem, Text } from '@chakra-ui/react';
import Pagination from '@/components/Pagination';
import useFetchData from '@/hooks/fetchData';
import React from 'react'
import { useState } from 'react'

interface OrderItems {
    OrderCode: string;
    items: []
}


const Orders = () => {
    var apiUrl = 'http://localhost:8080/'
    const [currentPage, setCurrentPage] = useState(1);
    const { data: orders, totalPages, isLoading, error } = useFetchData<OrderItems>({
        url: apiUrl + 'order',
        page: currentPage,
        limit: 2,
    });


    return (
        <Box maxW="1200px" mx="auto" mt={8} p={4}>
            <Heading>Pedidos</Heading>
            <Accordion allowMultiple>

                {Object.keys(orders).map((order) => (
                    <AccordionItem key={order}>
                        <AccordionButton>
                            <Box flex={1} textAlign={"left"} fontWeight="bold">{order}</Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <List spacing={3}>
                                {orders[order].map((item: { Sku: string; Amount: number }) => (
                                    <ListItem key={item.Sku}>
                                        <Text>{item.Sku}</Text>
                                        <Text>{item.Amount}</Text>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

        </Box>
    );
}

export default Orders
