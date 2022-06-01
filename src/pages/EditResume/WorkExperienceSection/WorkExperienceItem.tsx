import {
  Box, Flex, Heading, Text,
} from '@chakra-ui/react';
import moment from 'moment';

import { WorkExperience } from '.';

type WorkExperienceItemProps = {
  workExperienceData: WorkExperience
  onSelectingElement: () => void
  setFormDataValues: (data: WorkExperience) => void
}

export function WorkExperienceItem(
  { workExperienceData, onSelectingElement, setFormDataValues }: WorkExperienceItemProps,
) {
  const startDateParsed = moment(workExperienceData.start_date).format('MM/YYYY');
  const endDateParsed = moment(workExperienceData.end_date).format('MM/YYYY');

  return (
    <Box
      mb="6"
      onClick={() => {
        onSelectingElement();
        setFormDataValues(workExperienceData);
      }}
      _hover={{ cursor: 'pointer', filter: 'brightness(3)', transition: 'all .2s' }}
    >
      <Flex>
        <Heading as="h4" size="sm">
          {workExperienceData.company}
        </Heading>
        <Text>
          {', '}
          {workExperienceData.position}
        </Text>
      </Flex>
      <Box mt="2">{`${startDateParsed} - ${endDateParsed}`}</Box>
    </Box>
  );
}
