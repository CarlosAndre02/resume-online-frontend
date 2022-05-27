import {
  AccordionButton, AccordionItem, AccordionPanel, Box, Button, useToast, Text, Center,
} from '@chakra-ui/react';
import { Minus, Plus } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../services/axios';

import { WorkExperienceItem } from './WorkExperienceItem';
import { WorkExperienceForm } from './WorkExperienceForm';

export type WorkExperience = {
  id?: number
  position: string
  company: string
  start_date: string
  end_date: string
  description: string
}

export function WorkExperienceSection() {
  const [workExperience, setWorkExperience] = useState<WorkExperience[] | null>(null);
  const [formData, setFormData] = useState({} as WorkExperience);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/resumes/${user?.username}/experiences`);
        setWorkExperience(response.data);
      } catch (e) {
        setWorkExperience(null);
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
                Experiência de trabalho
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
              <WorkExperienceForm
                workExperienceData={formData}
                onReturnFromForm={() => {
                  setIsEditing(false);
                  setIsCreatingNew(false);
                }}
                onDeleting={(deletedExperience: WorkExperience) => {
                  const newState = workExperience?.filter(
                    (oldExperience) => (oldExperience.id !== deletedExperience.id),
                  );

                  if (newState) {
                    setWorkExperience(newState);
                  }
                }}
                isNewForm={isCreatingNew}
                UpdateWorkExperienceList={(newExperience: WorkExperience) => {
                  const newState = workExperience?.map((oldExperience) => {
                    if (newExperience.id === oldExperience.id) {
                      return newExperience;
                    }
                    return oldExperience;
                  });

                  if (newState) {
                    setWorkExperience(newState);
                  }
                }}
                AddNewExperience={(newExperience: WorkExperience) => {
                  setWorkExperience((oldValues) => ([
                    ...(oldValues || []),
                    newExperience,
                  ]));
                }}
              />
            ) : (
              <>
                {workExperience?.map((experience) => (
                  <WorkExperienceItem
                    workExperienceData={experience}
                    onSelectingElement={() => {
                      setIsEditing(true);
                      setIsCreatingNew(false);
                    }}
                    setFormDataValues={(data: WorkExperience) => setFormData(data)}
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
                    <Text ml="2">Adicionar experiência</Text>
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
