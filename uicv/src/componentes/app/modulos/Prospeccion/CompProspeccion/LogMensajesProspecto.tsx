import React from 'react'

import { FaCheckCircle, FaCheckDouble, FaEnvelopeOpen, FaUser } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { Card, ModalWin, Spinner } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

import { DBConfia_Prospeccion } from '../../../../../interfaces_db/DBConfia/Prospeccion'
import moment from 'moment'
import { toast } from 'react-toastify'
import * as Funciones from './Prospectos/Funciones'
import ReactTooltip from 'react-tooltip'
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { LogMensajes } from './LogMensajes'
// Datos necesarios para el perfil
type PerfilProspectoTipo = {
    oidc: IOidc,
    Notificaciones: DBConfia_Prospeccion.ILogMensajes_VW[]
    Prospectos: DBConfia_Prospeccion.ILogMensajesNoLeidosProspecto_VW[]
    FNNotificaciones(): any
}

export const LogMensajesProspecto = (props: PerfilProspectoTipo) => {

    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const ProcPendietes: any[] = []
    const MensajesProspecto: DBConfia_Prospeccion.ILogMensajes_VW[] = []
    const [state, setState] = React.useState({
        Datos,
        ProcPendietes,
        Cargando: true,
        Error: false,
        confirm: false,
        VerNotificaciones: false,
        MensajesProspecto,
        ProspectoID: 0,
        NombreProspecto: ''
    })


    React.useEffect(() => {
        setState(s => ({ ...s, Cargando: false, Datos: props.Prospectos }))
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    const FNMostrarMensajes = (prospectoID: number) => {
        let prospectosRestantes = state.Datos.filter((x: any) => x.ProspectoID !== prospectoID)
        let nombreProspecto = props.Prospectos.find((x: any) => x.ProspectoID === prospectoID)?.NombreProspecto
        let mensajes = props.Notificaciones.filter((x: any) => x.ProspectoID === prospectoID)
        setState(s => ({ ...s, VerNotificaciones: true, MensajesProspecto: mensajes, NombreProspecto: nombreProspecto ?? '', ProspectoID: prospectoID, Datos: prospectosRestantes }))
        mensajesLeído(prospectoID)
    }

    const mensajesLeído = (prospectoID: number) => {
        console.log(prospectoID)
        Funciones.FNGetNotificacionLeida(props.oidc, prospectoID)
            .then((item: any) => {
                props.FNNotificaciones()
                toast.info("Notficación Atendida")
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

    const fnCancelNotif = () => setState({ ...state, VerNotificaciones: false })

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'ProspectoID',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <>
                            {props.ProspectoID}
                        </>
                },
                {
                    name: 'Nombre Prospecto',
                    selector: 'NombreProspecto',
                    sortable: true,
                    width: '55%',
                    cell: (props) =>
                        <>
                            <div data-tip data-for={`np_${props.ProspectoID}`} style={{ width: '100%', display: 'flex', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 'bold', fontStyle: 'italic' }}>
                                <FaUser color='#D0D0D0' size={20} /> {props.NombreProspecto}
                            </div>
                            <ReactTooltip id={`np_${props.ProspectoID}`} type="info" effect="solid">
                                {props.NombreProspecto}
                            </ReactTooltip>
                        </>
                },
                {
                    name: '',
                    selector: 'ProspectoID',
                    sortable: true,
                    width: '33%',
                    right: true,
                    cell: (props) =>
                        <>
                            <div data-tip data-for={`l_${props.ProspectoID}`} className='notificacion' style={{ textAlign: 'left', paddingTop: '2px', paddingBottom: '2px' }}>
                                {<span className="badge">{props.NoLeidos}</span>}
                                <button className="btn btn-primary" type="button"
                                    onClick={() => FNMostrarMensajes(props.ProspectoID)}
                                ><FaEnvelopeOpen color='#D0D0D0' size={15} /> VER MENSAJES</button>
                            </div>
                            <ReactTooltip id={`l_${props.ProspectoID}`} type="info" effect="solid">
                                {'VER MENSAJES SOBRE EL PROSPECTO ' + props.NombreProspecto}
                            </ReactTooltip>
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
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
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
                                        <br />
                                    </div>}

                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div >
            {state.VerNotificaciones && <ModalWin open={state.VerNotificaciones} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>MENSAJES PROSPECTO <br /> {state.ProspectoID} {state.NombreProspecto}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelNotif()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <LogMensajes oidc={props.oidc} Notificaciones={state.MensajesProspecto} FNNotificaciones={props.FNNotificaciones} ProspectoID={state.ProspectoID} />
                </ModalWin.Body>
            </ModalWin>}
        </>
    )
}
