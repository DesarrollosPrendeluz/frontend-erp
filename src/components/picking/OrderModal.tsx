"use client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, Tbody, Td, Th, Thead, Tr, } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import React from "react";
import {ChildOrder} from "@/types/fatherOrders/FatherOrders"
import ProgressBar from "@/components/progressbar/ProgressBar";
import Select from "@/components/select/select";


interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: ChildOrder[]
  //deficits: any[];
}

const OrderModal: React.FC<BasicModalProps> = ({  isOpen, onClose, orders }) => {

  const token =     Cookies.get("erp_token");
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

  return (
    <Modal  isOpen={isOpen} onClose={onClose} isCentered >
      <ModalOverlay />
      <ModalContent maxW={"1200"}>
        <ModalHeader>Órdenes de compra</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Table>
                <Thead>
                <Tr key={"head-order-modal-table"}>
                    <Th>Codigo</Th>
                    <Th>Status</Th>
                    <Th>Cantidad</Th>
                </Tr>
                </Thead>
                <Tbody>
                {orders.map((order:ChildOrder) => (
                    <Tr key={order.code+"-"+order.id}>
                        <Td>{order.code}</Td>
                        <Td><Select orderId={order.id} status={order.status} statusId={order.status_id} father={false}/></Td>
                        <Td><ProgressBar total={order.quantity} completed={order.recived_quantity} /></Td>
                    </Tr>
                ))}
                
                </Tbody>
            </Table>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderModal;
