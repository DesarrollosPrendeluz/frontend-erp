"use client";
import React from "react"
import { Grid, GridItem, Center } from "@chakra-ui/react"
import OrderStatistics from "@/components/stadistics/OrderStats"
import EmployeeStats from "@/components/stadistics/Employee";

const StadisticsPanel = () => {
  return (
    <Center p={4}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <GridItem>
          <OrderStatistics />
        </GridItem>
      </Grid>
    </Center>
  );
}

export default StadisticsPanel;
