import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomSelect } from '../../global'
// import Empresas from '../../selectores/Empresas'

export const FormaUsuario = {
    InitialValues: {
        // empresaId: 0,
        tipoUsuario: "0"
    },
    Propiedades: {},
    Titulo: "Detalle de usuario",
    SubTitulo: "Ingreso a sistema",
    ValidationSchema: Yup.object().shape({
        // empresaId: Yup.number().required().min(0),
        tipoUsuario: Yup.number().required().min(1, "Seleccione un tipo de cuenta").max(2)
    }),
    Componente: (cprops: any) => (
        <div>
            {/* <Empresas disabled={cprops.Cargando} label={'Empresa'} name={'empresaId'} /> */}
            <CustomSelect label='Usuario basado en:' addDefault={true} disabled={cprops.Cargando} name={'tipoUsuario'} isMulti={false} options={[{ label: 'Seleccionar', value: 0 }, { label: 'Correo electronico', value: 1 }, { label: 'Teléfono', value: 2 }]} />
        </div>
    ),
}