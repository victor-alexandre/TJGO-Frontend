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

export const profileValidationSchema = yup.object({
  name: yup
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .required('Nome é obrigatório'),
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),

  currentPassword: yup.string(),

  newPassword: yup.string()
    .min(6, 'A nova senha deve ter no mínimo 6 caracteres'),

  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'As senhas não conferem'),

}).test(
  'password-requirements',
  'Para alterar a senha, todos os campos são necessários.',
  function (value) {
    const { currentPassword, newPassword, confirmPassword } = value;
    const { path, createError } = this;

    const isAnyFieldFilled = currentPassword || newPassword || confirmPassword;

    if (isAnyFieldFilled) {
      if (!currentPassword) {
        return createError({ path: 'currentPassword', message: 'Senha atual é obrigatória' });
      }
      if (!newPassword) {
        return createError({ path: 'newPassword', message: 'Nova senha é obrigatória' });
      }
      if (!confirmPassword) {
        return createError({ path: 'confirmPassword', message: 'Confirmação de senha é obrigatória' });
      }
    }

    return true;
  }
);