import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'
interface NavItem {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {

  const handleLogout = (): void => {
    // Eliminar la cookie erp_token
    document.cookie = "erp_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Asegurarse de que router solo se usa en el cliente
    window.location.href = "/login";

  };

  return (
    <Box bg="gray.700" px={4} mb={6}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <NextLink href="/dashboard" passHref>
          <Box color="white" fontWeight="bold" fontSize="lg">
            Menu
          </Box>
        </NextLink>

        <Flex alignItems={"center"} justifyContent={"center"} flex={1}>
          <NextLink href="/dashboard/store" passHref>
            <Box
              px={4}
              color="gray.300"
              fontWeight="bold"
              _hover={{ color: "gray.100", textDecoration: "underline" }}
            >
              Stock
            </Box>
          </NextLink>
          <NextLink href="/dashboard/order" passHref>
            <Box
              px={4}
              color="gray.300"
              fontWeight="bold"
              _hover={{ color: "gray.100", textDecoration: "underline" }}
            >
              Pedidos
            </Box>
          </NextLink>
          <NextLink href="/dashboard/panel" passHref>
            <Box
              px={4}
              color="gray.300"
              fontWeight="bold"
              _hover={{ color: "gray.100", textDecoration: "underline" }}
            >
              Panel Stats
            </Box>
          </NextLink>
        </Flex>
        <Button ml={4} colorScheme="yellow" variant="outline" onClick={handleLogout}>
          Salir
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
