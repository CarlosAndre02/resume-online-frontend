import {
  Button, Center, Flex, Heading, Input, Text, Link, Spinner,
} from '@chakra-ui/react';
import { useState, FormEvent } from 'react';
import { Link as ReactLink, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import axios from '../../services/axios';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';

export function SignUp() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logInUser } = useAuth();
  const navigate = useNavigate();

  type OnSubmitEvent = FormEvent<HTMLFormElement> & {
    currentTarget: {
      username: HTMLInputElement;
      password: HTMLInputElement;
    };
  };

  const handleSubmit = async (event: OnSubmitEvent) => {
    event.preventDefault();

    const username = event.currentTarget.username.value.trim();
    const password = event.currentTarget.password.value.trim();

    if (username.length < 5) {
      setError('Usuário deve ter pelo menos 5 caracteres');
      return;
    }

    if (password.length < 3) {
      setError('Senha deve ter pelo menos 3 caracteres');
      return;
    }

    try {
      setIsLoading(true);

      await axios.post('/users', { username, password });

      const response = await axios.post('/authenticate', { username, password });
      const { token, user } = response.data;

      logInUser({ token, id: user.id, username: user.username });
      navigate('/edit-resume');
    } catch (e: any) {
      if (e instanceof AxiosError && e.response?.status === 400) {
        setError(e.response?.data.errors[0]);
      } else {
        setError('Um erro inesperado aconteceu. Tente novamente');
      }
    }
    setIsLoading(false);
  };

  return (
    <Center mx="auto" height="100vh" maxWidth="350px">
      <Flex mt="-200px" direction="column">
        <Center mb="8">
          <Heading textAlign="center">Crie uma Conta</Heading>
        </Center>

        {!!error && (
          <ErrorMessage message={error} onClose={() => setError('')} />
        )}

        <form onSubmit={handleSubmit}>
          <Flex direction="column">
            <Input
              type="text"
              name="username"
              placeholder="Usuário"
              bg="white"
              border="2px"
              borderColor="brand.100"
              _hover={{ borderColor: 'brand.300' }}
              _focus={{ borderColor: 'brand.500' }}
            />
            <Input
              type="password"
              name="password"
              placeholder="Senha"
              bg="white"
              border="2px"
              borderColor="brand.100"
              my="3"
              _hover={{ borderColor: 'brand.300' }}
              _focus={{ borderColor: 'brand.500' }}
            />

            <Text mb="2">
              Já tem uma conta?
              {' '}
              <Link as={ReactLink} to="/login" color="brand.500">Entrar</Link>
            </Text>

            <Button
              type="submit"
              size="lg"
              bg="brand.500"
              color="white"
              mb="3"
              isDisabled={isLoading}
              _hover={{ bg: 'brand.700' }}
            >
              {isLoading ? <Spinner /> : 'Criar'}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Center>
  );
}
