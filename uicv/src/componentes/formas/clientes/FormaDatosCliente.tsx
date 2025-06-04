import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2 } from '../../global'
import { PagareEstatus, Sucursales, Distribuidores } from '../../selectores'

type DireccionTipo = {
    SociaID?: number,
    EsZonal?: boolean, 
    SucursalID?: number
}

export const FormaDatosCliente = ({ SociaID, EsZonal, SucursalID }: DireccionTipo) => {
    const ValSchemaObjecet: any = {}
    if(SociaID === undefined){
        ValSchemaObjecet[`DistribuidorID`]   = Yup.number().required().min(1)
    }
    return {
        InitialValues: { LineaCreditoPersonal: 0, PagareEstatusId: 0, PagareCantidad: 0, IdentificadorAnterior: '', SucursalID: 0, DistribuidorID: 0 },
        Propiedades: {},
        Titulo: "Cliente",
        SubTitulo: "Datos",
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        //ValidationSchema: Yup.object().shape({
            // LineaCreditoPersonal: Yup.number().min(0),
            // PagareEstatusId: Yup.number().required().min(0),
            // PagareCantidad: Yup.number().required().min(0),
            // IdentificadorAnterior: Yup.string().required().min(0).max(250),
            //DistribuidorID: Yup.number().required().min(1)
        //}),
        Componente: (cprops: any) => (
            <div>
                {/* <CustomFieldText2 disabled={cprops.Cargando} label={'Linea Credito Personal'} name={'LineaCreditoPersonal'} placeholder={''} />
                <PagareEstatus {...cprops} />
                <CustomFieldText2 disabled={cprops.Cargando} label={'Pagare Cantidad'} name={'PagareCantidad'} placeholder={''} />
                <CustomFieldText2 disabled={cprops.Cargando} label={'Identificador Anterior'} name={'IdentificadorAnterior'} placeholder={''} /> */}
                <hr/>
                {/* <Sucursales unaLinea/> */}
                <Distribuidores name={'DistribuidorID'} valor={SociaID} disabled={SociaID !== undefined && !EsZonal} EsZonal={EsZonal} SucursalID={SucursalID}/>
            </div>
        ),
    }
}