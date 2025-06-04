import React from 'react'

import { FaCheckCircle, FaCheckDouble, FaCommentDots, FaLink, FaPaperPlane, FaUser, FaUserEdit, FaUserTie } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { Card, ModalWin, Spinner } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

import { DBConfia_Prospeccion } from '../../../../../interfaces_db/DBConfia/Prospeccion'
import moment from 'moment'
import { toast } from 'react-toastify'
import * as Funciones from './Prospectos/Funciones'
import ReactTooltip from 'react-tooltip'
import { Link, useParams } from 'react-router-dom'
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { FiRefreshCcw } from 'react-icons/fi'
// Datos necesarios para el perfil
type PerfilProspectoTipo = {
    oidc: IOidc,
    Notificaciones: DBConfia_Prospeccion.ILogMensajes_VW[]
    FNNotificaciones(): any
    ProspectoID: number
}

export const LogMensajes = (props: PerfilProspectoTipo) => {

    // Ontenemos el ID del producto
    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)

    const [loading, setLoading] = React.useState(false)
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const ProcPendietes: any[] = []
    const [state, setState] = React.useState({
        Datos,
        ProcPendietes,
        Cargando: true,
        Error: false,
        confirm: false,
        Mostrar: false,
        Nota: '',
    })


    React.useEffect(() => {
        FnGet()
        setState(s => ({ ...s, Cargando: false, Datos: props.Notificaciones }))
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    const fnCancelar = () => setState(s => ({ ...s, Mostrar: false }))

    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const FnGet = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetNotificaciones(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Datos: respuesta.data, Cargando: false }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                setState(s => ({ ...s, Cargando: false }))
            })
    }

    const FNEnviarMensajes = (ProspectoID: number, Nota: string) => {
        setLoading(true)
        Funciones.FNEviarMsjPromotorSucursal(props.oidc, { ProspectoID, Nota, TipoMesa: 4 })
            .then((respuesta: any) => {
                setLoading(false)
                toast.success('MENSAJE ENVIADO', respuesta)
                setState({ ...state, Datos: [...state.Datos, respuesta] })
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
                            {props.EnviadoDesdeMesa && <div style={{ textAlign: 'center' }}>
                                <FaUserEdit color='#D0D0D0' size={20} /><br />
                                <span style={{ fontSize: '.7em', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>MESA DE CRÉDITO</span>
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
                            <div style={{ width: '100%' }} className={`${props.EnviadoDesdeMesa ? 'chatLeft' : 'chatRight'}`}>
                                <div className={`${props.EnviadoDesdeMesa ? 'boxChat sb2' : 'boxChat sb1'}`} style={{ width: '60%' }}>
                                    <table style={{ width: '-webkit-fill-available' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ fontWeight: 'bold', textAlign: 'start' }}>
                                                    {props.Mensaje}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic' }}>
                                                    {props.StatusProcesoID > 0 && `PROCESO: ${props.Proceso}`}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: '.8em', textAlign: 'end', fontWeight: 'bold', fontStyle: 'italic' }}>
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
                            {!props.EnviadoDesdeMesa && <div style={{ textAlign: 'center' }}>
                                <FaUserTie color='#D0D0D0' size={20} /><br />
                                <span style={{ fontSize: '.7em', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' }}>PROMOTOR / SUCURSAL</span>
                            </div>}
                        </>
                },
            ]
        return colRet
    }, [state.Datos])

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <Card>
                        <Card.Body>
                            <Card.Body.Content>
                                <div style={{ textAlign: 'end', marginBottom: '1em' }}>{/* 
                                    <Link style={{ color: '#0000EE' }} to={`/app/${id_int}/prospeccion/Prospecto/${props.ProspectoID}`}><FaLink /> IR AL PERFIL DEL PROSPECTO </Link> */}
                                    <button className="btn btn-outline-primary" type="button" onClick={() => FnGet()}><FiRefreshCcw /></button>
                                </div>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
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
                                    </div>}
                                {loading && <Spinner />}
                                {!loading && <div className='text-center m-2'>
                                    <button className="btn btn-primary" type="button" onClick={() => setState(s => ({ ...s, Mostrar: true }))}><FaCommentDots size={20} /> AGREGAR MENSAJE</button>
                                </div>}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div >
            {state.Mostrar && <ModalWin open={state.Mostrar} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}> MENSAJE </h5>
                    <button type="button" className="delete" onClick={() => fnCancelar()} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div className="text-end">
                        <div className="row">
                            <div className="col-sm-12">
                                <textarea className="form-control" placeholder="Nota" onChange={e => FnNota(e.target.value)} />
                                <br />
                                <button onClick={() => { FNEnviarMensajes(props.ProspectoID, state.Nota) }}
                                    type="submit" className="ms-1 btn btn-success waves-effect waves-light">ENVIAR</button>
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>}
        </>
    )
}
