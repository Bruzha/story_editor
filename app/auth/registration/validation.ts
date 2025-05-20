import * as yup from 'yup';

const validationSchema = yup.object().shape({
  login: yup
    .string()
    .required('Логин обязателен')
    .min(3, 'Логин должен содержать не менее 3 символов')
    .max(20, 'Логин должен содержать не более 20 символов'),
  email: yup.string().required('Email обязателен').email('Неверный формат email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен содержать не менее 8 символов')
    .matches(
      /^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/,
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
    ),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});

export default validationSchema;
