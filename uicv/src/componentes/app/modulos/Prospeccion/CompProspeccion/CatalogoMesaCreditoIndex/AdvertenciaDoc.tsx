import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { ActionSelect, Card, CustomFieldText, Spinner } from '../../../../../global'
import { FaPlus, FaSearch, FaCheckCircle, FaClock, FaExclamationTriangle, FaCommentDots } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import ReactTooltip from 'react-tooltip';
import { Input } from 'usetheform'
import { inputCSS } from 'react-select/src/components/Input'
import { MdInput } from 'react-icons/md'
import { TextInput } from 'react-native'
//import { FNCancelar } from '../../../tesoreria/CompTesoreria/AdmCuentasBancariasMovimientos/Funciones'




type FormaNotasTipo = {
    oidc: IOidc
    mostrar: boolean,
    DocumentoID: number,
    tipoDocumentoID: number,
    fnCancelar(): any,
    fnCancelar2(): any,
    FNGetLocal(): any,
    Filtro: number,
    initialValues: { Nota: string },

}

export const AdvertenciaDoc = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = useState(false);
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
        Form: {
            src: '',
            VerDocumento: false,
        },
        Nota: '',
        VerDocumento: false,
        optNotas: [],
    })

    const ValSchemaObjecet: any = {}
    if(props.Filtro == 0)
        ValSchemaObjecet['Mensaje'] = Yup.string().required("Campo Obligatorio")
    
    const GetMensajesFijos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMensajesFijos(props.oidc, {StatusProcesoID: 10, TipoDocumentoID: props.tipoDocumentoID })
            .then((respuesta: any) => {
                var mensajes = respuesta.map((valor: any) => {
                    var obj = { value: valor.Mensaje, label: valor.Mensaje };
                    return obj
                });

                setState(s => ({ ...s, optNotas: mensajes }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNotas: [] }))
            })
    }

    const FNAutorizaDocumento = (DocumentoID: number) => {
        setState(e=>({...e, Cargando: true}))
        Funciones.FNupdateAutorizaDocumento(props.oidc, DocumentoID)
            .then((respuesta: any) => {
                setLoading(false)
                //console.log(respuesta)
                toast.success(respuesta)
                props.fnCancelar()
                props.fnCancelar2()
                props.FNGetLocal()
            })
            .catch((error: any) => {
                setState(e=>({...e, Cargando: false}))
                if (error.request.response == "") {
                    if (error.response)
                        toast.error(`Response Error:${error.respose.data}`)
                    else if (error.request)

                        toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                    else
                        toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                }
                else {
                    toast.error(error.response.data)
                }
            })
    }

    const FNRechazaDocumento = (DocumentoID: number, Nota: string) => {
        setState(e=>({...e, Cargando: true}))
        Funciones.FNupdateRechazaDocumento(props.oidc, { DocumentoID, Nota })
            .then((respuesta: any) => {
                setLoading(false)
                //console.log(respuesta)
                toast.success(respuesta)
                props.fnCancelar()
                props.fnCancelar2()
                props.FNGetLocal()
            })
            .catch((error: any) => {
                setState(e=>({...e, Cargando: false}))
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
            })
    }

    const FnNota = (Nota: string) => {
        setState(s => ({ ...s, Nota: Nota }))
        //console.log(state.Nota)
    }

    React.useEffect(() => {
        GetMensajesFijos()
    }, [])

    return (

        <ModalWin open={props.mostrar} center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMACIÓN
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <span >{props.Filtro == 0 ? 'Agrega una Nota con el motivo del rechazo.' : 'Da click en Aceptar para validar el documento'}</span><br /><br />
                <div className="text-start">
                    <div className="row">
                        <div className="col-sm-12">
                            {/* <div className="input-group mb-5"> */}
                            {/* {props.Filtro == 0 && <input className="form-control" type="text" placeholder="Nota" onChange={e => FnNota(e.target.value)} />}
                            <br />
                            {state.Cargando && <Spinner/>}
                            {!state.Cargando && <button onClick={() => {
                                if (props.Filtro == 1) {
                                    FNAutorizaDocumento(props.DocumentoID)
                                }
                                else {
                                    FNRechazaDocumento(props.DocumentoID, state.Nota)
                                }
                            }}
                                type="submit" className="ms-1 btn btn-success waves-effect waves-light">ACEPTAR</button>} */}
                            <Formik initialValues={{Mensaje: ''}}
                                enableReinitialize
                                validationSchema={Yup.object().shape(ValSchemaObjecet)}
                                onSubmit={(values: any) => {
    
                                    setState(e => ({ ...e, Cargando: true}))
                                    if(values.Mensaje === '' && props.Filtro == 0){ 
                                        toast.error(`ES NECESARIO SELECCIONAR UN MOTIVO`)
                                    }else{
                                        if (props.Filtro == 1) 
                                            FNAutorizaDocumento(props.DocumentoID)
                                        else
                                            FNRechazaDocumento(props.DocumentoID, `${values.Mensaje} ${state.Nota ? ' - '+state.Nota : ''}`)
                                    }
                                
                                }} >
                            <Form>
                            {props.Filtro == 0 &&<div>
                                <ActionSelect
                                    disabled={loading}
                                    label="Nota"
                                    name="Mensaje"
                                    placeholder="Selecciona el motivo de la nota"
                                    options={state.optNotas}
                                    addDefault={true}
                                />
                                <label>Anotación</label>
                                <textarea  className="form-control" name='Anotacion' id='Anotacion' rows={5} placeholder="Escribe aquí un Mensaje para complementar la Nota a enviar (Opcional)" onChange={e => FnNota(e.target.value)} />
                            </div>}
                            <div className="text-center">
                                <br />
                                {state.Cargando && <Spinner/>}
                                {!state.Cargando&& props.Filtro !== 0 && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-success waves-effect waves-light">ACEPTAR</button>}
                                {!state.Cargando&& props.Filtro === 0 && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-primary waves-effect waves-light"><FaCommentDots size={20} /> ENVIAR MENSAJE</button>}
                            </div>
                            </Form>
                            </Formik>
                        </div>
                    </div>
                </div>

            </ModalWin.Body>
        </ModalWin>
    )
}

