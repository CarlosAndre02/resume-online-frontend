import {
  AccordionButton, AccordionItem, AccordionPanel, Box, Button, Text, Center,
} from '@chakra-ui/react';
import { Minus, Plus } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../services/axios';

import { EducationItem } from './EducationItem';
import { EducationForm } from './EducationForm';

export type Education = {
  id?: number
  degree: string
  school: string
  start_date: string
  end_date: string
  description: string
}

export function EducationSection() {
  const [education, setEducation] = useState<Education[] | null>(null);
  const [formData, setFormData] = useState({} as Education);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/resumes/${user?.username}/educations`);
        setEducation(response.data);
      } catch (e) {
        setEducation(null);
      }
    };
    fetchData();
  }, []);

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h3>
            <AccordionButton
              mt="3"
              border="2px"
              borderColor="black"
              bg="white"
              _focus={{ borderColor: 'black' }}
            >
              <Box flex="1" textAlign="left" fontSize="xl">
                Histórico Acadêmico
              </Box>
              {isExpanded ? (
                <Minus size={24} color="#030303" weight="bold" />
              ) : (
                <Plus size={24} color="#030303" weight="bold" />
              )}
            </AccordionButton>
          </h3>
          <AccordionPanel p={7} bg="white" border="2px" borderTop={0} borderColor="black">
            { (isEditing || isCreatingNew) ? (
              <EducationForm
                educationData={formData}
                onReturnFromForm={() => {
                  setIsEditing(false);
                  setIsCreatingNew(false);
                }}
                onDeletingFromList={(deletedEducation: Education) => {
                  const newState = education?.filter(
                    (oldEducation) => (oldEducation.id !== deletedEducation.id),
                  );

                  if (newState) {
                    setEducation(newState);
                  }
                }}
                isNewForm={isCreatingNew}
                UpdateEducationList={(newEducation: Education) => {
                  const newState = education?.map((oldEducation) => {
                    if (newEducation.id === oldEducation.id) {
                      return newEducation;
                    }
                    return oldEducation;
                  });

                  if (newState) {
                    setEducation(newState);
                  }
                }}
                AddNewEducation={(newEducation: Education) => {
                  setEducation((oldValues) => ([
                    ...(oldValues || []),
                    newEducation,
                  ]));
                }}
              />
            ) : (
              <>
                {education?.map((educationElement) => (
                  <EducationItem
                    key={educationElement.id}
                    educationData={educationElement}
                    onSelectingElement={() => {
                      setIsEditing(true);
                      setIsCreatingNew(false);
                    }}
                    setFormDataValues={(data: Education) => setFormData(data)}
                  />
                ))}
                <Center>
                  <Button
                    bg="white"
                    border="2px"
                    borderColor="black"
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreatingNew(true);
                    }}
                  >
                    <Plus size={20} color="#030303" weight="bold" />
                    <Text ml="2">Adicionar</Text>
                  </Button>
                </Center>
              </>
            )}

          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}
