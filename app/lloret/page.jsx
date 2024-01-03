'use client'
import { PrizeCard } from '../components/PrizeCard'
import { IconButton, SimpleGrid, Box, Link , Text} from '@chakra-ui/react'
import { ArrowLeftIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import { supabase } from '../supabase/client'

import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'




function lloret () {

  const [data, setData] = useState([])
 
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('bussines')
        .select('id, name, city')

      setData(data)
    }
    fetchData()
  }, [])

  return (
    

      
<Box>
      <Text>List - Lloret de mar</Text>
      <Box style={{ flexBasis: '10%' }}>
        <Link as={NextLink} href='/'>
          <IconButton
            colorScheme='teal'
            aria-label='Inicio'
            variant='solid'
            size='md'
            icon={<ArrowLeftIcon />}
          />
        </Link>
      </Box>

      <Box className={styles.containerI}>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>

          {data.map(product => (
            <Box key={product.id}>
              <PrizeCard name={product.name} id={product.id} city={product.city} />

            </Box>
          ))}
        </SimpleGrid>
      </Box>
      </Box>
     
    
  )
}

export default lloret
