import React from 'react'

import * as Funciones from './/Funciones'
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
import { FaCommentDots, FaPlus, FaSearch, FaUserEdit, FaUserTie } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import moment from 'moment'
import { toast } from 'react-toastify'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCancelar(): any,
    ProspectoID: number,
    nombreP: string,
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

    const FnGet = () => {
        setState(s => ({ ...s, Cargando: true}))
        Funciones.FNGetNotificaciones(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Datos: respuesta.data, Cargando: false }))
                mensajesLeido(props.ProspectoID)
            })
            .catch((error: any) => {
                setState(s => ({ ...s, Cargando: false }))
                if (error.response) 
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                props.fnCancelar()
            })
    }

    const mensajesLeido = (prospectoID: number) =>{
        console.log(prospectoID)
        Funciones.FNGetNotificacionLeida(props.oidc, prospectoID)
            .then((item: any) => {
                props.Item.MsjNoLeidosMesa = null;
                props.cbActualizar(props.Item)
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

    const fnCancelar = () => setState(s => ({...s, Mostrar: false}))

    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const FNEnviarMensajes = (ProspectoID: number, Nota: string) => {
        setLoading(true)
        Funciones.FNEviarMsjPromotorSucursal(props.oidc, { ProspectoID, Nota, TipoMesa: props.TipoMesa })
            .then((respuesta: any) => {
                setLoading(false)
                toast.success('MENSAJE ENVIADO', respuesta)
                setState({ ...state, Datos: [...state.Datos, respuesta]  })
                fnCancelar()
            })
            .catch((error: any) => {
                setLoading(false)
                if (error.response) 
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

            })
    }

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
                        {!props.EnviadoDesdeMesa  && <div style={{textAlign: 'center'}}>
                            <FaUserTie color='#D0D0D0' size={20}/><br />
                            <span style={{fontSize: '.7em', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center'}}>PROMOTOR / SUCURSAL</span>
                        </div>}
                    </>
                },
                {
                    name: '',
                    selector: 'Mensaje',
                    sortable: true,
                    width: '68%',
                    cell: (props) =>
                        <>
                            <div style={{width: '100%'}} className={`${!props.EnviadoDesdeMesa ? 'chatLeft' : 'chatRight'}`}>
                                <div className={`${!props.EnviadoDesdeMesa ? 'boxChat sb2' : 'boxChat sb1'}`} style={{width: '60%'}}>
                                    <table style={{width: '-webkit-fill-available'}}>
                                        <tbody>
                                            <tr>
                                                <td style={{fontWeight: 'bold', textAlign: 'start'}}>
                                                    {props.Mensaje}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic'}}>
                                                    {props.StatusProcesoID > 0 && `PROCESO: ${props.Proceso}`}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{fontSize: '.8em', textAlign: 'end', fontWeight: 'bold', fontStyle: 'italic'}}>
                                                    {moment(props.Fecha_hora).utc().format('DD/MM/YYYY HH:mm')}
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
                        {props.EnviadoDesdeMesa  && <div style={{textAlign: 'center'}}>
                            <FaUserEdit color='#D0D0D0' size={20}/><br />
                            <span style={{fontSize: '.7em', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center'}}>MESA DE CRÉDITO</span>
                        </div>}
                    </>
                },
            ]
        return colRet
    }, [])

    // Use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        if (state.Cargando && props.Item) {
            FnGet()
        }

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro, state.Cargando, props])

    return (
        <ModalWin open={props.mostrar} large center={true} >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    NOTAS <br />   
                    PROSPECTO :&nbsp;{props.ProspectoID}&nbsp;{props.nombreP}
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
                                        <button className="btn btn-outline-primary" type="button" onClick={() => FnGet()}><FiRefreshCcw /></button>
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
                                        {loading && <Spinner/>}
                                        {!loading && <div className='text-center m-2'>
                                            <button className="btn btn-primary" type="button" onClick={() => setState(s => ({...s, Mostrar: true}))}><FaCommentDots size={20} /> AGREGAR MENSAJE</button>
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
                        <button type="button" className="delete" onClick={() => fnCancelar() } />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        <div className="text-end">
                            <div className="row">
                                <div className="col-sm-12">
                                    <textarea  className="form-control" placeholder="Nota" onChange={e => FnNota(e.target.value)} />
                                    <br />
                                    <button onClick={() => {FNEnviarMensajes(props.ProspectoID, state.Nota)}}
                                        type="submit" className="ms-1 btn btn-success waves-effect waves-light">ENVIAR</button>
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