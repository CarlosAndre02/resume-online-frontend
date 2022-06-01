import {
  Avatar, Box, Button, Flex, FormLabel, useToast,
} from '@chakra-ui/react';
import { Camera } from 'phosphor-react';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../services/axios';

type Photo = {
  id: number
  originalname: string
  url: string
}

type PhotoUploadFieldProps = {
  profileId: number
}

export function PhotoUploadField({ profileId }: PhotoUploadFieldProps) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/resumes/${user?.username}/profiles`);
        setPhoto(response.data.Photo);
      } catch (e) {
        setPhoto(null);
      }
    };
    fetchData();
  }, []);

  const onUpload = async (file: any[]) => {
    const data = new FormData();
    data.append('file', file[0]);
    data.append('profile_id', profileId.toString());

    try {
      setIsLoading(true);
      const response = await axios.post('/upload', data);
      setPhoto(response.data);
    } catch (e) {
      toast({
        title: 'Ocorreu um erro. Tente novamente.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/upload/${photo?.id}`);
      setPhoto(null);
    } catch (e) {
      toast({
        title: 'Ocorreu um erro. Tente novamente.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <FormLabel htmlFor="photo">Foto</FormLabel>
      <Dropzone onDropAccepted={onUpload}>
        {({
          getRootProps, getInputProps, open,
        }) => (
          <Flex justify="center" align="center" direction="column">
            { !photo ? (
              <>
                <Box {...getRootProps()} width="8rem" height="8rem">{ /* eslint-disable-line */}
                  <Avatar width="100%" height="100%" bg="#f3f4f6" icon={<Camera size="80%" color="#ffffff" weight="bold" />} />
                  <input id="photo" {...getInputProps()} /> { /* eslint-disable-line */}
                </Box>
                <Button type="button" my="8" isLoading={isLoading} onClick={open}>
                  Adicionar foto
                </Button>
              </>
            ) : (
              <>
                <Avatar src={photo?.url} width="10rem" height="10rem" />
                <Button type="button" my="8" colorScheme="red" isLoading={isLoading} onClick={onDelete}>
                  Apagar foto
                </Button>
              </>
            )}
          </Flex>
        )}
      </Dropzone>
    </>
  );
}
