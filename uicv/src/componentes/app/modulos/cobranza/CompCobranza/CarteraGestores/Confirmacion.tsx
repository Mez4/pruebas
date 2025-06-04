import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa'

import { CFormDocumentos } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormDocumentos'

import CatalogoMesaCreditoIndex from "../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex"



type CFormConfirmarType = {
    oidc: IOidc
    Id?: number,
    Confirmacion: boolean,
    fnCancelar(): any,
    cbActualizar(item: any): any,
    initialValues: { TicketID: number, FechaRegistro: Date, Activo: boolean, DistribuidorID: number, Monto: number },
    DistribuidorDesc: string,
    FNGetLocal(): any,


}

export const Confirmacion = (props: CFormConfirmarType) => {
    // Loading
    const [loading, setLoading] = React.useState(false)

    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        CFormDocumentos: false,
        CatalogoMesaCreditoIndex: false,
        CodigoCancelacion: '',
        Form:
        {
            Mostrar: false,
            Id: undefined,
        },
    })

    const CodigosCancelacion = (CodigoCancelacion: string) => {
        setState(s => ({ ...s, CodigoCancelacion: CodigoCancelacion }))
        // console.log(Monto, 'yyyyyyyyyyyyyyyyyyyyyyyyy')
    }

    const FNCancelarTicket = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.CancelarTicket(props.oidc, props.initialValues.TicketID, props.initialValues.Monto, props.initialValues.DistribuidorID, state.CodigoCancelacion)
            .then((respuesta: any) => {
                setLoading(false)
                props.FNGetLocal()
                props.fnCancelar()
                toast.success(respuesta.msj)
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })
    }

    return (

        <ModalWin open={props.Confirmacion} center >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMAR <br />
                    <h5 className={MODAL_TITLE_CLASS}>SOCIA: {props.initialValues.DistribuidorID} {props.DistribuidorDesc}</h5>
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <div style={{ padding: '1em' }}>
                    <span >¿Esta Seguro(a) de Cancelar el TicketID {props.initialValues.TicketID}? Con Abono de ${props.initialValues.Monto} </span><br /><br />
                    {/* <FaExclamationTriangle/>
                    <span > Atención: El Prospecto iniciara el proceso de Docs Titular y no habra marcha atras.</span> */}
                    <br />
                </div>

                <div className="text-center">
                    <div className="row justify-content-center">
                        <p>Escriba el Codigo de Cancelacion</p>

                        <input type="text" placeholder="Codigo" className="form-control" style={{ fontSize: '1em', width: '10em' }} onChange={e => CodigosCancelacion(e.target.value)} />

                    </div>
                </div>

                <div className="text-end">
                    {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                    </button> */}
                    {/* {state.Cargando && <Spinner />}
                    {!state.Cargando &&  */}
                    <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { FNCancelarTicket() }} >Aceptar</button>
                    {/* } */}
                </div>
            </ModalWin.Body>
        </ModalWin>


    )
}