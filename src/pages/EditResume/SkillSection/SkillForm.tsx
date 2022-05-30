import {
  Button, Flex, FormControl, FormErrorMessage, FormLabel, Textarea, useToast, Input, Select,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../services/axios';

import { Skill } from '.';

type OnSubmitEvent = FormEvent<HTMLFormElement> & {
  currentTarget: {
    skill: HTMLInputElement
  };
};

type SkillFormProps = {
  skillData: Skill
  onReturnFromForm: () => void
  onDeletingFromList: (deletedSkill: Skill) => void
  isNewForm: boolean
  UpdateSkillList: (newSkill: Skill) => void
  AddNewSkill: (newSkill: Skill) => void
}

export function SkillForm(
  {
    skillData, onReturnFromForm, onDeletingFromList,
    isNewForm, UpdateSkillList, AddNewSkill,
  }: SkillFormProps,
) {
  const [skill, setSkill] = useState(isNewForm ? { skill: '' } : skillData);
  const [errors, setErrors] = useState({
    skillError: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const validateForm = (fields: any) => {
    const fieldErrors = {
      skillError: '',
    };
    let isThereError = false;

    if (fields.skill.length < 3) {
      fieldErrors.skillError = 'Habilidade precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    return { ...fieldErrors, isThereError };
  };

  const createSkill = (data: Skill) => axios.post(`/resumes/${user?.username}/skills`, data);

  const updateSkill = (data: Skill) => axios.put(`/resumes/${user?.username}/skills/${data.id}`, data);

  const handleSubmit = async (event: OnSubmitEvent) => {
    event.preventDefault();

    const skillField = event.currentTarget.skill.value.trim();

    const { isThereError, ...errorsValidated } = validateForm({ skill: skillField });
    setErrors(errorsValidated);

    if (isThereError) return;

    try {
      setIsLoading(true);

      if (isNewForm) {
        const response = await createSkill({ skill: skillField });
        AddNewSkill(response.data);
      } else {
        const response = await updateSkill({
          id: skillData.id,
          skill: skillField,
        });
        UpdateSkillList(response.data);
      }
      onReturnFromForm();
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
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={!!errors.skillError} isRequired my="4">
        <FormLabel htmlFor="skill">Habilidade</FormLabel>
        <Input
          id="skill"
          type="text"
          name="skill"
          bg="white"
          border="2px"
          borderColor="brand.100"
          value={skill?.skill}
          onChange={(e) => setSkill((old) => ({ ...old, skill: e.target.value }))}
          _hover={{ borderColor: 'brand.300' }}
        />
        <FormErrorMessage>{errors.skillError}</FormErrorMessage>
      </FormControl>
      <Flex justify="flex-end">
        { !isNewForm
          && (
          <Button
            mr="2"
            size="md"
            bg="white"
            color="#ff4d4d"
            _hover={{ bg: '#fff3f3' }}
            onClick={async () => {
              try {
                await axios.delete(`/resumes/${user?.username}/skills/${skillData.id}`);
                onDeletingFromList(skillData);
                onReturnFromForm();
              } catch (e) {
                toast({
                  title: 'Ocorreu um erro. Tente novamente.',
                  status: 'error',
                  duration: 4000,
                  isClosable: true,
                });
              }
            }}
          >
            Excluir
          </Button>
          )}
        <Button
          mr="2"
          size="md"
          onClick={onReturnFromForm}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="md"
          bg="brand.500"
          color="white"
          isLoading={isLoading}
          _hover={{ bg: 'brand.700' }}
        >
          Salvar
        </Button>
      </Flex>
    </form>
  );
}
