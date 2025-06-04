import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldDatePicker2, CustomFieldText2 } from '../../global'
import { TipoIdentificacion } from '../../selectores'
import moment from 'moment'

export const FormaBasicoUno = () => {
    const [identificacion, setIdentificacion] = React.useState(0)

    const identificacionSelected = (val: number) => setIdentificacion(val)

    return {
        InitialValues: { Nombre: '', ApellidoPaterno: '', ApellidoMaterno: '', FechaNacimiento: '', LugarNacimiento: '', NombreConyuge: '', identificacionTipoId: '', identificacionNumero: '' },
        Propiedades: {},
        Titulo: "Datos personas",
        SubTitulo: "Basicos",
        ValidationSchema: Yup.object().shape({
            Nombre: Yup.string().required().min(3).max(120),
            ApellidoPaterno: Yup.string().required().min(3).max(120,),
            ApellidoMaterno: Yup.string().required().min(3).max(120,),
            FechaNacimiento: Yup.string().required().test("FechaNacimiento", "El cliente debe ser mayor de edad", (value: any) => moment().diff(moment(value), "years") >= 18),
            // LugarNacimiento: Yup.string().required().min(3).max(120,),
            xNombreConyuge: Yup.string().min(0,).max(120),
            identificacionTipoId: Yup.number().typeError('Ingrese un número').required().min(1),
            identificacionNumero: Yup.string().required().min(10).max(120,),
        }),
        Componente: (cprops: any) => (
            <div>
                <CustomFieldText2 {...cprops} disabled={true} label={'Nombre'} name={'Nombre'} placeholder={'Nombre(s)'} />
                <CustomFieldText2 {...cprops} disabled={true} label={'A.Paterno'} name={'ApellidoPaterno'} placeholder={'Apellido Paterno'} />
                <CustomFieldText2 {...cprops} disabled={true} label={'A.Materno'} name={'ApellidoMaterno'} placeholder={'Apellido Materno'} />
                <CustomFieldDatePicker2 {...cprops} disabled={true} label={'F.Nacimiento'} name={'FechaNacimiento'} placeholder={'Fecha Nacimiento'} />
                {/*                 <CustomFieldText2 {...cprops} label={'L.Nacimiento'} name={'LugarNacimiento'} placeholder={'Lugar nacimiento'} />
 */}                <CustomFieldText2 {...cprops} label={'Conyuge'} name={'NombreConyuge'} placeholder={'Nombre del Conyuge (Opcional)'} />
                <div className={"row"}>
                    <div className={"col-sm-12 col-md-4"}>
                        <TipoIdentificacion {...cprops} label={"Identificacion"} accion={identificacionSelected} valor={identificacion} />
                    </div>
                    <div className={"col-sm-12 col-md-8"}>
                        <CustomFieldText2 {...cprops} label={'# Identificacion'} name={'identificacionNumero'} placeholder={'# de identificación'} />
                    </div>
                </div>
            </div>
        )
    }
}