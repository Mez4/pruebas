import React from 'react'

import * as Funciones from '../CatalogoAclaracion/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { Card, CustomFieldText, Spinner } from '../../../../../global'
import { FaCommentDots, FaPlus, FaRegBell, FaSearch, FaUserCheck, FaUserEdit, FaUserTie } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import moment from 'moment'
import { toast } from 'react-toastify'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    EnviadoDesde: boolean,
    Item: any,
    mostrar: boolean,
    fnCancelar(): any,
    AclaracionID: number,
    cbActualizar(item: any): any,
    TipoMesa: number
}
export const CFormMensajes = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const DatosDefecto = {
        TipoDocumentoID: 0,
        NombreDocumento: '',
        Clave: '',
        Descripcion: '',
        DocumentoID: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0
    }
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
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined

        },
        Mostrar: false,
        Nota: '',
    })


    const FNEnviarMensaje = () => {
        console.log("ENTRO ENVIAR MENSAJE")
        let a =
        {
            AclaracionID: props.AclaracionID,
            Mensaje: state.Nota,
            EnviadoDesdePantalla: props.EnviadoDesde
        }
        setState({ ...state, Cargando: true })
        Funciones.FNEnviarMensaje(props.oidc, a)
            .then((respuesta: any) => {
                FnGet();
                setState({ ...state, Cargando: false, Nota: '', Mostrar: false })
            })
            .catch((error: any) => {
                //setState(s => ({ ...s, Cargando: false }))
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                props.fnCancelar()
            })
    }
    const mensajesLeido = (aclaracionID: number) => {
        console.log(aclaracionID)
        let a = {
            AclaracionID: aclaracionID,
            EnviadoDesdePantalla: !props.EnviadoDesde
        }
        Funciones.FNGetNotificacionLeida(props.oidc, a)
            .then((respuesta: any) => {
                props.cbActualizar(respuesta)
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
            })
    }
    const FnGet = () => {
        let a =
        {
            AclaracionID: props.AclaracionID,
        }
        setState({ ...state, Cargando: true })
        Funciones.FNGetMensajes(props.oidc, a)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Datos: respuesta, Cargando: false }))
                mensajesLeido(props.AclaracionID)
            })
            .catch((error: any) => {
                //setState(s => ({ ...s, Cargando: false }))
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                props.fnCancelar()
            })
    }

    //const fnCancelar = () => setState(s => ({ ...s, Mostrar: false }))

    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: '',
                    selector: 'LogMensajeID',
                    center: true,
                    width: '15%',
                    cell: (props) =>
                        <>
                            {props.EnviadoDesdePantalla && <div style={{ textAlign: 'center' }}>
                                <FaUserTie color='#D0D0D0' size={20} /><br />
                                <span style={{ fontSize: '.7em', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>COORDINADOR</span>
                            </div>}
                        </>
                },
                {
                    name: '',
                    selector: 'Mensaje',
                    sortable: true,
                    width: '68%',

                    cell: (row) =>
                        <>
                            <div style={{ width: '100%' }} className={`${row.EnviadoDesdePantalla ? 'chatLeft' : 'chatRight'}`}>
                                <div className={`${row.EnviadoDesdePantalla ? 'boxChat sb2' : 'boxChat sb1'}`} style={{ width: '60%' }}>
                                    <table style={{ width: '-webkit-fill-available' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ fontWeight: 'bold', textAlign: 'start' }}>
                                                    {row.Mensaje} &nbsp;

                                                    {!props.EnviadoDesde && <>  {!row.Leido && !row.EnviadoDesdePantalla && <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.11 2.9 18 4 18H8L12 22L16 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M20 16H15.17L12 19.17L8.83 16H4V4H20V16M10.75 13.71L7.25 10.21L8.66 8.79L10.75 10.88L15.34 6.3L16.75 7.71L10.75 13.71Z" />
                                                    </svg>} {row.Leido && !row.EnviadoDesdePantalla && <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.11 2.9 18 4 18H8L12 22L16 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M10.46 14L6.96 10.5L8.37 9.08L10.46 11.17L15.64 6L17.05 7.41L10.46 14Z" />
                                                    </svg>} </>
                                                    }

                                                    {props.EnviadoDesde && <>
                                                        {!row.Leido && row.EnviadoDesdePantalla && <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.11 2.9 18 4 18H8L12 22L16 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M20 16H15.17L12 19.17L8.83 16H4V4H20V16M10.75 13.71L7.25 10.21L8.66 8.79L10.75 10.88L15.34 6.3L16.75 7.71L10.75 13.71Z" />
                                                        </svg>}
                                                        {row.Leido && row.EnviadoDesdePantalla && <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.11 2.9 18 4 18H8L12 22L16 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M10.46 14L6.96 10.5L8.37 9.08L10.46 11.17L15.64 6L17.05 7.41L10.46 14Z" />
                                                        </svg>}</>
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic' }}>
                                                    {row.StatusProcesoID > 0 && `PROCESO: ${row.Proceso}`}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: '.8em', textAlign: 'end', fontWeight: 'bold', fontStyle: 'italic' }}>
                                                    {moment(row.Fecha_hora).utc().format('DD/MM/YYYY HH:mm')}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                },
                {
                    name: '',
                    selector: 'LogMensajeID',
                    center: true,
                    width: '15%',
                    cell: (props) =>
                        <>
                            {!props.EnviadoDesdePantalla && <div style={{ textAlign: 'center' }}>
                                <FaUserEdit color='#D0D0D0' size={20} /><br />
                                <span style={{ fontSize: '.7em', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>ANALISTA</span>
                            </div>}
                        </>
                },
            ]
        return colRet
    }, [])

    // Use effect
    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGet()
        }
    }, [props.AclaracionID > 0])

    return (
        <ModalWin open={props.mostrar} large center={true} >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    NOTAS DE LA ACLARACION <span style={{ fontWeight: 'bold' }}>N° {props.AclaracionID}</span>
                </h5>
                <button type="button" className="delete" onClick={() => {
                    props.fnCancelar()
                }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <>
                    <div className="row">
                        <div className="col-12">
                            <Card>
                                <Card.Body>
                                    <Card.Body.Content>
                                        <div style={{ textAlign: 'end', marginBottom: '1em' }}>
                                            <button className="btn btn-outline-primary" type="button" onClick={() => FnGet()} ><FiRefreshCcw /></button>
                                        </div>
                                        {state.Cargando && <Spinner />}
                                        {state.Error && <span>Error al cargar los datos...</span>}
                                        {!state.Cargando && !state.Error &&
                                            <div>
                                                <div className='scroll-bottom-container'>
                                                    <div>
                                                        <DataTable
                                                            data={state.Datos}
                                                            striped
                                                            dense
                                                            noHeader
                                                            responsive
                                                            keyField={"LogMensajeID"}
                                                            columns={Columns}
                                                        />
                                                    </div>
                                                </div>
                                                {loading && <Spinner />}
                                                {!loading && <div className='text-center m-2'>
                                                    <button className="btn btn-primary" type="button" onClick={() => setState(s => ({ ...s, Mostrar: true }))}><FaCommentDots size={20} /> AGREGAR MENSAJE</button>
                                                </div>}
                                            </div>}
                                    </Card.Body.Content>
                                </Card.Body>
                            </Card>
                        </div>
                    </div >
                    {state.Mostrar && <ModalWin open={state.Mostrar} center>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}> MENSAJE </h5>
                            <button type="button" className="delete" onClick={() =>
                                setState(s => ({ ...s, Mostrar: false }))
                            } />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <div className="text-end">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <textarea className="form-control" placeholder="Nota" onChange={e => FnNota(e.target.value)} />
                                        <br />
                                        <button
                                            type="button" className="ms-1 btn btn-success waves-effect waves-light" onClick={e => FNEnviarMensaje()}>ENVIAR</button>
                                    </div>
                                </div>
                            </div>

                        </ModalWin.Body>
                    </ModalWin>}
                </>
            </ModalWin.Body>
        </ModalWin>
    )
}