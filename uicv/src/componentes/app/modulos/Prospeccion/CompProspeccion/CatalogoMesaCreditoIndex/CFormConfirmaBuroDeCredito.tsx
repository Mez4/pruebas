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
    Item: any,
    MostrarCFormConfirmar: boolean,
    fnCancelar(): any,
    formaCFormBuroDeCredito(),
    cbActualizar(item: any): any,
    ProspectoID: number
    NombreProspecto: string

}

export const CFormConfirmarBuroDeCredito = (props: CFormConfirmarType) => {
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
        Form:
        {
            Mostrar: false,
            Id: undefined,
        },
    })

    // Return the component

    const fnConfirmar = (ProspectoID: number) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNupdateProceso(props.oidc, ProspectoID, 8)
            .then((respuesta: any) => {
                props.cbActualizar(respuesta)
                props.formaCFormBuroDeCredito() // Abrir forma de buro de credito
                toast.success(respuesta.msj)

            })
            .catch((error: any) => {
                setState(s => ({ ...s, Cargando: false }))
                props.fnCancelar()
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
            })
    }

    return (

        <ModalWin open={props.MostrarCFormConfirmar} center >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMAR
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <div style={{ padding: '1em' }}>
                    <span >¿Esta Seguro(a) de iniciar el proceso de consulta de Buro de Crédito? </span><br /><br />
                    {/* <FaExclamationTriangle />
                    <span > Atención: El Prospecto iniciara el proceso de Buro de credito y no habra marcha atras.</span> */}
                    <br />
                </div>
                <div className="text-end">
                    {state.Cargando && <Spinner/> }
                    {!state.Cargando && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { fnConfirmar(props.ProspectoID) }} >INICIAR CONSULTA</button>}
                </div>
            </ModalWin.Body>
        </ModalWin>


    )
}