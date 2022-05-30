import {
  AccordionButton, AccordionItem, AccordionPanel, Box, Button, Text, Center, UnorderedList,
} from '@chakra-ui/react';
import { Minus, Plus } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../services/axios';

import { SkillItem } from './SkillItem';
import { SkillForm } from './SkillForm';

export type Skill = {
  id?: number
  skill: string
}

export function SkillSection() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [formData, setFormData] = useState({} as Skill);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/resumes/${user?.username}/skills`);
        setSkills(response.data);
      } catch (e) {
        setSkills(null);
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
                Habilidades
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
              <SkillForm
                skillData={formData}
                onReturnFromForm={() => {
                  setIsEditing(false);
                  setIsCreatingNew(false);
                }}
                onDeletingFromList={(deletedSkill: Skill) => {
                  const newState = skills?.filter(
                    (oldSkill) => (oldSkill.id !== deletedSkill.id),
                  );

                  if (newState) {
                    setSkills(newState);
                  }
                }}
                isNewForm={isCreatingNew}
                UpdateSkillList={(newSkill: Skill) => {
                  const newState = skills?.map((oldSkill) => {
                    if (newSkill.id === oldSkill.id) {
                      return newSkill;
                    }
                    return oldSkill;
                  });

                  if (newState) {
                    setSkills(newState);
                  }
                }}
                AddNewSkill={(newSkill: Skill) => {
                  setSkills((oldValues) => ([
                    ...(oldValues || []),
                    newSkill,
                  ]));
                }}
              />
            ) : (
              <>
                <UnorderedList>
                  {skills?.map((skillElement) => (
                    <SkillItem
                      skillData={skillElement}
                      onSelectingElement={() => {
                        setIsEditing(true);
                        setIsCreatingNew(false);
                      }}
                      setFormDataValues={(data: Skill) => setFormData(data)}
                    />
                  ))}
                </UnorderedList>
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
