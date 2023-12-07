import * as Yup from 'yup';

export const signInValidation=Yup.object({
    email:Yup.string().email('Ingrese un email válido').required("Ingrese un email"),
    password:Yup.string().min(5,"Mínimo 5 caracteres").required("Ingrese un password")
});

export const createIndicatorValidate=Yup.object({
    content:Yup.string().min(5,"Mínimo 5 caracteres").required("Ingrese el indicador")
})