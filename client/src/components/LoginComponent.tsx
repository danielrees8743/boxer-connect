import { useQuery, useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Button,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { UnlockIcon } from '@chakra-ui/icons';
import { fetchClubs, postLogin } from '../hooks/useAPIFeatures';

interface Club {
  _id: number;
  name: string;
}

interface IFormInput {
  email: string;
  password: string;
  club: string;
}

function LoginDraw() {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  //todo put the toast in the component
  const toast = useToast();

  //todo Figure Out the Error, how to return the error message from axios
  const { data, isLoading, isError, error } = useQuery(['clubs'], fetchClubs);

  const userLogin = useMutation(postLogin, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    userLogin.mutate(data, {
      onSuccess: (data) => {
        isOpen && onClose();
        reset();
        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      },
      onError: (error) => {
        console.log(error);
        reset();
        toast({
          title: 'Login Failed',
          description: 'Please check your email and password',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      },
    });
  };

  return (
    <>
      <Button
        leftIcon={<UnlockIcon />}
        bg='brand.400'
        color='secondary'
        _hover={{ bg: 'brand.600', color: 'brand.50' }}
        onClick={onOpen}>
        Login
      </Button>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>Login</DrawerHeader>

            <DrawerBody>
              <Stack spacing='24px'>
                <Box>
                  <FormLabel htmlFor='username'>Email</FormLabel>
                  <Input
                    {...register('email')}
                    id='email'
                    placeholder='Please enter your email'
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor='owner'>Select Club</FormLabel>
                  {/*//!Need to remove */}
                  {/* {isLoading && <p>Loading...</p>}
                  {isError && <p>{data?.data.message}</p>} */}
                  <Select id='club' {...register('club')}>
                    <option>Select Club</option>
                    {data?.data.map((club: Club) => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <FormLabel htmlFor='username'>Password</FormLabel>
                  <Input
                    {...register('password')}
                    type='password'
                    id='password'
                    placeholder='Please enter your password'
                  />
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                bg='brand.400'
                color='secondary'
                _hover={{ bg: 'brand.600', color: 'brand.50' }}>
                Submit
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default LoginDraw;
