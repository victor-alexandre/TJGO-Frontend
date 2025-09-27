import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
});