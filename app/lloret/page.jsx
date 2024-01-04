"use client";
import { PrizeCard } from "../components/PrizeCard";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { businessList } from "../functions/supabase";

//export const runtime = "edge";

function lloret() {
  const [data, setData] = useState({});

  useEffect(() => {
    const init = async () => {
    const data = await businessList();

    setData(data);
    }
    init();
  }, []);
  return (
    <Box>

      <Text>List - Business -</Text>
      

      <Box className={styles.containerI}>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
          {data.length > 0 &&
            data.map((product) => (
              <Box key={product.id}>
                <PrizeCard
                  name={product.name}
                  id={product.id}
                  city={product.city}
                />
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default lloret;

/*
 
          */
