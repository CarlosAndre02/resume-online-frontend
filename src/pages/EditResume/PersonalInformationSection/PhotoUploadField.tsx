import {
  Avatar, Box, Button, Flex, FormLabel, useToast,
} from '@chakra-ui/react';
import { Camera } from 'phosphor-react';
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';

import { Photo } from '.';

type PhotoUploadFieldProps = {
  photoUploaded: Photo | null
  setPhotoField: (photoFieldValue: FormData) => void
  updatePhotoAction: (action: string) => void
}

export function PhotoUploadField(
  { photoUploaded, setPhotoField, updatePhotoAction }: PhotoUploadFieldProps,
) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setPhoto(photoUploaded), [photoUploaded]);

  const onUpload = async (file: any[]) => {
    setIsLoading(true);

    const data = new FormData();
    data.append('file', file[0]);

    setPhotoField(data);
    updatePhotoAction('upload');
    setPhoto({
      originalname: file[0].name,
      url: URL.createObjectURL(file[0]),
    });

    setIsLoading(false);
  };

  const onDelete = async () => {
    setIsLoading(true);

    updatePhotoAction('delete');
    setPhoto(null);

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
