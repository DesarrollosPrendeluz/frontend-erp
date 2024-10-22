"use client";

import Navbar from "@/components/navbar/navbar";
import React from "react";
import { Box, Flex } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box flex="1" p={{ base: 6, md: 12 }} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
