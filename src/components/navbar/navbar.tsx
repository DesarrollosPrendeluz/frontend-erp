import React, { useState } from "react";
import NextLink from "next/link";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
interface NavItem {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  return (
    <Box bg="gray.700" px={4} mb={6}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Box color="white" fontWeight="bold" fontSize="lg">
          Dashboard
        </Box>
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
        </Flex>
        <Button ml={4} colorScheme="gray" variant="outline">
          Sign In
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
