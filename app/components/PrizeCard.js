// components/PrizeCard.js
import React, { useState } from 'react'
import styles from '../styles/PrizeCard.module.css'
import Link from 'next/link'
import { Badge, Avatar, Flex, Text, Button, ButtonGroup, Box } from '@chakra-ui/react'
export function PrizeCard (datos) {
  const { name, id, city } = datos
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      onClick={handleClick}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <Flex>
            <Avatar size='2xl' src={`https://fwhlcijbnqstdjgowqvm.supabase.co/storage/v1/render/image/public/avatars/${id}.jpg?width=150&height=150`} />
            <Box ml='3'>
              <Text fontWeight='bold'>
                {name}
                <Badge ml='1' colorScheme='green'>
                  New
                </Badge>
              </Text>
              <Text fontSize='sm'>{city}</Text>
            </Box>
          </Flex>
        </div>
        <div className={styles.cardBack}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            width='100%'
            py={12}
            bgImage={`https://fwhlcijbnqstdjgowqvm.supabase.co/storage/v1/render/image/public/avatars/${id}.jpg`}
            bgPosition='center'
            bgRepeat='no-repeat'
            mb={2}
          >
            <ButtonGroup gap='4'>
              <Link href='/[id]' as={`/${name.replace(/\s/g, '')}`}>

                <Button colorScheme='whiteAlpha'>Entrar</Button>
              </Link>
            </ButtonGroup>
          </Box>

        </div>
      </div>
    </div>
  )
}
