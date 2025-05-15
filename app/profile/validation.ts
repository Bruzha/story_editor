import * as yup from 'yup';

export interface ValidationSchemaType {
  login: string;
  name: string | null;
  lastname: string | null;
}

const validationSchema: yup.ObjectSchema<ValidationSchemaType> = yup.object().shape({
  login: yup
    .string()
    .required('Логин обязателен')
    .min(3, 'Логин должен содержать не менее 3 символов')
    .max(20, 'Логин должен содержать не более 20 символов'),
  name: yup
    .string()
    .nullable()
    .defined()
    .min(2, 'Имя должно содержать не менее 2 символов')
    .max(50, 'Имя должно содержать не более 50 символов'),
  lastname: yup
    .string()
    .nullable()
    .defined()
    .min(2, 'Фамилия должна содержать не менее 2 символов')
    .max(50, 'Фамилия должна содержать не более 50 символов'),
});

export default validationSchema;
