import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import { toast } from 'react-toastify'

import { useState } from 'react';
import { ActionSelect, Spinner } from '../../../../../global'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FaCommentDots } from 'react-icons/fa'

type FormaNotasTipo = {
    oidc: IOidc
    mostrar: boolean,
    ReferenciaID: number,
    fnCancelaAdvertencia(): any,
    fnCerrarInfoRefTitular(): any,
    FNGetLocal(): any,
    Filtro: number,
    initialValues: { Nota: string },

}

export const AdvertenciaValidaRefTitular = (props: FormaNotasTipo) => {

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
    if(props.Filtro == 2)
        ValSchemaObjecet['Mensaje'] = Yup.string().required("Campo Obligatorio")

    const GetMensajesFijos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMensajesFijos(props.oidc, {StatusProcesoID: 12, TipoDocumentoID: 0 })
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

    const FNValidaRef = (ReferenciaID: number) => {
        setState(e=>({...e, Cargando: true}))
        Funciones.FNupdateValidaRefTitular(props.oidc, ReferenciaID)
            .then((respuesta: any) => {
                setLoading(false)
                toast.success('REFERENCIA VALIDADA CORRECTAMENTE', respuesta)
                props.fnCancelaAdvertencia()
                props.fnCerrarInfoRefTitular()
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

    const FNRechazaRef = (ReferenciaID: number, Nota: string) => {
        setState(e=>({...e, Cargando: true}))
        Funciones.FNupdateRechazRefTitular(props.oidc, { ReferenciaID, Nota })
            .then((respuesta: any) => {
                setLoading(false)
                toast.success('REFERENCIA RECHAZADA CORRECTAMENTE', respuesta)
                props.fnCancelaAdvertencia()
                props.fnCerrarInfoRefTitular()
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

    const FnNota = (Nota: string) => {
        setState(s => ({ ...s, Nota: Nota }))
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
                <button type="button" className="delete" onClick={() => { props.fnCancelaAdvertencia() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <span >{props.Filtro == 2 ? 'Agrega una Nota con el motivo.' : 'Da click en Aceptar para validar'}</span><br /><br />
                <div className="text-start">
                    <div className="row">
                        <div className="col-sm-12">
                            {/* {props.Filtro == 2 && <input className="form-control" type="text" placeholder="Nota" onChange={e => FnNota(e.target.value)} />}
                            <h1></h1>
                            {state.Cargando && <Spinner/>}
                            {!state.Cargando && <button onClick={() => {
                                if (props.Filtro == 1) {
                                    FNValidaRef(props.ReferenciaID)
                                }
                                else {
                                    FNRechazaRef(props.ReferenciaID, state.Nota)
                                }
                            }}
                                type="submit" className="ms-1 btn btn-success waves-effect waves-light">ACEPTAR</button>} */}
                            <Formik initialValues={{Mensaje: ''}}
                                enableReinitialize
                                validationSchema={Yup.object().shape(ValSchemaObjecet)}
                                onSubmit={(values: any) => {
    
                                    setState(e => ({ ...e, Cargando: true}))
                                    if(values.Mensaje === '' && props.Filtro == 2){ 
                                        toast.error(`ES NECESARIO SELECCIONAR UN MOTIVO`)
                                    }else if(props.Filtro == 2){
                                        FNRechazaRef(props.ReferenciaID, `${values.Mensaje} ${state.Nota ? ' - '+state.Nota : ''}`)
                                    }else if(props.Filtro == 1){
                                        FNValidaRef(props.ReferenciaID)
                                    }
                                
                                }} >
                            <Form>
                                {props.Filtro == 2 &&<div>
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
                                    {!state.Cargando&& props.Filtro === 2 && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-primary waves-effect waves-light"><FaCommentDots size={20} /> ENVIAR MENSAJE</button>}
                                    {!state.Cargando&& props.Filtro !== 2 && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-success waves-effect waves-light">ACEPTAR</button>}
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

