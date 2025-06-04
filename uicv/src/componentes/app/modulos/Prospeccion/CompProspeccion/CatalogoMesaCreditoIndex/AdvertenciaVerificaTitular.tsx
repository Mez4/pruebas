import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import { toast } from 'react-toastify'

import { useState } from 'react';


type FormaNotasTipo = {
    oidc: IOidc
    mostrar: boolean,
    ProspectoID: number,
    fnCerrarAdvertenciaAvales(): any,
    fnCancelarListaAvales(): any,
    cbActualizar(item: any): any,
    Filtro: number,
    initialValues: { Nota: string },

}

export const AdvertenciaVerificaTitular = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = useState(false);
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
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


    const FNVerificarAval = (ProspectoID: number) => {
        Funciones.FNupdateVerificaAvales(props.oidc, ProspectoID)
            .then((respuesta: any) => {
                setLoading(false)
                props.cbActualizar(respuesta)
                toast.success('REFERENCIAS VERIFICADAS CORRECTAMENTE', respuesta)
                props.fnCerrarAdvertenciaAvales()
                props.fnCancelarListaAvales()
            })
            .catch((error: any) => {

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

    const FNRechazaAvales = (ProspectoID: number, Nota: string) => {
        Funciones.FNupdateRechazarAvales(props.oidc, { ProspectoID, Nota })
            .then((respuesta: any) => {
                setLoading(false)
                props.cbActualizar(respuesta)
                toast.success('REFERENCIAS RECHAZADAS RECHAZADO', respuesta)
                props.fnCerrarAdvertenciaAvales()
                props.fnCancelarListaAvales()
            })
            .catch((error: any) => {

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
                    ADVERTENCIA
                </h5>
                <button type="button" className="delete" onClick={() => { props.fnCerrarAdvertenciaAvales() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <span >¿Esta Seguro de Realizar esta Acción? </span><br /><br />
                <div className="text-end">
                    <div className="row">
                        <div className="col-sm-12">
                            {props.Filtro == 2 && <input className="form-control" type="text" placeholder="Nota" onChange={e => FnNota(e.target.value)} />}
                            <h1></h1>
                            <button onClick={() => {
                                if (props.Filtro == 1) {
                                    FNVerificarAval(props.ProspectoID)
                                }
                                else {
                                    FNRechazaAvales(props.ProspectoID, state.Nota)
                                }
                            }}
                                type="submit" className="ms-1 btn btn-success waves-effect waves-light">ACEPTAR</button>
                        </div>
                    </div>
                </div>

            </ModalWin.Body>
        </ModalWin>
    )
}

