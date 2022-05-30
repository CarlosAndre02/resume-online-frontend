import {
  Box, ListItem, Text,
} from '@chakra-ui/react';

import { Skill } from '.';

type SkillItemProps = {
  skillData: Skill
  onSelectingElement: () => void
  setFormDataValues: (data: Skill) => void
}

export function SkillItem(
  { skillData, onSelectingElement, setFormDataValues }: SkillItemProps,
) {
  return (
    <ListItem>
      <Box
        key={skillData.id}
        mb="6"
        onClick={() => {
          onSelectingElement();
          setFormDataValues(skillData);
        }}
        _hover={{ cursor: 'pointer', filter: 'brightness(3)', transition: 'all .2s' }}
      >
        <Text>{skillData.skill}</Text>
      </Box>
    </ListItem>
  );
}
