import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import { toast } from 'react-toastify'

import { useState } from 'react';
import { Spinner } from '../../../../../global'


type FormaNotasTipo = {
    oidc: IOidc
    mostrar: boolean,
    ProspectoID: number,
    fnCerrarAdvertenciaRefs(): any,
    fnCancelarListaRefTirulares(): any,
    cbActualizar(item: any): any,
    Filtro: number,
    initialValues: { Nota: string },

}

export const AdvertenciaVerificaRefTitular = (props: FormaNotasTipo) => {

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
    })


    const FNVerificarRefsTitular = (ProspectoID: number) => {
        setState(e=>({...e, Cargando: true}))
        Funciones.FNupdateVerificaReferenciasTitular(props.oidc, ProspectoID)
            .then((respuesta: any) => {
                setLoading(false)
                props.cbActualizar(respuesta)
                toast.success('REFERENCIAS VERIFICADAS CORRECTAMENTE', respuesta)
                props.fnCerrarAdvertenciaRefs()
                props.fnCancelarListaRefTirulares()
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

    const FNRechazaRefsTitular = (ProspectoID: number, Nota: string) => {
        setState(e=>({...e, Cargando: true}))
        Funciones.FNupdateRechazarReferenciasTitular(props.oidc, { ProspectoID, Nota })
            .then((respuesta: any) => {
                setLoading(false)
                props.cbActualizar(respuesta)
                toast.success('REFERENCIAS RECHAZADAS CORRECTAMENTE', respuesta)
                props.fnCerrarAdvertenciaRefs()
                props.fnCancelarListaRefTirulares()
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

    return (


        <ModalWin open={props.mostrar} center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMACIÓN
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCerrarAdvertenciaRefs() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <span >{props.Filtro == 2 ? 'Agrega una Nota con el motivo.' : 'Da click en Aceptar para validar'}</span><br /><br />
                <div className="text-end">
                    <div className="row">
                        <div className="col-sm-12">
                            {props.Filtro == 2 && <input className="form-control" type="text" placeholder="Nota" onChange={e => FnNota(e.target.value)} />}
                            <h1></h1>
                            {state.Cargando && <Spinner/>}
                            {!state.Cargando && <button onClick={() => {
                                if (props.Filtro == 1) {
                                    FNVerificarRefsTitular(props.ProspectoID)
                                }
                                else {
                                    FNRechazaRefsTitular(props.ProspectoID, state.Nota)
                                }
                            }}
                                type="submit" className="ms-1 btn btn-success waves-effect waves-light">ACEPTAR</button>}
                        </div>
                    </div>
                </div>

            </ModalWin.Body>
        </ModalWin>
    )
}

