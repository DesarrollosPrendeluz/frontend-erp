import { Button, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React from "react";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [totalPagesByCurrent, setCurrentPage] = useState(1);
  const [lastIndex, setLastIndex] = useState(0);
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  // console.log("Nº de paginas "+totalPages);
  // console.log("Nº de paginas procesado "+totalPagesByCurrent);
  useEffect(() => {
    // Ejecuta la función cuando el componente se monte
    const initializeComponent = () => {
      let pag = 10 < totalPages ? 10 : totalPages;
      setCurrentPage(pag)
    };
    initializeComponent();
    console.log("se ejecuta");
    console.log("Nº de paginas "+totalPages);
    console.log("Nº de paginas procesado "+totalPagesByCurrent);
    
  }, [totalPages, currentPage]); // El array vacío asegura que esto se ejecute solo una vez al montar
  return (
    <HStack justifyContent="center" spacing={2} mt={4}>
      <Button
        onClick={() =>{setLastIndex(currentPage); handlePageChange(currentPage - 1)}}
        disabled={currentPage === 1}
        variant="outline"
        colorScheme="gray"
        isDisabled={currentPage === 1}
      >
        <ChevronLeftIcon />
      </Button>

      {Array.from({ length: totalPagesByCurrent }, (_, index) => {
        let startingPage;
        
        if (currentPage > 1 && currentPage < totalPages) {
          // Muestra dos páginas debajo y el resto por encima, incluyendo la actual
          const lowerLimit = Math.max(1, currentPage - 2); // Asegura que no vaya por debajo de la primera página
          const upperLimit = Math.min(totalPages, lowerLimit + totalPagesByCurrent - 1); // Limita al número total de páginas

          startingPage = lowerLimit + index <= upperLimit ? lowerLimit + index : null;
        } else {
          // Si está en la primera o última página, usa la paginación normal
          startingPage = (totalPagesByCurrent + currentPage > totalPages)
            ? totalPages - totalPagesByCurrent + 1
            : currentPage;
          
          startingPage += index;
        }

        return startingPage;
      })
      .filter(page => page !== null) // Elimina páginas fuera del rango calculado
      .map((page) => (
        <Button
          key={page}
          onClick={() => { setLastIndex(currentPage); handlePageChange(page); }}
          colorScheme={currentPage === page ? "blue" : "gray"}
          variant={currentPage === page ? "solid" : "outline"}>
          {page}
        </Button>
      ))
    }


      <Button
        onClick={() => {setLastIndex(currentPage); handlePageChange(currentPage + 1)}}
        disabled={currentPage === totalPages}
        variant="outline"
        colorScheme="gray"
        isDisabled={currentPage === totalPages}
      >
        <ChevronRightIcon />
      </Button>
    </HStack>
  );
};

export default Pagination;
