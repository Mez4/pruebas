import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import { ControlAsentamientos, Ocupaciones, BuscarAsentamiento, TipoVivienda } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import TiposDistribuidores from '../../selectores/TiposDistribuidores'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    TipoDvID?: number,
}

export const FormaDatosTipoDv = ({ Prefijo, Titulo, SubTitulo, TipoDvID }: DireccionTipo) => {
    
    const [tipoDv, setTipoDv] = React.useState(0)

    const InitialValues: any = {}
    InitialValues[`${Prefijo}DistribuidorTiposID`]    = ''
    
    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}DistribuidorTiposID`] = Yup.number().typeError('Ingrese una opcion').required().min(1)
    
    const tipoDvSelected = (val: number) => setTipoDv(val)
    
    if(TipoDvID && tipoDv === 0)
        tipoDvSelected(TipoDvID)

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div className={"row"}>
                    <h6 className={MODAL_TITLE_CLASS}>*Informacíon Origen</h6>
                    <div className={"col-sm-12 col-md-12"}>
                        <TiposDistribuidores {...cprops} label={'Tipo Socia'} name={`${Prefijo}DistribuidorTiposID`} accion={tipoDvSelected} valor={tipoDv} />
                    </div>
                </div>
            </div>
        )
    }
}