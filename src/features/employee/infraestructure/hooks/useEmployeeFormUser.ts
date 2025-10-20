import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
    username: yup.string().required('La campo nombre de usuario es obligatorio.').min(3, 'Mínimo 3 caracteres debes escribir'),
    email: yup.string().required('El campo correo es obligatorio.').email('El formato para el correo es alberto@platform.com.mx'),
    password: yup.string().required('La contraseña es obligatoria.').min(8,'La contraseña debe tener al menos 8 caracteres.'),
    passwordConfirm: yup.string().required('Debes confirmar tu contraseña.').oneOf([yup.ref('password')], 'Las contraseñas no coindicen.'),
}).required();

type FormData = yup.InferType<typeof schema>;

const useEmployeeFormUser = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });
    const onSubmit = async (data: FormData) => {
        console.log(data);
    }
    return {
        onSubmit,
        handleSubmit,
        register,
        errors,
    }
}

export { useEmployeeFormUser };
