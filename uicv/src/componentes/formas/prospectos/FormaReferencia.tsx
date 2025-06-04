import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import { Parentesco } from '../../selectores'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
}

export const FormaReferencia = ({ Prefijo, Titulo, SubTitulo }: DireccionTipo) => {

    const [parentezco, setParentezco] = React.useState('')

    const InitialValues: any = {}
    InitialValues[`${Prefijo}Nombre`] = ''
    InitialValues[`${Prefijo}PrimerApellido`] = ''
    InitialValues[`${Prefijo}SegundoApellido`] = ''
    InitialValues[`${Prefijo}Parentesco`] = ''

    InitialValues[`${Prefijo}Celular`] = ''
    InitialValues[`${Prefijo}Domicilio`] = ''
    InitialValues[`${Prefijo}Edad`] = 0

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}Nombre`] = Yup.string().required().min(2)
    ValSchemaObjecet[`${Prefijo}PrimerApellido`] = Yup.string().required().min(2)
    ValSchemaObjecet[`${Prefijo}SegundoApellido`] = Yup.string().required().min(2)
    ValSchemaObjecet[`${Prefijo}Parentesco`] = Yup.string().required().min(2)

    ValSchemaObjecet[`${Prefijo}Celular`] = Yup.string().required().min(10).max(10)
    ValSchemaObjecet[`${Prefijo}Domicilio`] = Yup.string().required().min(10, 'Captura la direccion completa')
    ValSchemaObjecet[`${Prefijo}Edad`] = Yup.number().typeError('Ingrese un numero').required().min(18, 'Debe ser mayor de edad')

    const options = [{ value: 'PADRE', label: 'PADRE' },
    { value: 'MADRE', label: 'MADRE' },
    { value: 'HERMANO(A)', label: 'HERMANO(A)' },
    { value: 'SOBRINO(A)', label: 'SOBRINO(A)' },
    { value: 'ABUELO(A)', label: 'ABUELO(A)' },
    { value: 'TIO(A)', label: 'TIO(A)' },
    { value: 'PRIMO(A)', label: 'PRIMO(A)' },
    { value: 'HIJO(A)', label: 'HIJO(A)' },
    { value: 'NIETO(A)', label: 'NIETO(A)' },
    { value: 'AMIGO(A)', label: 'AMIGO(A)' },
    { value: 'VECINO(A)', label: 'VECINO(A)' },]

    const ParentezcoSelected = (val: string) => {
        //setTrabajaDisplay(val === 'true'? 'block' : 'none')
        setParentezco(val)
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
                    <h6 className={MODAL_TITLE_CLASS}>*Nombre y Relación</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-12"}>
                            <CustomFieldText2 {...cprops} label={'Nombre(s)'} datoType='text' name={`${Prefijo}Nombre`} placeholder={'Nombre(s)'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Primer Apellido'} datoType='text' name={`${Prefijo}PrimerApellido`} placeholder={'Primer Apellido'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Segundo Apellido'} datoType='text' name={`${Prefijo}SegundoApellido`} placeholder={'Segundo Apellido'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-12"}>
                            <Parentesco {...cprops} label={'Parentesco'} name={`${Prefijo}Parentesco`} accion={ParentezcoSelected} valor={parentezco} />
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Datos y Contacto</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Edad'} datoType='number' name={`${Prefijo}Edad`} placeholder={'Edad'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Teléfono'} datoType='text' name={`${Prefijo}Celular`} placeholder={'Teléfono fijo o celular'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-12"}>
                            <CustomFieldText2 {...cprops} label={'Domicilio'} datoType='text' name={`${Prefijo}Domicilio`} placeholder={'Domicilio COMPLETO'} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}