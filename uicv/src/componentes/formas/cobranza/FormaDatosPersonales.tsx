import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2 } from '../../global'
import { Escolaridad, EstadoCivil, Sexos } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'


type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string
}

export const FormaDatosPersonales = ({ Prefijo, Titulo, SubTitulo }: DireccionTipo) => {

    const [conyugeDisplay, setconyugeDisplay] = React.useState('none')
    const [conyuge, setconyuge] = React.useState('')

    const InitialValues: any = {}
    InitialValues[`${Prefijo}CURP`] = ''
    InitialValues[`${Prefijo}RFC`] = ''
    InitialValues[`${Prefijo}EstadoCivilID`] = ''
    InitialValues[`${Prefijo}NombreConyuge`] = ''
    InitialValues[`${Prefijo}EscolaridadID`] = 0

    const ValSchemaObjecet: any = {}

    ValSchemaObjecet[`${Prefijo}CURP`] = Yup.string().required("OBLIGATORIO").min(18, '19 CARACTERES').max(18, '18 CARACTERES')
    ValSchemaObjecet[`${Prefijo}RFC`] = Yup.string().required("OBLIGATORIO").min(12, '12-13 CARACTERES').max(13, '12-13 CARACTERES')
    ValSchemaObjecet[`${Prefijo}EstadoCivilID`] = Yup.string().required("OBLIGATORIO")
    ValSchemaObjecet[`${Prefijo}EscolaridadID`] = Yup.string().required("OBLIGATORIO")


    const eCivilSelected = (val: string) => {
        if (['C', 'U', 'L'].includes(val)) {
            setconyugeDisplay('block')
            setconyuge(val)
        } else {
            setconyugeDisplay('none')
            setconyuge(val)
        }
    }

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div>
                    <CustomFieldText2 disabled={cprops.Cargando} label={'CURP'} datoType='text' name={`${Prefijo}CURP`} placeholder={'CURP'} />
                    <CustomFieldText2 disabled={cprops.Cargando} label={'RFC'} datoType='text' name={`${Prefijo}RFC`} placeholder={'RFC'} />
                    <EstadoCivil {...cprops} label={'Estado Civil'} name={`${Prefijo}EstadoCivilID`} accion={eCivilSelected} valor={conyuge} />
                    <div style={{ display: conyugeDisplay }}>
                        <h5 className={MODAL_TITLE_CLASS}></h5>
                        <CustomFieldText2 {...cprops.Cargando} label={'Nombre'} datoType='text' name={`${Prefijo}NombreConyuge`} placeholder={'Nombre de conyuge'} />
                    </div>
                    <Escolaridad  {...cprops.Cargando} label={'EscolaridadID'} name={`${Prefijo}EscolaridadID`} placeholder={'EscolaridadID'} />

                </div>
            </div>

        )
    }
}
