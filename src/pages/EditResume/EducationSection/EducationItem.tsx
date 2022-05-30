import {
  Box, Flex, Heading, Text,
} from '@chakra-ui/react';
import moment from 'moment';

import { Education } from '.';

type EducationItemProps = {
  educationData: Education
  onSelectingElement: () => void
  setFormDataValues: (data: Education) => void
}

export function EducationItem(
  { educationData, onSelectingElement, setFormDataValues }: EducationItemProps,
) {
  const startDateParsed = moment(educationData.start_date).format('MM/YYYY');
  const endDateParsed = moment(educationData.end_date).format('MM/YYYY');

  return (
    <Box
      key={educationData.id}
      mb="6"
      onClick={() => {
        onSelectingElement();
        setFormDataValues(educationData);
      }}
      _hover={{ cursor: 'pointer', filter: 'brightness(3)', transition: 'all .2s' }}
    >
      <Flex>
        <Heading as="h4" size="sm">
          {educationData.school}
        </Heading>
        <Text>
          {', '}
          {educationData.degree}
        </Text>
      </Flex>
      <Box mt="2">{`${startDateParsed} - ${endDateParsed}`}</Box>
    </Box>
  );
}
