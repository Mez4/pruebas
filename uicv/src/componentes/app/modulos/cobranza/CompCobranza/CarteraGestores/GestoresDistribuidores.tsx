// import React from 'react'
import React, { useState, useRef, useEffect } from 'react'
import moment, { now } from 'moment'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from '../../../cobranza/CompCobranza/CarteraGestores/Funciones'
import * as FuncionesDirecciones from '../../../cobranza/CompCobranza/RelacionMesaCreditoProducto/Funciones'
import * as FuncionesSucursales from '../RelacionMesaCreditoProducto/Funciones'
import * as FuncionesGrupos from '../RelacionMesaCreditoProducto/Funciones'
import * as FuncionesGestoresCobranza from '../../../cobranza/CompCobranza/CatalogoGestoresCobranza/Funciones'
import * as FuncionesDistribuidor from '../RelacionMesaCreditoProducto/Funciones'
import { getConvenio } from '../Convenios/Funciones'

import { useParams, Link } from 'react-router-dom'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaFile, FaWindowClose, FaEye, FaHouseDamage, FaFileInvoiceDollar, FaFileInvoice, FaPhoneAlt, FaHandshake } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect, DatePickeStart, DatePickeEnd } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FormateoDinero } from '../../../../../../global/variables'
import ReactTooltip from 'react-tooltip'

import { FiltrarDatos } from '../../../../../../global/functions'

import { SubirTicket } from './SubirTicket'
import { VerTicket } from './VerTicket'
import { DistribuidoresClientes } from './DistribuidoresClientes'
import { CFormDireccion } from '../RelacionMesaCreditoProducto/CFormDireccion'
import { ListaTicket } from '../CarteraGestores/ListaTicket'
import { CFormReferencias } from '../RelacionMesaCreditoProducto/CFormReferencias'
import { CFormReferenciasAvales } from '../RelacionMesaCreditoProducto/CFormReferenciasAvales'

import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { colors } from 'react-select/src/theme'
import { date } from 'yup/lib/locale'
import { toast } from 'react-toastify'
import { Convenios } from '../Convenios/Convenios'




type CatalogosType = {
    oidc: IOidc
}

const GestoresDistribuidores = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)
    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    const DatosDefecto = { GestorID: 0, DistribuidorID: 0, DistribuidorDesc: '', SucursaDesc: '', Grupo: '', FechaAsignacion: new Date, DiasAtrasoAsignado: 0, DiasAtraso: 0, TelefonoMovil: '', TicketID: 0, Ruta: '', SaldoAtrasado: 0, Sucursal: '', Ticket: 0 }
    const respuesta: any[] = []
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const DatosConvenio: any[] = []
    const DatosConvenioDefecto = {
        ConvenioID: 0,
        Editar: false,
        DistribuidorID: 0,
        SucursalID: 0,
        PorcPagInt: 0,
        PorcBon: 0,
        Plazos: 0,
        SaldoActual: 0,
        saldoAtrasado: 0,
        DiasAtraso: 0,
        isPagoIntencion: false,
        EstatusId: 0,
        doc: '',
        file: null
    }
    const optDistribuidor: any[] = []
    const optSucursal: any[] = []
    const optGrupo: any[] = []
    const optinformacion: any[] = []
    const FiltroDistribuidor: number = 0
    const FiltroSucursal: number = 0
    const FiltroGrupo: number = 0
    const FiltroMotivo: number = 0
    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optDistribuidor,
        optSucursal,
        optGrupo,
        FiltroDistribuidor,
        FiltroSucursal,
        FiltroGrupo,
        FiltroMotivo,
        Filtro: '',
        Cargando: true,
        Error: false,
        MesaCobranzaID: 0,
        MesaCobranzaDesc: '',
        NombreDirector: '',
        limInferiorDias: 0,
        limSuperiorDias: 0,
        optinformacion,
        GestorID: 0,
        PersonasID: 0,
        GestorDesc: '',
        respuesta,
        CFormDireccion: false,
        ListaTicket: false,
        CFormReferencias: false,
        CFormReferenciasAvales: false,
        ColorTicket: '',
        DistribuidorID: 0,
        DistribuidorDesc: '',
        MostrarConvenio: false,
        DatosConvenio,
        DatosConvenioDefecto,
        Form:
        {
            Clientes: false,
            VerTicket: false,
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    type paramType = { id: string, productoId: string }
    let { id } = useParams<paramType>()
    let { productoId } = useParams<paramType>()
    //let idRelMesaCredProd: number = parseInt(id as string)
    let GestorID: number = parseInt(id as string)
    let PersonaID: number = parseInt(id as string)
    let id_int: number = parseInt(productoId as string)
    let ProductoID: number = parseInt(productoId as string)



    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.getGestoresDist(props.oidc, { GestorID, ProductoID })
            .then((respuesta: any) => {
                // console.log('getGestoresDist: ', respuesta)
                if (isMounted.current === true) {
                    // setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                    setState(s => ({ ...s, Cargando: false, Error: false, respuesta: respuesta }))
                    FnFiltrando(respuesta)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FnGetDistribuidor = () => {
        setState(s => ({ ...s }))
        Funciones.getGestoresDist(props.oidc, { GestorID, ProductoID })
            .then((respuesta: any) => {
                var Distribuidor = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorID, label: valor.DistribuidorID + ' - ' + valor.DistribuidorDesc };
                    return obj

                });

                setState(s => ({ ...s, optDistribuidor: Distribuidor }))
            })
            .catch(() => {
                setState(s => ({ ...s, optDistribuidor: [] }))
            })
    }

    const FnGetSucursales = () => {
        setState(s => ({ ...s }))
        FuncionesSucursales.getSucursales(props.oidc)
            .then((respuesta: any) => {
                var Sucursal = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    //console.log(obj, 'ABC')
                    return obj

                });

                setState(s => ({ ...s, optSucursal: Sucursal }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursal: [] }))
            })
    }

    const FnGetGrupos = () => {
        setState(s => ({ ...s }))
        FuncionesGrupos.FNGetGrupo(props.oidc)
            .then((respuesta: any) => {
                var Grupo = respuesta.map((valor: any) => {
                    var obj = { value: valor.ClasificadorGrupoID, label: valor.Descripcion };
                    return obj

                });

                setState(s => ({ ...s, optGrupo: Grupo }))
            })
            .catch(() => {
                setState(s => ({ ...s, optGrupo: [] }))
            })
    }

    const FNGetGestores = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetPersonas(props.oidc, { PersonaID })
            .then((respuesta: any) => {
                respuesta.map((valor: any) => {
                    setState(s => ({ ...s, GestorID: valor.PersonaID, GestorDesc: valor.NombreCompleto }))
                });
            })
            .catch(() => {
                setState(s => ({ ...s, GestorID: 0, GestorDesc: '' }))
            })
    }

    const FnDireccion = (GestorID: number, DistribuidorID: number, DistribuidorDesc: string, SucursaDesc: string, Grupo: string, FechaAsignacion: Date, DiasAtrasoAsignado: number, DiasAtraso: number, TelefonoMovil: string, TicketID: number, Ruta: string, Direccion: string, SaldoAtrasado: number) => {

        FuncionesDirecciones.ValidarBit(props.oidc, 0, GestorID, 2)
            .then(() => {

                setState(s => ({
                    ...s, CFormDireccion: true,
                    Form: {
                        ...state.Form,
                        Datos: {
                            GestorID, DistribuidorID, DistribuidorDesc, SucursaDesc, Grupo, FechaAsignacion, DiasAtrasoAsignado, DiasAtraso, TelefonoMovil, TicketID, Ruta, Direccion, SaldoAtrasado, Sucursal: '', Ticket: 0
                        },
                    }
                }))


            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })


    }

    const FnVerTicketMonitoreo = (GestorID: number, DistribuidorID: number, DistribuidorDesc: string, SucursaDesc: string, Grupo: string, FechaAsignacion: Date, DiasAtrasoAsignado: number, DiasAtraso: number, TelefonoMovil: string, TicketID: number, Ruta: string, Direccion: string, SaldoAtrasado: number) => {

        FuncionesDirecciones.ValidarBit(props.oidc, 0, GestorID, 1)
            .then(() => {

                setState(s => ({
                    ...s, ListaTicket: true, DistribuidorID: DistribuidorID, DistribuidorDesc: DistribuidorDesc,
                    Form: {
                        ...state.Form, Mostrar: false, VerTicket: false,
                        Datos: {
                            GestorID, DistribuidorID, DistribuidorDesc, SucursaDesc, Grupo, FechaAsignacion, DiasAtrasoAsignado, DiasAtraso, TelefonoMovil, TicketID, Ruta, Direccion, SaldoAtrasado, Sucursal: '', Ticket: 0
                        },
                    }
                }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const FnVerClientesMonitoreo = (GestorID: number, DistribuidorID: number, DistribuidorDesc: string, SucursaDesc: string, Grupo: string, FechaAsignacion: Date, DiasAtrasoAsignado: number, DiasAtraso: number, TelefonoMovil: string, TicketID: number, Ruta: string, Direccion: string, SaldoAtrasado: number) => {

        FuncionesDirecciones.ValidarBit(props.oidc, 0, GestorID, 1)
            .then(() => {

                setState(s => ({
                    ...s,
                    Form: {
                        ...state.Form, Clientes: true,
                        Datos: {
                            GestorID, DistribuidorID, DistribuidorDesc, SucursaDesc, Grupo, FechaAsignacion, DiasAtrasoAsignado, DiasAtraso, TelefonoMovil, TicketID, Ruta, Direccion, SaldoAtrasado, Sucursal: '', Ticket: 0
                        },
                    }
                }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })


    }

    const FnReferenciaMonitoreo = (GestorID: number, DistribuidorID: number, DistribuidorDesc: string, SucursaDesc: string, Grupo: string, FechaAsignacion: Date, DiasAtrasoAsignado: number, DiasAtraso: number, TelefonoMovil: string, TicketID: number, Ruta: string, SaldoAtrasado: number, Sucursal: string, Ticket: number) => {

        FuncionesDistribuidor.ValidarBit(props.oidc, 0, GestorID, 1)
            .then(() => {

                setState(s => ({
                    ...s, CFormReferencias: true,
                    Form: {
                        ...state.Form, Mostrar: false,
                        Datos: { GestorID, DistribuidorID, DistribuidorDesc, SucursaDesc, Grupo, FechaAsignacion: new Date, DiasAtrasoAsignado, DiasAtraso, TelefonoMovil, TicketID, Ruta, SaldoAtrasado, Sucursal, Ticket },
                    }
                }))

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const FnReferenciaAvalesMonitoreo = (GestorID: number, DistribuidorID: number, DistribuidorDesc: string, SucursaDesc: string, Grupo: string, FechaAsignacion: Date, DiasAtrasoAsignado: number, DiasAtraso: number, TelefonoMovil: string, TicketID: number, Ruta: string, SaldoAtrasado: number, Sucursal: string, Ticket: number) => {

        FuncionesDistribuidor.ValidarBit(props.oidc, 0, GestorID, 1)
            .then(() => {

                setState(s => ({
                    ...s, CFormReferenciasAvales: true,
                    Form: {
                        ...state.Form, Mostrar: false,
                        Datos: { GestorID, DistribuidorID, DistribuidorDesc, SucursaDesc, Grupo, FechaAsignacion: new Date, DiasAtrasoAsignado, DiasAtraso, TelefonoMovil, TicketID, Ruta, SaldoAtrasado, Sucursal, Ticket },
                    }
                }))

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const FnMuestraConvenio = (ConvenioID: number, DistribuidorID: number, SucursalID: number, DistribuidorDesc: string) => {

        getConvenio(props.oidc, DistribuidorID, 0)
            .then((respuesta: any) => {

                setState(s => ({
                    ...s,
                    MostrarConvenio: true,
                    DistribuidorID: DistribuidorID,
                    DistribuidorDesc: DistribuidorDesc,
                    DatosConvenio: respuesta.data,
                    DatosConvenioDefecto: {
                        ConvenioID: 0,
                        Editar: false,
                        DistribuidorID,
                        SucursalID,
                        PorcPagInt: 0,
                        PorcBon: 0,
                        Plazos: 0,
                        SaldoActual: 0,
                        saldoAtrasado: 0,
                        DiasAtraso: 0,
                        isPagoIntencion: false,
                        EstatusId: 0,
                        doc: '',
                        file: null
                    }
                }))

            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setLoading(false)
            })

    }

    const Columns: IDataTableColumn[] =
        [

            {
                name: 'Sucursal',
                selector: 'SucursaDesc',
                sortable: false,
                width: '9%',
                // center: true,
                cell: (props) => <span className="LabelInDTable"><strong>{props.SucursaDesc}</strong></span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],

            },

            {
                name: '',
                selector: 'Sucursal',
                sortable: true,
                // center: true,
                width: '7%',
                cell: (props) =>
                    <div style={{ width: '100%', textAlign: 'left' }} className='LabelInDTable'>
                        <label style={{ fontSize: '.75em' }}>
                            {props.Sucursal}
                        </label>
                    </div>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],

            },

            {
                name: 'Grupo',
                selector: 'Grupo',
                sortable: false,
                width: '8%',
                // center: true,
                cell: (props) =>
                    <>
                        <label data-tip data-for={`A_${props.Grupo}`} className="LabelInDTable" >
                            {props.Grupo}
                        </label>
                        <ReactTooltip id={`A_${props.Grupo}`} type="info" effect="solid">
                            {props.Grupo}
                        </ReactTooltip>

                    </>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'SociaId',
                selector: 'DistribuidorID',
                sortable: false,
                width: '5%',
                // center: true,
                cell: (props) => <span className="LabelInDTable">{props.DistribuidorID}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Socia',
                selector: 'DistribuidorDesc',
                sortable: false,
                width: '8%',
                //center: true,
                cell: (props) =>
                    <>
                        <label data-tip data-for={`A_${props.DistribuidorDesc}`} className="LabelInDTable" >
                            {props.DistribuidorDesc}
                        </label>
                        <ReactTooltip id={`A_${props.DistribuidorDesc}`} type="info" effect="solid">
                            {props.DistribuidorDesc}
                        </ReactTooltip>

                    </>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'


                        },

                    },
                ],
            },

            {
                name: 'TelMovil',
                selector: 'TelefonoMovil',
                sortable: false,
                width: '8%',
                //center: true,
                cell: (props) => <span className="LabelInDTable">{props.TelefonoMovil}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Direccion',
                selector: 'Direccion',
                sortable: true,
                width: '6%',
                center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`RT_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnDireccion(props.GestorID, props.DistribuidorID, props.DistribuidorDesc, props.SucursaDesc, props.Grupo, props.FechaAsignacion, props.DiasAtrasoAsignado, props.DiasAtraso, props.TelefonoMovil, props.TicketID, props.Ruta, props.Direccion, props.SaldoAtrasado)

                                // setState(s => ({
                                //     ...s, CFormDireccion: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursalDesc: props.SucursalDesc, DiasAtraso: props.DiasAtraso, GestorId: props.GestorId, GestorDesc: props.GestorDesc, ColorAsignaGestor: props.ColorAsignaGestor, ColorReferencias: props.ColorReferencias, Grupo: props.Grupo, ClasificadorGrupoID: props.ClasificadorGrupoID, ColorReferenciasAvales: props.ColorReferenciasAvales, ProductoID: props.ProductoID, idRelMesaCredProd },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                {/* <FaHouseDamage color={props.ColorReferencias} /> */}
                                <FaHouseDamage color='GREEN' size={20} />
                            </button>
                        </div>

                        <ReactTooltip id={`RT_${props.DistribuidorID}`} type="info" effect="solid">
                            Direccion de Socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'FHAsign.',
                selector: 'FechaAsignacion',
                sortable: false,
                // center: true,
                width: '7%',
                cell: (props) => <span className="LabelInDTable">{props.FechaAsignacion}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'DiasAtrAs.',
                selector: 'DiasAtrasoAsignado',
                sortable: false,
                center: true,
                width: '5%',
                cell: (props) => <span className="LabelInDTable">{props.DiasAtrasoAsignado}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],

            },

            {
                name: 'DiasAtr',
                selector: 'DiasAtraso',
                sortable: false,
                center: true,
                width: '6%',
                cell: (props) => <span className="LabelInDTable">{props.DiasAtraso}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'SaldoAtr',
                selector: 'SaldoAtrasado',
                sortable: false,
                //center: true,
                width: '6%',
                cell: (props) => props.SucursalID === -2 ? <br /> : <span className="LabelInDTable">{FormateoDinero.format(props.SaldoAtrasado)}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Abonos',
                selector: '',
                sortable: true,
                width: '5%',
                center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`PA_${props.DistribuidorID}`} className="LabelInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnVerTicketMonitoreo(props.GestorID, props.DistribuidorID, props.DistribuidorDesc, props.SucursaDesc, props.Grupo, props.FechaAsignacion, props.DiasAtrasoAsignado, props.DiasAtraso, props.TelefonoMovil, props.TicketID, props.Ruta, props.Direccion, props.SaldoAtrasado)


                                // setState(s => ({
                                //     ...s,
                                //     Form: {
                                //         ...state.Form, Mostrar: false, VerTicket: true,
                                //         Datos: {
                                //             GestorID: props.GestorID,
                                //             DistribuidorID: props.DistribuidorID,
                                //             DistribuidorDesc: props.DistribuidorDesc,
                                //             SucursaDesc: props.SucursaDesc,
                                //             Grupo: props.Grupo,
                                //             FechaAsignacion: props.FechaAsignacion,
                                //             DiasAtrasoAsignado: props.DiasAtrasoAsignado,
                                //             DiasAtraso: props.DiasAtraso,
                                //             TelefonoMovil: props.TelefonoMovil,
                                //             TicketID: props.TicketID,
                                //             Ruta: props.Ruta,
                                //             Direccion: props.Direccion,
                                //             SaldoAtrasado: props.SaldoAtrasado
                                //         },
                                //     }
                                // }))
                            }
                            } >

                                < FaFileInvoice color={props.ColorTicket} size={20} />
                            </button>

                        </div>

                        <ReactTooltip id={`PA_${props.DistribuidorID}`} type="info" effect="solid">
                            Ticket de Socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Ref.',
                selector: '',
                sortable: true,
                width: '5%',
                center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`RR_${props.DistribuidorID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {


                                FnReferenciaMonitoreo(props.GestorID, props.DistribuidorID, props.DistribuidorDesc, props.SucursaDesc, props.Grupo, props.FechaAsignacion, props.DiasAtrasoAsignado, props.DiasAtraso, props.TelefonoMovil, props.TicketID, props.Ruta, props.SaldoAtrasado, props.Sucursal, props.Ticket)

                                // setState(s => ({
                                //     ...s, CFormReferencias: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { GestorID: props.GestorID, DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursaDesc: props.SucursaDesc, Grupo: props.Grupo, FechaAsignacion: new Date, DiasAtrasoAsignado: props.DiasAtrasoAsignado, DiasAtraso: props.DiasAtraso, TelefonoMovil: props.TelefonoMovil, TicketID: props.TicketID, Ruta: props.Ruta, SaldoAtrasado: props.SaldoAtrasado, Sucursal: props.Sucursal, Ticket: props.Ticket },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                <FaPhoneAlt color={props.ColorReferencias} size={17} />
                            </button>
                        </div>
                        <ReactTooltip id={`RR_${props.DistribuidorID}`} type="info" effect="solid">
                            Referencia de Socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Avales',
                selector: '',
                sortable: true,
                width: '5%',
                center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`AV_${props.DistribuidorID}`} className="LabelInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {

                                FnReferenciaAvalesMonitoreo(props.GestorID, props.DistribuidorID, props.DistribuidorDesc, props.SucursaDesc, props.Grupo, props.FechaAsignacion, props.DiasAtrasoAsignado, props.DiasAtraso, props.TelefonoMovil, props.TicketID, props.Ruta, props.SaldoAtrasado, props.Sucursal, props.Ticket)


                                // setState(s => ({
                                //     ...s, CFormReferenciasAvales: true,
                                //     Form: {
                                //         ...state.Form, Mostrar: false,
                                //         Datos: { GestorID: props.GestorID, DistribuidorID: props.DistribuidorID, DistribuidorDesc: props.DistribuidorDesc, SucursaDesc: props.SucursaDesc, Grupo: props.Grupo, FechaAsignacion: new Date, DiasAtrasoAsignado: props.DiasAtrasoAsignado, DiasAtraso: props.DiasAtraso, TelefonoMovil: props.TelefonoMovil, TicketID: props.TicketID, Ruta: props.Ruta, SaldoAtrasado: props.SaldoAtrasado, Sucursal: props.Sucursal, Ticket: props.Ticket },
                                //         Id: props.DistribuidorID,
                                //     }
                                // }))
                            }
                            } >
                                <FaPhoneAlt color={props.ColorReferenciasAvales} size={17} />
                            </button>
                        </div>

                        <ReactTooltip id={`AV_${props.DistribuidorID}`} type="info" effect="solid">
                            Referencia Aval de socia: {props.DistribuidorDesc}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [

                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },
                    },
                ],
            },

            {
                name: 'Clientes',
                sortable: false,
                center: true,
                width: '5%',
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <button className="asstext" type={"button"} onClick={() => {

                        FnVerClientesMonitoreo(props.GestorID, props.DistribuidorID, props.DistribuidorDesc, props.SucursaDesc, props.Grupo, props.FechaAsignacion, props.DiasAtrasoAsignado, props.DiasAtraso, props.TelefonoMovil, props.TicketID, props.Ruta, props.Direccion, props.SaldoAtrasado)

                        // setState(s => ({
                        //     ...s,
                        //     Form: {
                        //         ...state.Form, Clientes: true,
                        //         Datos: {
                        //             GestorID: props.GestorID,
                        //             DistribuidorID: props.DistribuidorID,
                        //             DistribuidorDesc: props.DistribuidorDesc,
                        //             SucursaDesc: props.SucursaDesc,
                        //             Grupo: props.Grupo,
                        //             FechaAsignacion: props.FechaAsignacion,
                        //             DiasAtrasoAsignado: props.DiasAtrasoAsignado,
                        //             DiasAtraso: props.DiasAtraso,
                        //             TelefonoMovil: props.TelefonoMovil,
                        //             TicketID: props.TicketID,
                        //             Ruta: props.Ruta,
                        //             Direccion: props.Direccion,
                        //             SaldoAtrasado: props.SaldoAtrasado
                        //         },
                        //     }
                        // }))
                    }}>
                        <FaEye size={16} />
                    </button>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

            {
                name: 'Convenios',
                selector: '',
                sortable: false,
                width: '5%',
                center: true,
                cell: (props) => props.SucursalID === -2 ? <br /> :
                    <>
                        <div data-tip data-for={`CV_${props.DistribuidorID}`} className="LabelInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
                                FnMuestraConvenio(0, props.DistribuidorID, props.SucursalID, props.DistribuidorDesc)
                            }
                            } >
                                < FaHandshake color={props.ColorEstConv} size={20} />
                            </button>

                        </div>

                        <ReactTooltip id={`CV_${props.DistribuidorID}`} type="info" effect="solid">
                            {props.SaldoActual > 0 ? `Convenio: ${props.ConvenioID}` : `Sin convenio`}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [
                    {
                        when: row => row.SucursalID == -2,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },

                    },
                ],
            },

        ]

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetDistribuidor()
        FnGetSucursales()
        FnGetGrupos()
        FNGetGestores()
        //FNDistribuidorNombre()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FnFiltrando(state.respuesta)
        // setState(s => ({ ...s, DatosMostrar: s.Datos }))
    }, [state.FiltroDistribuidor, state.FiltroSucursal, state.FiltroGrupo, startDate, endDate])


    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: s.Datos }))
        // console.log(state.Datos, 'cccccccccccccccccccc')
        // FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { GestorID: 0, DistribuidorID: 0, DistribuidorDesc: '', SucursaDesc: '', Grupo: '', FechaAsignacion: new Date, DiasAtrasoAsignado: 0, DiasAtraso: 0, TelefonoMovil: '', TicketID: 0, Ruta: '', SaldoAtrasado: 0, Sucursal: '', Ticket: 0 } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.DistribuidorID === item.DistribuidorID ? item : Dato), respuesta: state.respuesta.map(Dato => Dato.DistribuidorID === item.DistribuidorID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { GestorID: 0, DistribuidorID: 0, DistribuidorDesc: '', SucursaDesc: '', Grupo: '', FechaAsignacion: new Date, DiasAtrasoAsignado: 0, DiasAtraso: 0, TelefonoMovil: '', TicketID: 0, Ruta: '', SaldoAtrasado: 0, Sucursal: '', Ticket: 0 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerTicket: false, Clientes: false }, CFormDireccion: false, ListaTicket: false, CFormReferencias: false, CFormReferenciasAvales: false })

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    const fnGetFiltrosDistribuidor = (FiltroDistribuidor: number) => {
        setState(s => ({ ...s, FiltroDistribuidor: FiltroDistribuidor }))
    }

    const fnGetFiltrosSucursal = (SucursalID: number) => {
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }

    const fnGetFiltrosGrupo = (ClasificadorGrupoID: number) => {
        setState(s => ({ ...s, FiltroGrupo: ClasificadorGrupoID }))
    }

    const FnFiltrando = (respuesta: any) => {
        let numFiltro = (state.FiltroDistribuidor, state.FiltroSucursal)
        let datosFiltro = respuesta
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroDistribuidor > 0)
            datosFiltro = datosFiltro.filter(d => { return d.DistribuidorID === state.FiltroDistribuidor })

        if (state.FiltroSucursal > 0)
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

        if (state.FiltroGrupo > 0)
            datosFiltro = datosFiltro.filter(d => { return d.ClasificadorGrupoID === state.FiltroGrupo })

        // console.log(startDate, 'LLEGO')

        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)

            datosFiltro = datosFiltro.filter(d => { return d.FechaFiltro >= startDate.toISOString() && d.FechaFiltro <= endDate.toISOString() || d.FechaFiltro === null })
        }

        // setState(s => ({ ...s, DatosMostrar: datosFiltro }))

        if (datosFiltro.length > 0) {

            FNGetDistri(datosFiltro)
        }

        else {
            setState(s => ({ ...s, Datos: datosFiltro }))
        }
    }

    const FNGetDistri = (respuesta: any) => {

        let tabla: any[] = []
        let SucursalID = 0;

        respuesta.forEach((element: any) => {

            if (SucursalID === element.SucursalID) {

                let detalleSaldos: any = {
                    GestorID: element.GestorID,
                    DistribuidorID: element.DistribuidorID,
                    DistribuidorDesc: element.DistribuidorDesc,
                    SucursalID: element.SucursalID,
                    SucursaDesc: "",
                    Grupo: element.Grupo,
                    FechaAsignacion: element.FechaAsignacion,
                    DiasAtrasoAsignado: element.DiasAtrasoAsignado,
                    DiasAtraso: element.DiasAtraso,
                    TelefonoMovil: element.TelefonoMovil,
                    TicketID: element.TicketID,
                    SaldoAtrasado: element.SaldoAtrasado,
                    // Direccion: element.Direccion,
                    ClasificadorGrupoID: element.ClasificadorGrupoID,
                    FechaFiltro: element.FechaFiltro,
                    Sucursal: element.SucursaDesc,
                    ColorTicket: element.ColorTicket,
                    ColorReferencias: element.ColorReferencias,
                    ColorReferenciasAvales: element.ColorReferenciasAvales,
                    SaldoActual: element.SaldoActual,
                    ColorEstConv: element.ColorEstConv,
                    ConvenioID: element.ConvenioID,
                    EstatusId: element.EstatusId,
                    EstatusDesc: element.EstatusDesc,

                }
                tabla.push(detalleSaldos)
                SucursalID = element.SucursalID
            }

            else {

                let detalleTres: any = {
                    SucursaDesc: element.SucursaDesc,
                    SucursalID: -2,
                }
                tabla.push(detalleTres)

                let detalleSaldos: any = {
                    GestorID: element.GestorID,
                    DistribuidorID: element.DistribuidorID,
                    DistribuidorDesc: element.DistribuidorDesc,
                    SucursalID: element.SucursalID,
                    SucursaDesc: "",
                    Grupo: element.Grupo,
                    FechaAsignacion: element.FechaAsignacion,
                    DiasAtrasoAsignado: element.DiasAtrasoAsignado,
                    DiasAtraso: element.DiasAtraso,
                    TelefonoMovil: element.TelefonoMovil,
                    TicketID: element.TicketID,
                    SaldoAtrasado: element.SaldoAtrasado,
                    // Direccion: element.Direccion,
                    ClasificadorGrupoID: element.ClasificadorGrupoID,
                    FechaFiltro: element.FechaFiltro,
                    Sucursal: element.SucursaDesc,
                    ColorTicket: element.ColorTicket,
                    ColorReferencias: element.ColorReferencias,
                    ColorReferenciasAvales: element.ColorReferenciasAvales,
                    SaldoActual: element.SaldoActual,
                    ColorEstConv: element.ColorEstConv,
                }

                tabla.push(detalleSaldos)
                SucursalID = element.SucursalID
            }

        });

        setState(s => ({ ...s, Cargando: false, Error: false, Datos: tabla }))
        //FnFiltrando()
    }

    const cbActualizarDatosConvenio = (Datos: any, item: any) => {
        // console.log('item: ', item)
        setState(s => ({
            ...s,
            DatosConvenio: Datos,
            Datos: state.Datos.map(Dato => Dato.DistribuidorID === item.DistribuidorID ? {
                ...Dato,
                SaldoActual: item.SaldoActual,
                ColorEstConv: item.Color,
                ConvenioID: item.ConvenioID,
                EstatusId: item.EstatusId,
                EstatusDesc: item.EstatusDesc,
            } : Dato)
        }))
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="SOCIAS">
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
                                            <div className="row" style={{ width: '102%' }}>
                                                <div className="d-flex justify-content-end" >
                                                    <div style={{ width: '10%' }}>
                                                        <Link className="btn btn-danger" style={{ width: '3%', height: '3%' }} to={`/app/${id_int}/cobranza/CarteraGestores`}>Regresar</Link>
                                                    </div>
                                                </div>
                                                <span style={{ width: '300%', color: 'black', height: '200%' }}>  GESTORID: {state.GestorID} <br /> GESTOR: {state.GestorDesc} </span>
                                                <p></p>
                                                <div className="col-sm-12">
                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>

                                                        <div>
                                                            <div style={{ float: 'right' }}>

                                                                {/* <div className="input-group mb-3">
                                                                <input type="text" className="form-control" placeholder="Buscar Socia" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                                <span className="input-group-text"><FaSearch /> </span> */}
                                                                {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                         ><FaPlus /></button> */}
                                                                {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                                {/* </div> */}
                                                            </div>
                                                            <div style={{ float: 'left' }}><FaFilter /></div>
                                                            <div ><label> FILTROS</label></div>

                                                        </div>

                                                        <Formik
                                                            initialValues={{}}
                                                            onSubmit={() => { }}
                                                        >
                                                            <Form>
                                                                <div className="col-sm-12">
                                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                                        <div className="row" style={{ textAlign: 'initial' }}>

                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="SociaID"
                                                                                    name="DistribuidorDesc"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optDistribuidor}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroDistribuidor}
                                                                                    accion={fnGetFiltrosDistribuidor}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="SucursalID"
                                                                                    name="SucursalID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optSucursal}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroSucursal}
                                                                                    accion={fnGetFiltrosSucursal}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="ClasificadorGrupoID"
                                                                                    name="ClasificadorGrupoID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optGrupo}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroGrupo}
                                                                                    accion={fnGetFiltrosGrupo}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeStart
                                                                                    name={'FechaInicio'}
                                                                                    label={'FH Inicial Asign.'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Inicio'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setStartDate={setStartDate}
                                                                                />
                                                                            </div>

                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeEnd
                                                                                    name={'FechaFinal'}
                                                                                    label={'FH Final Asign.'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Final'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setEndDate={setEndDate} />
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Form>
                                                        </Formik>
                                                    </div>
                                                </div>
                                            </div>

                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        // paginationServer={true}
                                        // paginationTotalRows={state.DatosMostrar.length}
                                        responsive
                                        //keyField={"DistribuidorID"}
                                        // defaultSortField={"SucursalID"}
                                        columns={Columns}
                                    />

                                    <ModalWin open={state.Form.Clientes} xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>CLIENTES <br /> SOCIA: {state.Form.Datos.DistribuidorID} {state.Form.Datos.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.Form.Clientes && <DistribuidoresClientes
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                ProductoID={ProductoID}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>

                                    {state.CFormDireccion && <ModalWin open={state.CFormDireccion} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Direccion <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormDireccion
                                                oidc={props.oidc}
                                                DistribuidorID={state.Form.Datos.DistribuidorID}
                                                GestorID={state.Form.Datos.GestorID}
                                                idRelMesaCredProd={0}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}

                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    <ModalWin open={state.ListaTicket} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>SOCIA: {state.DistribuidorID} {state.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ListaTicket && <ListaTicket
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                cbActualizar={cbActualizar}
                                                //cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                DistribuidorID={state.DistribuidorID}
                                                DistribuidorDesc={state.DistribuidorDesc}
                                                GestorID={state.GestorID}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>

                                    {state.CFormReferencias && <ModalWin open={state.CFormReferencias} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>REFRENCIAS <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormReferencias
                                                oidc={props.oidc}
                                                //initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                DistribuidorID={state.Form.Datos.DistribuidorID}
                                            //optGestor={state.optGestor}
                                            //Prueba={state.Prueba}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    {state.CFormReferenciasAvales && <ModalWin open={state.CFormReferenciasAvales} large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>REFRENCIAS AVALES <br /> SOCIA: {state.Form.Datos.DistribuidorID} &nbsp; {state.Form.Datos.DistribuidorDesc} </h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormReferenciasAvales
                                                oidc={props.oidc}
                                                //initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                DistribuidorID={state.Form.Datos.DistribuidorID}
                                            //optGestor={state.optGestor}
                                            //Prueba={state.Prueba}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

                                    <ModalWin open={state.MostrarConvenio} center xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>SOCIA: {state.DistribuidorID} {state.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={() => setState(s => ({
                                                ...s,
                                                MostrarConvenio: false,
                                                DistribuidorID: 0,
                                                DistribuidorDesc: '',
                                                DatosConvenio: [],
                                                DatosConvenioDefecto: DatosConvenioDefecto
                                            }))}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.MostrarConvenio && <Convenios
                                                oidc={props.oidc}
                                                DistribuidorID={state.DistribuidorID}
                                                DistribuidorDesc={state.DistribuidorDesc}
                                                Data={state.DatosConvenio}
                                                DatosDefecto={state.DatosConvenioDefecto}
                                                cbActualizar={cbActualizarDatosConvenio}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>

                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(GestoresDistribuidores);

