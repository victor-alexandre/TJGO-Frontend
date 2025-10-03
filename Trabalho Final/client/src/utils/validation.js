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
  currentPassword: yup.string()
    .when(['newPassword', 'confirmPassword'], {
      is: (newPassword, confirmPassword) => newPassword || confirmPassword,
      then: (schema) => schema.required('Senha atual é obrigatória para alterar a senha'),
      otherwise: (schema) => schema.notRequired()
    }),
  newPassword: yup.string()
    .when('currentPassword', {
      is: (currentPassword) => currentPassword && currentPassword.length > 0,
      then: (schema) => schema
        .required('Nova senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres'),
      otherwise: (schema) => schema.notRequired()
    }),
  confirmPassword: yup.string()
    .when('newPassword', {
      is: (newPassword) => newPassword && newPassword.length > 0,
      then: (schema) => schema
        .required('Confirmação de senha é obrigatória')
        .oneOf([yup.ref('newPassword')], 'Senhas devem ser iguais'),
      otherwise: (schema) => schema.notRequired()
    })
}).test(
  'password-requirements',
  'Para alterar a senha, todos os campos de senha devem ser preenchidos',
  function(value) {
    const { currentPassword, newPassword, confirmPassword } = value;   
    if (currentPassword || newPassword || confirmPassword) {
      return currentPassword && newPassword && confirmPassword;
    }
    
    return true;
  }
);