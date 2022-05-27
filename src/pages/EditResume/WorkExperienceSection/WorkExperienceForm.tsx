import {
  Button, Flex, FormControl, FormErrorMessage, FormLabel, Textarea, useToast, Input, Select,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../../hooks/useAuth';
import axios from '../../../services/axios';

import { WorkExperience } from '.';

type OnSubmitEvent = FormEvent<HTMLFormElement> & {
  currentTarget: {
    position: HTMLInputElement
    company: HTMLInputElement
    start_date: HTMLInputElement
    end_date: HTMLInputElement
    description: HTMLInputElement
  };
};

type WorkExperienceFormProps = {
  workExperienceData: WorkExperience
  onReturnFromForm: () => void
  onDeleting: (deletedExperience: WorkExperience) => void
  isNewForm: boolean
  UpdateWorkExperienceList: (newExperience: WorkExperience) => void
  AddNewExperience: (newExperience: WorkExperience) => void
}

export function WorkExperienceForm(
  {
    workExperienceData, onReturnFromForm, onDeleting,
    isNewForm, UpdateWorkExperienceList, AddNewExperience,
  }: WorkExperienceFormProps,
) {
  const [workExperience, setWorkExperience] = useState(isNewForm ? {
    position: '',
    company: '',
    start_date: '',
    end_date: '',
    description: '',
  } : workExperienceData);
  const [dateFields, setDateFields] = useState({
    startDateMonth: moment(workExperience?.start_date).format('MM'),
    startDateYear: moment(workExperience?.start_date).format('YYYY'),
    endDateMonth: moment(workExperience?.end_date).format('MM'),
    endDateYear: moment(workExperience?.end_date).format('YYYY'),
  });
  const [errors, setErrors] = useState({
    positionError: '',
    companyError: '',
    descriptionError: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const validateForm = (fields: any) => {
    const fieldErrors = {
      positionError: '',
      companyError: '',
      descriptionError: '',
    };
    let isThereError = false;

    if (fields.position.length < 3) {
      fieldErrors.positionError = 'Cargo precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    if (fields.company.length < 3) {
      fieldErrors.companyError = 'Empresa precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    if (fields.description.length < 3) {
      fieldErrors.descriptionError = 'Descrição precisa ter pelo menos 3 caracteres';
      isThereError = true;
    }

    return { ...fieldErrors, isThereError };
  };

  const createExperience = (data: WorkExperience) => axios.post(`/resumes/${user?.username}/experiences`, data);

  const updateExperience = (data: WorkExperience) => axios.put(`/resumes/${user?.username}/experiences/${data.id}`, data);

  const handleSubmit = async (event: OnSubmitEvent) => {
    event.preventDefault();

    const position = event.currentTarget.position.value.trim();
    const company = event.currentTarget.company.value.trim();
    const startDate = `${dateFields.startDateMonth}-${dateFields.startDateYear}`;
    const endDate = `${dateFields.endDateMonth}-${dateFields.endDateYear}`;
    const description = event.currentTarget.description.value.trim();

    const { isThereError, ...errorsValidated } = validateForm({
      position,
      company,
      description,
    });
    setErrors(errorsValidated);

    if (isThereError) return;

    try {
      setIsLoading(true);

      if (isNewForm) {
        const response = await createExperience({
          position,
          company,
          start_date: moment(startDate, 'MM-YYYY').format(),
          end_date: moment(endDate, 'MM-YYYY').format(),
          description,
        });
        AddNewExperience(response.data);
      } else {
        const response = await updateExperience({
          id: workExperienceData.id,
          position,
          company,
          start_date: moment(startDate, 'MM-YYYY').format(),
          end_date: moment(endDate, 'MM-YYYY').format(),
          description,
        });
        UpdateWorkExperienceList(response.data);
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
      <FormControl isInvalid={!!errors.positionError} isRequired my="4">
        <FormLabel htmlFor="position">Cargo</FormLabel>
        <Input
          id="position"
          type="text"
          name="position"
          bg="white"
          border="2px"
          borderColor="brand.100"
          value={workExperience?.position}
          onChange={(e) => setWorkExperience((old) => ({ ...old, position: e.target.value }))}
          _hover={{ borderColor: 'brand.300' }}
        />
        <FormErrorMessage>{errors.positionError}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.companyError} isRequired my="4">
        <FormLabel htmlFor="company">Empresa</FormLabel>
        <Input
          id="company"
          type="text"
          name="company"
          bg="white"
          border="2px"
          borderColor="brand.100"
          value={workExperience?.company}
          onChange={(e) => setWorkExperience((old) => ({ ...old, company: e.target.value }))}
          _hover={{ borderColor: 'brand.300' }}
        />
        <FormErrorMessage>{errors.companyError}</FormErrorMessage>
      </FormControl>
      <Flex justify="space-between">
        <FormControl isRequired my="4" mr="2">
          <FormLabel htmlFor="start_date">Data de início</FormLabel>
          <Flex>
            <Select
              id="start_date"
              placeholder="Mês"
              value={dateFields.startDateMonth}
              onChange={(e) => setDateFields((old) => ({ ...old, startDateMonth: e.target.value }))}
            >
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </Select>
            <Select
              id="start_date"
              placeholder="Ano"
              value={dateFields.startDateYear}
              onChange={(e) => setDateFields((old) => ({ ...old, startDateYear: e.target.value }))}
            >
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
              <option value="2014">2014</option>
              <option value="2013">2013</option>
              <option value="2012">2012</option>
              <option value="2011">2011</option>
              <option value="2010">2010</option>
              <option value="2009">2009</option>
              <option value="2008">2008</option>
              <option value="2007">2007</option>
              <option value="2006">2006</option>
              <option value="2005">2005</option>
              <option value="2004">2004</option>
              <option value="2003">2003</option>
              <option value="2002">2002</option>
              <option value="2001">2001</option>
              <option value="2000">2000</option>
              <option value="1999">1999</option>
              <option value="1998">1998</option>
              <option value="1997">1997</option>
              <option value="1996">1996</option>
              <option value="1995">1995</option>
              <option value="1994">1994</option>
              <option value="1993">1993</option>
              <option value="1992">1992</option>
              <option value="1991">1991</option>
              <option value="1990">1990</option>
              <option value="1989">1989</option>
              <option value="1988">1988</option>
              <option value="1987">1987</option>
              <option value="1986">1986</option>
              <option value="1985">1985</option>
              <option value="1984">1984</option>
              <option value="1983">1983</option>
              <option value="1982">1982</option>
              <option value="1981">1981</option>
              <option value="1980">1980</option>
              <option value="1979">1979</option>
              <option value="1978">1978</option>
              <option value="1977">1977</option>
              <option value="1976">1976</option>
              <option value="1975">1975</option>
              <option value="1974">1974</option>
              <option value="1973">1973</option>
              <option value="1972">1972</option>
              <option value="1971">1971</option>
              <option value="1970">1970</option>
            </Select>
          </Flex>
        </FormControl>
        <FormControl isRequired my="4" ml="2">
          <FormLabel htmlFor="end_date">Data final</FormLabel>
          <Flex>
            <Select
              id="end_date"
              placeholder="Mês"
              value={dateFields.endDateMonth}
              onChange={(e) => setDateFields((old) => ({ ...old, endDateMonth: e.target.value }))}
            >
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </Select>
            <Select
              id="end_date"
              placeholder="Ano"
              value={dateFields.endDateYear}
              onChange={(e) => setDateFields((old) => ({ ...old, endDateYear: e.target.value }))}
            >
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
              <option value="2014">2014</option>
              <option value="2013">2013</option>
              <option value="2012">2012</option>
              <option value="2011">2011</option>
              <option value="2010">2010</option>
              <option value="2009">2009</option>
              <option value="2008">2008</option>
              <option value="2007">2007</option>
              <option value="2006">2006</option>
              <option value="2005">2005</option>
              <option value="2004">2004</option>
              <option value="2003">2003</option>
              <option value="2002">2002</option>
              <option value="2001">2001</option>
              <option value="2000">2000</option>
              <option value="1999">1999</option>
              <option value="1998">1998</option>
              <option value="1997">1997</option>
              <option value="1996">1996</option>
              <option value="1995">1995</option>
              <option value="1994">1994</option>
              <option value="1993">1993</option>
              <option value="1992">1992</option>
              <option value="1991">1991</option>
              <option value="1990">1990</option>
              <option value="1989">1989</option>
              <option value="1988">1988</option>
              <option value="1987">1987</option>
              <option value="1986">1986</option>
              <option value="1985">1985</option>
              <option value="1984">1984</option>
              <option value="1983">1983</option>
              <option value="1982">1982</option>
              <option value="1981">1981</option>
              <option value="1980">1980</option>
              <option value="1979">1979</option>
              <option value="1978">1978</option>
              <option value="1977">1977</option>
              <option value="1976">1976</option>
              <option value="1975">1975</option>
              <option value="1974">1974</option>
              <option value="1973">1973</option>
              <option value="1972">1972</option>
              <option value="1971">1971</option>
              <option value="1970">1970</option>
            </Select>
          </Flex>
        </FormControl>
      </Flex>
      <FormControl isInvalid={!!errors.descriptionError} my="4">
        <FormLabel htmlFor="description">Descrição</FormLabel>
        <Textarea
          id="description"
          name="description"
          bg="white"
          border="2px"
          borderColor="brand.100"
          resize="none"
          value={workExperience?.description}
          onChange={(e) => setWorkExperience((old) => ({ ...old, description: e.target.value }))}
          _hover={{ borderColor: 'brand.300' }}
        />
        <FormErrorMessage>{errors.descriptionError}</FormErrorMessage>
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
              await axios.delete(`/resumes/${user?.username}/experiences/${workExperienceData.id}`);
              onDeleting(workExperienceData);
              onReturnFromForm();
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
