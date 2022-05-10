import {
  Center, Button, Flex, Heading, Text,
} from '@chakra-ui/react';
import { Scroll } from 'phosphor-react';

export function Home() {
  return (
    <Center mx="auto" height="100vh">
      <Flex mt="-140px" direction="column">
        <Heading mb="8">
          <Flex>
            <Scroll size={56} color="#023e8a" weight="bold" />
            <Text ml="3">Resume Online</Text>
          </Flex>
        </Heading>
        <Button size="lg" bg="brand.500" color="white" mb="3" _hover={{ bg: 'brand.700' }}>Criar uma conta</Button>
        <Button size="lg" bg="transparent" color="brand.500" border="2px" borderColor="brand.500" _hover={{ bg: 'brand.50' }}>Entrar em uma conta</Button>
      </Flex>
    </Center>
  );
}
