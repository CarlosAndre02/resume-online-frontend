import {
  Button, Text, Flex, Popover, PopoverContent, PopoverTrigger as OrigPopoverTrigger,
} from '@chakra-ui/react';
import { CaretDown } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();
  const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger;

  const onLogout = () => {
    logOutUser();
    navigate('/');
  };

  return (
    <header>
      <Flex mx="auto" align="center" justify="flex-end" py="3" px="12">
        { user ? (
          <Popover>
            <PopoverTrigger>
              <Button
                ml="8"
                border="2px"
                borderColor="black"
                bg="white"
                _focus={{ borderColor: 'black' }}
              >
                <Text mr="1">{user.username}</Text>
                <CaretDown size={20} color="#030303" weight="light" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              width={60}
              border="2px"
              borderColor="black"
              _focus={{ borderColor: 'black' }}
            >
              <Button bg="white" borderBottom="1px" _focus={{ borderColor: 'black' }}>
                <Link to="/edit-resume">Meu Currículo</Link>
              </Button>
              <Button
                bg="white"
                _focus={{ borderColor: 'black' }}
                onClick={onLogout}
              >
                Sair
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <>
            <Button
              size="md"
              bg="transparent"
              color="brand.500"
              border="2px"
              borderColor="brand.500"
              _hover={{ bg: 'brand.50' }}
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              size="md"
              bg="brand.500"
              color="white"
              mx="2"
              _hover={{ bg: 'brand.700' }}
            >
              <Link to="/signup">Cadastrar-se</Link>
            </Button>
          </>
        )}
      </Flex>
    </header>
  );
}
