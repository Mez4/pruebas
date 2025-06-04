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

    // Modal controls
    mostrar: boolean,
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const AgregarReferenciaAval = (props: FormaAgregarTipo) => {

    const [state, setState] = React.useState({
        Cargando: false,
        confirm: false,
    })

    const validarRefs = ()=>{
        setState(s => ({ ...s, Cargando: true, confirm: false }))
        Funciones.FNValidarReferenciasAvales(props.oidc, props.Id)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))
                props.cbGuardar(respuesta)
            })
            .catch((error: any) => {
                toast.error("Error al validar Referencias los Avales")
                setState(s => ({ ...s, Cargando: false }))
            })
    }

    const closeMdl = () => setState(s=>({...s, confirm: false}))
    const confirm = () => setState(s=>({...s, confirm: true}))
    // Render our component 
    return (
        <>
            <ModalWin open={props.mostrar} large center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        {props.Id ? `Captura de Referencias Aval` : "Error al obtener Prospecto"}
                    </h5>
                    <button type="button" className="delete" onClick={() => {
                        props.fnCancelar()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <h6 className={MODAL_TITLE_CLASS}>
                        Selecciona un Aval para ver sus Referencias
                    </h6>
                    {state.Cargando && <Spinner />}
                    {!state.Cargando && <>
                        <AvalesProspecto ProspectoID={props.Id} Documentos={false}/>
                        <div style={{textAlign: 'end'}}>
                            <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={confirm}>VALIDAR REFERENCIAS AVAL</button>
                        </div>
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
                    <div style={{padding: '1em'}}>
                        <span >¿Esta Seguro(a) de marcar como VALIDADAS las Referencias del los Avales Registrados? </span><br/><br/>
                        <FaExclamationTriangle />
                        <span > Atención: Al validar confirma que la información capturada es revisada correctamente.</span><br/>
                    </div>
                    <div style={{textAlign: 'end'}}>
                        <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={validarRefs}>CONTINUAR Y VALIDAR DOCUMENTOS</button>
                    </div>
                </ModalWin.Body>
            </ModalWin>
        </>
    )
}
