"use client";
import {
  Box,
  Button,
  Tab,
  TabList,
  Tabs,
  useDisclosure,
  useBreakpointValue,
  TabPanels,
  TabPanel
} from "@chakra-ui/react";

import React from "react";
import Stock from "@/components/store/Stock";
import StockDeficit from "@/components/store/StockDeficit";



const Store = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;
  const isVisible = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      <Tabs variant={"soft-rounded"}>
        <TabList>
          <Tab>Stock</Tab>
          <Tab>Stock Déficit</Tab>
        </TabList>
        <TabPanels>
          <TabPanel><Stock /></TabPanel>
          <TabPanel><StockDeficit /></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}


export default Store;
