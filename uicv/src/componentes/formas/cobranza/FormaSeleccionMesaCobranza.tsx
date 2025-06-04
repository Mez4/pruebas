import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import { ControlAsentamientos, Ocupaciones, BuscarAsentamiento } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    optProdMesa: { value: number, label: string }[],

}

export const FormaSeleccionMesaCobranza = ({ Prefijo, Titulo, SubTitulo, optProdMesa }: DireccionTipo) => {

    const InitialValues: any = {}
    InitialValues[`${Prefijo}MesaCobranzaID`] = 0

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}MesaCobranzaID`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <CustomSelect2
                    {...cprops}
                    name={`${Prefijo}MesaCobranzaID`}
                    disabled={false}
                    options={optProdMesa}
                    addDefault={false}
                    label={'Mesa Cobranza'}
                    placeholder={'Seleccione una mesa cobranza'} />
            </div>
        )
    }
}