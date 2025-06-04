import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from '../CarteraGestores/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaCheckCircle, FaClock, FaBan, FaTimesCircle, FaComment } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'
import { FormateoDinero } from '../../../../../../global/variables'

import { FiltrarDatos } from '../../../../../../global/functions'
import { VerTicket } from './VerTicket'
import { SubirTicket } from './SubirTicket'
import { Confirmacion } from '../CarteraGestores/Confirmacion'
import { ConfirmacionSMS } from '../CarteraGestores/ConfirmacionSMS'
import { date } from 'yup'
import { toast } from 'react-toastify'



type CatalogosType = {
    oidc: IOidc,
    initialValues: { GestorID: number, DistribuidorID: number, DistribuidorDesc: string, FechaAsignacion: Date, DiasAtraso: number, TicketID: number },
    fnCancelar(): any,
    cbActualizar(item: any): any,
    DistribuidorID: number,
    DistribuidorDesc: string,
    GestorID: any

}

export const ListaTicket = (props: CatalogosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)
    // Loading
    const [loading, setLoading] = React.useState(false)

    const DatosDefecto = { TicketID: 0, FechaRegistro: new Date, Activo: true, DistribuidorID: 0, Monto: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        VerTicket: false,
        SubirTicket: false,
        GestorID: 0,
        TicketID: 0,
        Abono: 0,
        FechaRegistro: date,
        Activo: 0,
        Identificador: 0,
        UltRelacionImporte: '',
        Fecha: '',
        FechaCorte: '',
        Confirmacion: false,
        ConfirmacionSMS: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.getListaTicket(props.oidc, props.DistribuidorID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetRelaciones = (TicketID: number, FechaRegistro: Date, Activo: boolean, DistribuidorID: number, Monto: number, Filt: number) => {

        if (Filt === 1) {
            setState({ ...state, SubirTicket: true, Identificador: 1 })
        }

        Funciones.RelacionDistribuidor(props.oidc, props.DistribuidorID)
            .then((respuesta: any) => {
                respuesta.map((valor: any) => {
                    setState(s => ({ ...s, UltRelacionImporte: valor.UltRelacionImporte, Fecha: valor.Fecha, FechaCorte: valor.FechaCorte }))

                    if (Filt === 2) {

                        setState(s => ({ ...s, SubirTicket: true, Identificador: 2, }))

                        setState(s => ({
                            ...s, SubirTicket: true, Identificador: 2,
                            Form: {
                                ...state.Form,
                                Datos: {
                                    TicketID: TicketID,
                                    FechaRegistro: FechaRegistro,
                                    Activo: Activo,
                                    DistribuidorID: DistribuidorID,
                                    Monto: Monto
                                },
                            }

                        }))

                    }
                });
            })
            .catch(() => {
                setState(s => ({ ...s, UltRelacionImporte: '' }))
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'TicketID',
                    width: '10%',
                    selector: 'TicketID',
                    sortable: true,
                },

                {
                    name: 'FechaRegistro',
                    selector: 'FechaRegistro',
                    width: '20%',
                    sortable: true,
                },

                // {
                //     name: 'Subir Ticket',
                //     width: '18%',
                //     sortable: false,
                //     center: true,
                //     cell: (props) => props.SucursalID === -2 ? <br /> :
                //         props.Activo > 0 ? <>
                //             <button data-tip data-for={`btnSD_$`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className={props.Autorizado ? 'btn btn-success' : 'btn btn-primary'} type={"button"} onClick={() => {

                //                 FNGetRelaciones(props.TicketID, props.FechaRegistro, props.Activo, props.DistribuidorID, props.Monto, 2)
                //                 // setState(s => ({
                //                 //     ...s, SubirTicket: true, Identificador: 2,
                //                 //     Form: {
                //                 //         ...state.Form,
                //                 //         Datos: {
                //                 //             TicketID: props.TicketID,
                //                 //             FechaRegistro: props.FechaRegistro,
                //                 //             Activo: props.Activo,
                //                 //             DistribuidorID: props.DistribuidorID,
                //                 //             Monto: props.Monto
                //                 //         },
                //                 //     }

                //                 // }))
                //             }}>
                //                 {'REMPLAZAR'}
                //             </button>
                //             {/* <ReactTooltip id={`btnSD_${props.DistribuidorID}`} type="info" effect="solid">
                //                 SUBIR TICKET {props.DistribuidorDesc}
                //             </ReactTooltip> */}

                //         </> : <div style={{ width: '100%', textAlign: 'center' }}>
                //         </div>,
                // },

                {
                    name: 'Ver Ticket',
                    width: '20%',
                    sortable: false,
                    center: true,
                    cell: (props) => props.SucursalID === -2 ? <br /> :
                        props.TicketID > 0 ? <><button style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-secondary" type={"button"} onClick={() => {

                            setState(s => ({
                                ...s, VerTicket: true,
                                Form: {
                                    ...state.Form,
                                    Datos: {
                                        TicketID: props.TicketID,
                                        FechaRegistro: props.FechaRegistro,
                                        Activo: props.Activo,
                                        DistribuidorID: props.DistribuidorID,
                                        Monto: props.Monto
                                    },
                                }

                            }))

                        }}>
                            VER
                        </button>
                        </> : <div style={{ width: '100%', textAlign: 'center' }}>
                        </div>,
                },

                {
                    name: 'Abono',
                    selector: 'Monto',
                    width: '20%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.Monto)}</span>
                    //cell: (props) => <span>{props.Monto}</span>
                },

                {
                    name: 'Activo',
                    selector: 'Activo',
                    width: '10%',
                    sortable: true,
                    center: true,
                    //cell: (props) => //<span>{props.Activo ? <FaCheckCircle color="green" size={20} title="Activo" /> : <FaClock color="gray" size={20} title="Inactivo" />}</span>
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {props.Activo == 1 && <FaCheckCircle color='green' size={20} />}
                            {props.Activo == 0 && <FaTimesCircle color='red' size={20} />}
                            {props.Activo == null && <FaClock color='gray' size={20} />}
                        </div>
                },


                {
                    name: 'Cancelar',
                    sortable: false,
                    center: true,
                    width: '10%',
                    cell: (props) =>
                        props.Activo > 0 ? <>

                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                setState(s => ({
                                    ...s, Confirmacion: true,
                                    Form: {
                                        ...state.Form,
                                        Datos: {
                                            TicketID: props.TicketID,
                                            FechaRegistro: props.FechaRegistro,
                                            Activo: props.Activo,
                                            DistribuidorID: props.DistribuidorID,
                                            Monto: props.Monto
                                        },
                                    }
                                }))
                            }
                            } >
                                <FaBan color="red" size={20} />
                            </button>

                            {/* <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <button className="asstext" type={"button"} onClick={() => { FNCancelarTicket(props.TicketID) }}><FaBan color="red" size={20} /></button>
                            </div> */}
                        </> : <div style={{ width: '100%', textAlign: 'center' }}></div>
                },

                {
                    name: 'SMS',
                    sortable: false,
                    center: true,
                    width: '10%',
                    cell: (props) =>
                        props.Activo > 0 ? <>
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                setState(s => ({
                                    ...s, ConfirmacionSMS: true, TicketID: props.TicketID, Abono: props.Monto,
                                    Form: {
                                        ...state.Form,
                                        Datos: {
                                            TicketID: props.TicketID,
                                            FechaRegistro: props.FechaRegistro,
                                            Activo: props.Activo,
                                            DistribuidorID: props.DistribuidorID,
                                            Monto: props.Monto
                                        },
                                    }
                                }))


                                // FNSMS(props.DistribuidorID, props.TicketID, props.Monto)


                            }
                            } >
                                <FaComment size={20} />
                            </button>

                            {/* <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <button className="asstext" type={"button"} onClick={() => { FNCancelarTicket(props.TicketID) }}><FaBan color="red" size={20} /></button>
                            </div> */}
                        </> : <div style={{ width: '100%', textAlign: 'center' }}></div>
                },


            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        //FNGetRelaciones()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { TicketID: 0, FechaRegistro: new Date, Activo: false, DistribuidorID: 0, Monto: 0 } }, SubirTicket: false })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TicketID === item.TicketID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { TicketID: 0, FechaRegistro: new Date, Activo: false, DistribuidorID: 0, Monto: 0 } }, SubirTicket: false, Confirmacion: false })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false }, VerTicket: false, SubirTicket: false, Confirmacion: false, ConfirmacionSMS: false })



    return (
        <div className="row">
            <div className="col-12">
                <Card Title="ABONOS">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() =>
                                                                FNGetRelaciones(0, new Date, false, 0, 0, 1)
                                                                // setState({ ...state, SubirTicket: true, Identificador: 1 })
                                                            }
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                                <br />
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        // keyField={"Activo"}
                                        // defaultSortField={"Activo"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.VerTicket} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>SOCIA: {props.DistribuidorID} {props.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.VerTicket && <VerTicket
                                                oidc={props.oidc}
                                                initialValues={props.initialValues}
                                                TicketID={state.Form.Datos.TicketID}
                                                // DistribuidorID = {props.DistribuidorID}
                                                // DistribuidorDesc = {props.DistribuidorDesc}
                                                // cbActualizar={cbActualizar}
                                                //cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.SubirTicket} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>SOCIA: {props.DistribuidorID} {props.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.SubirTicket && <SubirTicket
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                GestorID={props.GestorID}
                                                DistribuidorID={props.DistribuidorID}
                                                Identificador={state.Identificador}
                                                cbActualizar={props.cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                FNGetLocal={FNGetLocal}
                                                UltRelacionImporte={state.UltRelacionImporte}
                                                Fecha={state.Fecha}
                                                FechaCorte={state.FechaCorte}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>


                                    {state.Confirmacion && <Confirmacion
                                        oidc={props.oidc}
                                        cbActualizar={cbActualizar}
                                        fnCancelar={fnCancelar}
                                        Confirmacion={state.Confirmacion}
                                        initialValues={state.Form.Datos}
                                        DistribuidorDesc={props.initialValues.DistribuidorDesc}
                                        FNGetLocal={FNGetLocal}
                                    />}

                                    {state.ConfirmacionSMS && <ConfirmacionSMS
                                        oidc={props.oidc}
                                        cbActualizar={cbActualizar}
                                        fnCancelar={fnCancelar}
                                        Confirmacion={state.ConfirmacionSMS}
                                        initialValues={state.Form.Datos}
                                        DistribuidorDesc={props.initialValues.DistribuidorDesc}
                                        FNGetLocal={FNGetLocal}
                                        DistribuidorID={props.DistribuidorID}
                                        TicketID={state.TicketID}
                                        Abono={state.Abono}
                                    />}


                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}
