import React from 'react'
import { ModalWin, AsistenteFormik, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasProspecto } from '../../../../../formas'
import DocsProspecto from '../DocsProspecto'
import AvalesProspecto from '../AvalesProspecto'
import { toast } from 'react-toastify'
import { FaPlus, FaSearch, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'

import CFormAvalesProspecto from '../CatalogoMesaCreditoIndex/CFormAvalesProspecto'

/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id: number,
    NombreProspecto: string
    fnCancelar(): any,
    RevisionDocumentosAval: number,
    FNGetLocal(),
    cbActualizar(item: any): any,
    //Item?: any,

    // Callbacks
    // cbActualizar(item: any): any,
    // cbGuardar(item: any): any
    // fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const CFormDocumentosAval = (props: FormaAgregarTipo) => {

    const [state, setState] = React.useState({
        Cargando: false,
    })

    // const validarDocs = ()=>{
    //     setState(s => ({ ...s, Cargando: true }))
    // }
    const FNupdateValidarDocumentosAvales = (ProspectoID: number) => {
        Funciones.FNupdateValidarDocumentosAvales(props.oidc, ProspectoID)
            .then((respuesta: any) => {
                props.cbActualizar(respuesta)
                props.fnCancelar()
                toast.success(respuesta.msj)
                //console.log(respuesta)

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
            })
    }



    // Render our component 
    return (
        <ModalWin open={props.mostrar} center large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? `DOCUMENTOS AVAL` : "Error al obtener Prospecto"}
                    <br />
                    PROSPECTO: &nbsp; {props.Id} &nbsp; {props.NombreProspecto}
                </h5>
                <button type="button" className="delete" onClick={() => {
                    props.fnCancelar()
                }} />
            </ModalWin.Header>
            <ModalWin.Body>
                {state.Cargando && <Spinner />}
                {!state.Cargando && <>
                    <CFormAvalesProspecto ProspectoID={props.Id} Documentos={true} />
                    <div style={{ textAlign: 'end' }}>
                        {props.RevisionDocumentosAval == 2 && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => FNupdateValidarDocumentosAvales(props.Id)}>Validar Documentos Aval</button>}
                        {props.RevisionDocumentosAval == 3 && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => FNupdateValidarDocumentosAvales(props.Id)}>Validar Documentos Aval</button>}
                    </div>

                    <div className="col-ms-12 d-flex justify-content-center">
                        {props.RevisionDocumentosAval == 1 && <FaCheckCircle color='green' size={40} />}
                    </div>

                </>}
            </ModalWin.Body>
        </ModalWin>
    )
}
