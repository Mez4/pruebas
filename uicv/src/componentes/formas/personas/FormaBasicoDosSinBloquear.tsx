import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2 } from '../../global'
import { Escolaridad, EstadoCivil, Sexos } from '../../selectores'

export const FormaBasicoDosSinBloquear = () => {
    const [sexo, setSexo] = React.useState('')
    const [eCivil, setECivil] = React.useState('')//Z
    const [escolaridad, setEscolaridad] = React.useState(0)

    const sexoSelected = (val: string) => setSexo(val)
    const eCivilSelected = (val: string) => setECivil(val)
    const escolaridadSelected = (val: number) => setEscolaridad(val)

    return {
        InitialValues: { CURP: '', RFC: '', SexoID: '', EstadoCivilID: '', EscolaridadID: 7 },
        Propiedades: {},
        Titulo: "Datos personales",
        SubTitulo: "Fiscales",
        ValidationSchema: Yup.object().shape({
            CURP: Yup.string().required("OBLIGATORIO")
                .matches(
                    /^[A-Za-z]{4}\d{6}[H,M][A-Za-z]{5}[A-Za-z\d]{2}$/i,
                    'Introduce una CURP válida'
                ),
            SexoID: Yup.string().required("OBLIGATORIO"),
            EstadoCivilID: Yup.string().required("OBLIGATORIO")
            // RFC: Yup.string().required("OBLIGATORIO").min(12, "Minimo 12 caracteres").max(13, "Maximo 13 caracteres"),

        }),
        Componente: (cprops: any) => (
            <div>
                <CustomFieldText2 disabled={false} datoType='text' label={'CURP'} name={'CURP'} placeholder={'CURP'} />
                {/*                 <CustomFieldText2 disabled={cprops.Cargando} label={'RFC'} name={'RFC'} placeholder={'RFC'} />
 */}                <Sexos {...cprops} accion={sexoSelected} valor={sexo} name={'SexoID'}/>
                <EstadoCivil {...cprops} accion={eCivilSelected} valor={eCivil} name={'EstadoCivilID'} />
                {/*                 <Escolaridad  {...cprops} accion={escolaridadSelected} valor={escolaridad} />
 */}            </div>
        )
    }
}
