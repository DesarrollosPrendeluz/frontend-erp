"use client";

import React, { useEffect, useState } from "react";
import genericGet from "@/hooks/genericGet";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

interface RecordItem {
  itemName: string;
  ean: string;
  worker: string;
  currentTime: string;
  quantity: number;
}

interface WorkerDayStats {
  worker: string;
  date: string;
  avgTimeMinutes: number | null;
}

const CombinedStats = ({ params }: { params: { orderCode: string } }) => {
  const [stats, setStats] = useState<WorkerDayStats[]>([]);
  const [quantityData, setQuantityData] = useState<any>(null);
  const [timeChartData, setTimeChartData] = useState<any>(null);
  const [quantityTable, setQuantityTable] = useState<{ [worker: string]: { [itemKey: string]: number } }>({});

  const fetchData = async () => {
    const result = await genericGet(
      "/stadistics/lines?father_code=" + params.orderCode
    );
    if (
      result.status === 200 ||
      result.status === 201 ||
      result.status === 202
    ) {
      const data: RecordItem[] = result.body.Results.data;
      processQuantityStats(data);
      processTimeStats(data);
    }
  };

  const processQuantityStats = (data: RecordItem[]) => {
    const grouped: { [key: string]: number } = {};
    const table: { [worker: string]: { [itemKey: string]: number } } = {};

    data.forEach((item) => {
      const key = `${item.worker}-${item.ean}-${item.itemName || "SinNombre"}`;
      grouped[key] = (grouped[key] || 0) + item.quantity;

      if (!table[item.worker]) {
        table[item.worker] = {};
      }
      const itemKey = `${item.ean} ${item.itemName || "SinNombre"}`;
      table[item.worker][itemKey] = (table[item.worker][itemKey] || 0) + item.quantity;
    });

    const labels = Object.keys(grouped);
    const quantities = Object.values(grouped);

    setQuantityData({
      labels,
      datasets: [
        {
          label: "Cantidad total",
          data: quantities,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });

    setQuantityTable(table);
  };

  const processTimeStats = (data: RecordItem[]) => {
    const grouped: { [key: string]: RecordItem[] } = {};

    data.forEach((item) => {
      const date = dayjs(item.currentTime).format("YYYY-MM-DD");
      const key = `${item.worker}_${date}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    const statsArray: WorkerDayStats[] = [];

    Object.keys(grouped).forEach((key) => {
      const records = grouped[key].sort(
        (a, b) =>
          dayjs(a.currentTime).valueOf() - dayjs(b.currentTime).valueOf()
      );

      let totalDiff = 0;
      let count = 0;

      for (let i = 1; i < records.length; i++) {
        const prev = dayjs(records[i - 1].currentTime);
        const curr = dayjs(records[i].currentTime);
        totalDiff += curr.diff(prev, "second");
        count++;
      }

      statsArray.push({
        worker: records[0].worker,
        date: dayjs(records[0].currentTime).format("YYYY-MM-DD"),
        avgTimeMinutes: count > 0 ? totalDiff / count / 60 : null,
      });
    });

    setStats(statsArray);

    const workers = Array.from(new Set(statsArray.map((s) => s.worker)));
    const dates = Array.from(new Set(statsArray.map((s) => s.date))).sort();

    const datasets = workers.map((worker) => {
      const dataPerDate = dates.map((date) => {
        const stat = statsArray.find(
          (s) => s.worker === worker && s.date === date
        );
        return stat?.avgTimeMinutes || 0;
      });
      return {
        label: worker,
        data: dataPerDate,
        fill: false,
        borderColor:
          "#" +
          Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
      };
    });

    setTimeChartData({
      labels: dates,
      datasets,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box maxW="1400px" mx="auto" p={4}>
      <Heading size="lg" mb={4} textAlign="center">
        Estadísticas combinadas por trabajador
      </Heading>

      <Divider my={4} />
      <Heading size="md" mb={2}>
        Cantidades por trabajador y artículo (desplegable)
      </Heading>

      <Accordion allowMultiple>
        {Object.entries(quantityTable).map(([worker, items]) => (
          <AccordionItem key={worker}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {worker}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Table size="sm" mb={2}>
                <Thead>
                  <Tr>
                    <Th>EAN + Nombre</Th>
                    <Th>Cantidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(items).map(([itemKey, qty]) => (
                    <Tr key={itemKey}>
                      <Td>{itemKey}</Td>
                      <Td>{qty}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Divider my={8} />
      <Heading size="md" mb={2}>
        Media de tiempo entre acciones por trabajador (min/día)
      </Heading>
      <Table size="sm" mb={4}>
        <Thead>
          <Tr>
            <Th>Trabajador</Th>
            <Th>Fecha</Th>
            <Th>Media (minutos)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stats.map((s, idx) => (
            <Tr key={idx}>
              <Td>{s.worker}</Td>
              <Td>{s.date}</Td>
              <Td>
                {s.avgTimeMinutes !== null
                  ? s.avgTimeMinutes.toFixed(2)
                  : "N/A"}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {quantityData && (
        <>
          <Divider my={8} />
          <Heading size="md" mb={2}>
            Gráfico de cantidades
          </Heading>
          <Bar
            data={quantityData}
            options={{
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.raw} unidades`,
                  },
                },
              },
              scales: {
                x: { title: { display: true, text: "Cantidad" } },
                y: {
                  ticks: {
                    callback: function(val, index) {
                      const label = quantityData.labels[index];
                      return label.length > 30
                        ? label.slice(0, 30) + "..."
                        : label;
                    },
                  },
                },
              },
            }}
          />
        </>
      )}

      {timeChartData && (
        <>
          <Divider my={8} />
          <Heading size="md" mb={2}>
            Gráfico de tiempo promedio
          </Heading>
          <Line
            data={timeChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (ctx: any) =>
                      `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} min`,
                  },
                },
              },
              scales: {
                y: { title: { display: true, text: "Minutos" } },
                x: { title: { display: true, text: "Fecha" } },
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default CombinedStats;

