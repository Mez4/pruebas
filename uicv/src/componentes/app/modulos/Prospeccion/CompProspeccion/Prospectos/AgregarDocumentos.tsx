import React from 'react'
import { ModalWin, AsistenteFormik, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasProspecto } from '../../../../../formas'
import DocsProspecto from '../DocsProspecto'
import { toast } from 'react-toastify'
import { FaExclamationTriangle } from 'react-icons/fa'

/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id: number,
    Item?: any,

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,
    Procesos: [],
    Prospecto,
    // Modal controls
    mostrar: boolean,
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */

export const AgregarDocumento = (props: FormaAgregarTipo) => {

    const [state, setState] = React.useState({
        Cargando: false,
        confirm: false,
    })

    const validarDocs = () => {
        setState(s => ({ ...s, Cargando: true, confirm: false }))
        Funciones.FNValidarDocumentos(props.oidc, props.Id)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))
                props.cbGuardar(respuesta)
            })
            .catch((error: any) => {
                toast.error("Error al validar Documentos")
                setState(s => ({ ...s, Cargando: false }))
            })
    }

    const validarDocsCompletos = () => {
        setState(s => ({ ...s, Cargando: true, confirm: false }))
        Funciones.FNValidarDocumentosCompletos(props.oidc, props.Id)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))
                props.cbGuardar(respuesta)
            })
            .catch((error: any) => {
                toast.error("Error al validar Documentos")
                setState(s => ({ ...s, Cargando: false }))
            })
    }


    const closeMdl = () => setState(s => ({ ...s, confirm: false }))
    const confirm = () => setState(s => ({ ...s, confirm: true }))
    // Render our component 
    console.log('PROPS: ', props)
    return (
        <>
            <ModalWin open={props.mostrar} large center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        {props.Id ? `Continuar Alta` : "Error"}
                    </h5>
                    <button type="button" className="delete" onClick={() => {
                        props.fnCancelar()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {state.Cargando && <Spinner />}
                    {!state.Cargando && <>
                        <div style={{ textAlign: 'end' }}>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && x.Validado) && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={confirm}>VALIDAR DOCUMENTOS</button>}
                            <div>
                                {!props.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && x.Validado) && "DOCUMENTOS OBLIGATORIOS: INE / CURP / COMP. DOMICILIO / AUT. BURO / FIRMA"}
                            </div>
                            {!props.Procesos.find((x: any) => x.Descripcion === 'REVISION REFERENCIAS TITULAR' && x.Validado) && props.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && x.Validado) && props.Prospecto.PantallaProcesoID == 3 && <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={validarDocsCompletos}>VALIDAR DOCUMENTOS</button>}
                            <div>
                                {!props.Procesos.find((x: any) => x.Descripcion === 'REVISION REFERENCIAS TITULAR' && x.Validado) && props.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && x.Validado) && props.Prospecto.PantallaProcesoID == 3 && "**VALIDAR DOCUMENTOS HASTA TENER"}
                            </div>
                            <div>
                                {!props.Procesos.find((x: any) => x.Descripcion === 'REVISION REFERENCIAS TITULAR' && x.Validado) && props.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && x.Validado) && props.Prospecto.PantallaProcesoID == 3 && " TODOS LOS DOCUMENTOS CARGADOS**"}
                            </div>
                        </div>
                        <DocsProspecto ProspectoID={props.Id} />
                    </>}
                </ModalWin.Body>
            </ModalWin>
            <ModalWin open={state.confirm} center >
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        CONFIRMACION DE VALIDACIÓN
                    </h5>
                    <button type="button" className="delete" onClick={() => {
                        closeMdl()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div style={{ padding: '1em' }}>
                        <span >¿Esta Seguro(a) de marcar como VALIDADOS los Documentos Registrados? </span><br /><br />
                        <FaExclamationTriangle />
                        <span > Atención: Una vez validados NO podrá actualizar los Documentos del Prospecto.</span><br />
                    </div>
                    <div style={{ textAlign: 'end' }}>
                        <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={validarDocs}>CONTINUAR Y VALIDAR DOCUMENTOS</button>
                    </div>
                </ModalWin.Body>
            </ModalWin>
        </>
    )
}
