import {
  Alert, AlertIcon, AlertTitle, CloseButton,
} from '@chakra-ui/react';

type ErrorMessageProps = {
  message: string
  onClose: () => void
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <Alert status="error" variant="left-accent" mb="2">
      <AlertIcon />
      <AlertTitle>{message}</AlertTitle>
      <CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />
    </Alert>
  );
}
