import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2 } from '../../global'


export const FormaBasicoTres = {
    InitialValues: { TelefonoDomicilio: '', TelefonoMovil: '', CorreoElectronico: '', DependientesEconomicos: '0', Observaciones: '' },
    Propiedades: {},
    Titulo: "Datos personales",
    SubTitulo: "Contacto",
    ValidationSchema: Yup.object().shape({
        // TelefonoDomicilio: Yup.string().min(10).max(10),
        TelefonoMovil: Yup.string().required().min(10).max(10),
        /*         CorreoElectronico: Yup.string().required().email(),
         */     /*    DependientesEconomicos: Yup.number().required().min(0).max(10), */
        Observaciones: Yup.string().max(120),//.required().min(0),,
    }),
    Componente: (cprops: any) => (
        <div>
            <CustomFieldText2 disabled={cprops.Cargando} label={'Tel.Casa'} datoType='text' name={'TelefonoDomicilio'} placeholder={'Telefono de domicilio (Opcional)'} />
            <CustomFieldText2 disabled={cprops.Cargando} label={'Tel.Movil'} datoType='text' name={'TelefonoMovil'} placeholder={'Telefono movil'} />
            <CustomFieldText2 disabled={cprops.Cargando} label={'E-Mail'} datoType='text' name={'CorreoElectronico'} placeholder={'Correo electronico (Opcional)'} />
            <hr />
            {/*  <CustomFieldText2 disabled={cprops.Cargando} label={'Dependientes Econimicos'} name={'DependientesEconomicos'} placeholder={'Dependientes economicos'} />
            <CustomFieldText2 disabled={cprops.Cargando} label={'Observaciones'} name={'Observaciones'} placeholder={'Observaciones'} />
       */}  </div>
    ),
}