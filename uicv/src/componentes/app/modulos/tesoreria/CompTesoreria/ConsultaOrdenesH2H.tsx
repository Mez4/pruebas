import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './ConsultaOrdenesH2H/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'


// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaMoneyBill, FaMoneyBillAlt, FaMoneyCheck, FaDollarSign, FaCreditCard, FaFile, FaFileAlt } from 'react-icons/fa'

// Custom components
import { Card, DatePickeEnd, DatePickeStart, Spinner } from '../../../../global'
import { BuscarCreditos } from './CreditosDispersionH2H/BuscarCreditos'
// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import DatePicker, { registerLocale } from "react-datepicker"
import * as Yup from 'yup'
import ReactTooltip from 'react-tooltip';
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DBConfia_STP } from '../../../../../interfaces_db/DBConfia/STP'
import { Field, Form, Formik } from 'formik'
import { FormateoDinero } from '../../../../../global/variables'
import { DispersarTarjeta } from './CreditosDispersionH2H/DispersarTarjeta'
import { toast } from 'react-toastify'
import { ConsultaPorRastreo } from './ConsultaOrdenesH2H/ConsultaPorRastreo'

type CatalogosType = {
    oidc: IOidc
}

type EstadoTipo = {
    Datos1: DBConfia_STP.IDispersiones_VW[],
    Datos2: DBConfia_STP.IDispersiones_VW[],
    Datos3: DBConfia_STP.IDispersiones_VW[],
    Datos4: DBConfia_STP.IDispersiones_VW[],
    DatosMostrar1: DBConfia_STP.IDispersiones_VW[],
    DatosMostrar2: DBConfia_STP.IDispersiones_VW[],
    DatosMostrar3: DBConfia_STP.IDispersiones_VW[],
    DatosMostrar4: DBConfia_STP.IDispersiones_VW[],
    DispersionesSeleccionadas: [],
    CantidadDispersionesSeleccionadas: number,
    Filtro: string,
    Deshabilitar2O: boolean,
    Deshabilitar2H: boolean,
    Cargando1: boolean,
    Cargando2: boolean,
    Cargando3: boolean,
    Cargando4: boolean,
    Error1: boolean,
    Error2: boolean,
    Error3: boolean,
    Error4: boolean,
    Detalle: boolean,
    ConsultaOperativa: boolean,
    ConsultaHistorica: boolean,
    Consulta1O: boolean,
    Consulta2O: boolean,
    Consulta1H: boolean,
    Consulta2H: boolean,
    Fecha1: string,
    Fecha2: string,
    Fecha3: string,
    Fecha4: string,
    UltimoSaldo: number,
    FechaUltimoSaldo: string,
    CargosPendientes: number,
    CuentaSaldo: string,
    Form:
    {
        Mostrar: boolean,
    },
}

const ConsultaOrdenesH2H = (props: CatalogosType) => {
    const MySwal = withReactContent(Swal)

    let isMounted = React.useRef(true)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const [state, setState] = React.useState<EstadoTipo>({
        Datos1: [],
        Datos2: [],
        Datos3: [],
        Datos4: [],
        DatosMostrar1: [],
        DatosMostrar2: [],
        DatosMostrar3: [],
        DatosMostrar4: [],
        DispersionesSeleccionadas: [],
        CantidadDispersionesSeleccionadas: 0,
        Filtro: '',
        Deshabilitar2O: true,
        Deshabilitar2H: true,
        ConsultaOperativa: true,
        ConsultaHistorica: false,
        Consulta1O: true,
        Consulta2O: false,
        Consulta1H: true,
        Consulta2H: false,
        Fecha1: '',
        Fecha2: '',
        Fecha3: '',
        Fecha4: '',
        Form:
        {
            Mostrar: false,
        },
        Cargando1: false,
        Cargando2: false,
        Cargando3: false,
        Cargando4: false,
        Error1: false,
        Error2: false,
        Error3: false,
        Error4: false,
        Detalle: false,
        UltimoSaldo: 0,
        FechaUltimoSaldo: '',
        CargosPendientes: 0,
        CuentaSaldo: '',
    })

    const Columns: IDataTableColumn[] =
        [
            { name: 'Clave Rastreo', selector: 'ClaveRastreo', wrap: true, sortable: false, center: true },
            { name: 'Concepto', center: true, selector: 'ConceptoPago', wrap: true, sortable: false, cell: (propss) => <span className='text-center'>{propss.ConceptoPago}</span> },
            {
                name: 'Nombre Beneficiario', center: true, width: '10%', selector: 'NombreBeneficiario', sortable: false,
                cell: (props) =>
                    <>
                        <span className='text-center' data-tip data-for={`NombreCompletoTooltip${props.OrdenDetalle}`}>{props.NombreBeneficiario}</span>
                        <ReactTooltip id={`NombreCompletoTooltip${props.OrdenDetalle}`}
                            type="dark"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            {props.NombreBeneficiario}
                        </ReactTooltip>
                    </>
            },
            { center: true, name: 'Cuenta Beneficiario', selector: 'CuentaBeneficiario', sortable: false, cell: (props) => <span className='text-center'>{props.CuentaBeneficiario}</span> },
            { center: true, name: 'Total', selector: 'Monto', sortable: false, format: row => FormateoDinero.format(row.Monto) },
            { center: true, name: 'Estado', selector: 'Estado', sortable: false, cell: (props) => <span className='text-center'>{props.Estado}</span> },
            { center: true, name: 'Fecha Operación', selector: 'FechaOperacion', sortable: false, cell: (props) => <span className='text-center'>{props.FechaOperacion}</span> },
            { center: true, name: 'Cuenta Ordenante', selector: 'CuentaOrdenante', sortable: false, cell: (props) => <span className='text-center'>{props.CuentaOrdenante}</span> },
            { center: true, name: 'Ordenante.', selector: 'NombreOrdenante', sortable: false, cell: (props) => props.ClaveEstatusDisp == 'CN' ? <span className='text-center'>{props.CausaDevolucion}</span> : <span className='text-center'>-</span> },
            { center: true, name: 'Cuenta Ordenante', selector: 'CuentaOrdenante', sortable: false, cell: (props) => <span className='text-center'>{moment(props.FechaRegistro).format('DD/MM/YYYY hh:mm:ss')}</span> },

        ]

    const FnGetSaldos = () => {
        setLoading(true)
        Funciones.FNGetSaldo(props.oidc)
            .then((res: any) => {
                if (isMounted.current) {
                    if (res.Cuenta != undefined) {
                        setLoading(false)
                        setState({
                            ...state,
                            UltimoSaldo: res.Saldo,
                            FechaUltimoSaldo: res.FechaConsulta,
                            CargosPendientes: res.CargosPendientes,
                            CuentaSaldo: res.Cuenta,
                        })
                    }
                }
            })
            .catch((err: any) => {
                if (isMounted.current) {
                    setErrorLoading(true)
                    toast.error("Ocurrió un error al obtener los saldos")
                }
            })

    }

    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetSaldos()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar1: FiltrarDatos(s.Datos1, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos1, state.Filtro])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar2: FiltrarDatos(s.Datos2, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos2, state.Filtro])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar3: FiltrarDatos(s.Datos3, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos3, state.Filtro])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar4: FiltrarDatos(s.Datos4, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos4, state.Filtro])

    const [loading, setLoading] = React.useState(false)
    const [errorLoading, setErrorLoading] = React.useState(false)
    const [startDate, setStartDate] = useState(moment().toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const schema = Yup.object().shape({
        FechaSeleccionada: Yup.string().required("Seleccione la fecha de consulta").typeError("Seleccione la fecha")
    });

    return (
        <div className="row">
            <div className="col-12">
                <Card Title={`Consulta de Órdenes H2H`}>
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={
                                    {
                                        FechaSeleccionada: new Date()
                                    }
                                }
                                validationSchema={state.ConsultaHistorica ? schema : null}
                                onSubmit={(values: any) => {

                                    if (state.ConsultaOperativa) {
                                        if (state.Consulta1O) {
                                            //setLoading(true)
                                            setState(s => ({ ...s, Cargando1: true, Error1: false }))
                                            let a = {
                                                TipoConsulta: 1
                                            };
                                            Funciones.FNGetOperativo(props.oidc, a)
                                                .then((respuesta: any) => {
                                                    if (isMounted.current === true) {
                                                        if (respuesta.TipoRespuesta == 1) {
                                                            setState(s => ({ ...s, Datos1: respuesta.DetalleOrdenes, Fecha1: respuesta.FechaGenerada, Cargando1: false, Error1: false, Deshabilitar2O: false }))
                                                        } else if (respuesta.TipoRespuesta == 2) {
                                                            let a_2 = { TipoConsulta: 2 }
                                                            MySwal.fire({
                                                                title: '<strong>Realizar petición a STP</strong>',
                                                                icon: 'warning',
                                                                html:
                                                                    <div className="text-center">
                                                                        <br />
                                                                        <span className='text-center'>Consulta aún no generada, ¿desea generarla?, esto utilizará 1 peticion disponible.</span>
                                                                    </div>,
                                                                showCloseButton: false,
                                                                showCancelButton: true,
                                                                showConfirmButton: true,
                                                                focusCancel: true,
                                                                cancelButtonText: 'Cancelar',
                                                                confirmButtonText: 'Aceptar',
                                                                confirmButtonAriaLabel: 'Aceptar',
                                                                cancelButtonAriaLabel: 'Cancelar',
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                            })
                                                                .then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        Funciones.FNGetOperativo(props.oidc, a_2)
                                                                            .then((respuesta: any) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Datos1: respuesta.DetalleOrdenes, Cargando1: false, Error1: false, Deshabilitar2O: false, Fecha1: respuesta.FechaGenerada }))
                                                                                }
                                                                            })
                                                                            .catch((error) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Cargando1: false, Error1: true }))
                                                                                    setLoading(false)
                                                                                    toast.error("Ocurrió un error al consultar las órdenes")
                                                                                }
                                                                            })
                                                                    } else {
                                                                        setLoading(false)
                                                                        setState(s => ({ ...s, Cargando1: false, Error1: false }))
                                                                        MySwal.fire(
                                                                            {
                                                                                icon: 'info',
                                                                                html: <div><br />
                                                                                    <h3 className="text-center"><strong>Aviso</strong></h3>
                                                                                    <div className={`modal-body`}>
                                                                                        <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                                                                    </div>
                                                                                </div>,
                                                                                confirmButtonText: `Ok`,
                                                                                confirmButtonAriaLabel: `Ok`,
                                                                                confirmButtonColor: `#3085d6`,
                                                                            }
                                                                        );
                                                                    }
                                                                })
                                                        }
                                                    }
                                                })
                                                .catch((error: any) => {
                                                    if (isMounted.current === true) {
                                                        setState(s => ({ ...s, Datos1: [], Cargando1: false, Error1: true }))
                                                        setLoading(false)
                                                    }
                                                })
                                        } else if (state.Consulta2O) {
                                            setLoading(true)
                                            setState(s => ({ ...s, Cargando2: true, Error2: false }))
                                            let a = {
                                                TipoConsulta: 3
                                            };
                                            Funciones.FNGetOperativo(props.oidc, a)
                                                .then((respuesta: any) => {
                                                    if (isMounted.current === true) {
                                                        if (respuesta.TipoRespuesta == 3) {
                                                            console.log("respuesta3", respuesta)
                                                            setState(s => ({ ...s, Datos2: respuesta.DetalleOrdenes, Fecha2: respuesta.FechaGenerada, Cargando2: false, Error2: false }))
                                                        } else if (respuesta.TipoRespuesta == 4) {
                                                            let a_2 = {
                                                                TipoConsulta: 4
                                                            }
                                                            MySwal.fire({
                                                                title: '<strong>Realizar petición a STP</strong>',
                                                                icon: 'warning',
                                                                html:
                                                                    <div className="text-center">
                                                                        <br />
                                                                        <span className='text-center'>Consulta aún no generada, ¿desea generarla?, esto utilizará la segunda peticion disponible.</span>
                                                                    </div>,
                                                                showCloseButton: false,
                                                                showCancelButton: true,
                                                                showConfirmButton: true,
                                                                focusCancel: true,
                                                                cancelButtonText: 'Cancelar',
                                                                confirmButtonText: 'Aceptar',
                                                                confirmButtonAriaLabel: 'Aceptar',
                                                                cancelButtonAriaLabel: 'Cancelar',
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                            })
                                                                .then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        Funciones.FNGetOperativo(props.oidc, a_2)
                                                                            .then((respuesta: any) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Datos2: respuesta.DetalleOrdenes, Fecha2: respuesta.FechaGenerada, Cargando2: false, Error2: false }))

                                                                                }
                                                                            })
                                                                            .catch((error) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Cargando2: false, Error2: true }))
                                                                                    setLoading(false)
                                                                                }
                                                                            })
                                                                    } else {
                                                                        setLoading(false)
                                                                        setState(s => ({ ...s, Cargando2: false, Error2: false }))
                                                                        MySwal.fire(
                                                                            {
                                                                                icon: 'info',
                                                                                html: <div><br />
                                                                                    <h3 className="text-center"><strong>Aviso</strong></h3>
                                                                                    <div className={`modal-body`}>
                                                                                        <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                                                                    </div>
                                                                                </div>,
                                                                                confirmButtonText: `Ok`,
                                                                                confirmButtonAriaLabel: `Ok`,
                                                                                confirmButtonColor: `#3085d6`,
                                                                            }
                                                                        );
                                                                    }
                                                                })
                                                        }
                                                    }
                                                })
                                                .catch((error: any) => {
                                                    if (isMounted.current === true) {
                                                        setState(s => ({ ...s, Datos1: [], Cargando1: false, Error1: true }))
                                                        setLoading(false)
                                                    }
                                                })
                                        } else {
                                            return;
                                        }
                                    } else if (state.ConsultaHistorica) {
                                        if (state.Consulta1H) {
                                            setState(s => ({ ...s, Cargando3: true, Error3: false }))
                                            let a = { TipoConsulta: 1, Fecha: values.FechaInicio };
                                            Funciones.FNGetOperativoHistorico(props.oidc, a)
                                                .then((respuesta: any) => {
                                                    if (isMounted.current === true) {
                                                        if (respuesta.TipoRespuesta == 1) {
                                                            setState(s => ({ ...s, Datos3: respuesta.DetalleOrdenes, Fecha3: respuesta.FechaConsultada, Deshabilitar2H: false, Cargando3: false, Error3: false }))
                                                        } else {
                                                            let a_3 = { TipoConsulta: 2, Fecha: values.FechaSeleccionada };

                                                            console.log("ANTES de SWAL ,", a_3)
                                                            MySwal.fire({
                                                                title: '<strong>Realizar petición a STP</strong>',
                                                                icon: 'warning',
                                                                html:
                                                                    <div className="text-center">
                                                                        <br />
                                                                        <span className='text-center'>Consulta aún no generada, ¿desea generarla?, esto utilizará 1 peticion disponible.</span>
                                                                    </div>,
                                                                showCloseButton: false,
                                                                showCancelButton: true,
                                                                showConfirmButton: true,
                                                                focusCancel: true,
                                                                cancelButtonText: 'Cancelar',
                                                                confirmButtonText: 'Aceptar',
                                                                confirmButtonAriaLabel: 'Aceptar',
                                                                cancelButtonAriaLabel: 'Cancelar',
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                            })
                                                                .then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        Funciones.FNGetOperativoHistorico(props.oidc, a_3)
                                                                            .then((respuesta: any) => {
                                                                                if (isMounted.current === true) {
                                                                                    console.log("RESPUES HISTORICO 3 ,", respuesta)
                                                                                    setState(s => ({ ...s, Datos3: respuesta.DetalleOrdenes, Deshabilitar2H: false, Fecha3: respuesta.FechaConsultada, Cargando3: false, Error3: false }))
                                                                                }
                                                                            })
                                                                            .catch((error: any) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Datos3: [], Cargando3: false, Error3: true }))
                                                                                    setLoading(false)
                                                                                }
                                                                            })
                                                                    } else {
                                                                        setLoading(false)
                                                                        setState(s => ({ ...s, Datos3: [], Cargando3: false, Error3: false }))
                                                                        MySwal.fire(
                                                                            {
                                                                                icon: 'info',
                                                                                html: <div><br />
                                                                                    <h3 className="text-center"><strong>Aviso</strong></h3>
                                                                                    <div className={`modal-body`}>
                                                                                        <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                                                                    </div>
                                                                                </div>,
                                                                                confirmButtonText: `Ok`,
                                                                                confirmButtonAriaLabel: `Ok`,
                                                                                confirmButtonColor: `#3085d6`,
                                                                            }
                                                                        );
                                                                    }
                                                                })

                                                        }
                                                    }
                                                })
                                                .catch((error: any) => {
                                                    if (isMounted.current === true) {
                                                        setState(s => ({ ...s, Datos3: [], Cargando3: false, Error3: true }))
                                                    }
                                                })
                                        }
                                        else if (state.Consulta2H) {
                                            setState(s => ({ ...s, Cargando4: true, Error4: false }))
                                            let a_4 = { TipoConsulta: 3, Fecha: values.FechaInicio };
                                            Funciones.FNGetOperativoHistorico(props.oidc, a_4)
                                                .then((respuesta: any) => {
                                                    if (isMounted.current === true) {
                                                        if (respuesta.TipoRespuesta == 3) {
                                                            setState(s => ({ ...s, Datos4: respuesta.DetalleOrdenes, Fecha4: respuesta.FechaConsultada, Cargando4: false, Error4: false }))
                                                        } else {
                                                            let a_5 = { TipoConsulta: 4, Fecha: values.FechaSeleccionada };

                                                            MySwal.fire({
                                                                title: '<strong>Realizar petición a STP</strong>',
                                                                icon: 'warning',
                                                                html:
                                                                    <div className="text-center">
                                                                        <br />
                                                                        <span className='text-center'>Consulta aún no generada, ¿desea generarla?, esto utilizará 1 peticion disponible.</span>
                                                                    </div>,
                                                                showCloseButton: false,
                                                                showCancelButton: true,
                                                                showConfirmButton: true,
                                                                focusCancel: true,
                                                                cancelButtonText: 'Cancelar',
                                                                confirmButtonText: 'Aceptar',
                                                                confirmButtonAriaLabel: 'Aceptar',
                                                                cancelButtonAriaLabel: 'Cancelar',
                                                                confirmButtonColor: '#3085d6',
                                                                cancelButtonColor: '#d33',
                                                            })
                                                                .then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        Funciones.FNGetOperativoHistorico(props.oidc, a_5)
                                                                            .then((respuesta: any) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Datos4: respuesta.DetalleOrdenes, Fecha4: respuesta.FechaConsultada, Cargando4: false, Error4: false }))
                                                                                }
                                                                            })
                                                                            .catch((error: any) => {
                                                                                if (isMounted.current === true) {
                                                                                    setState(s => ({ ...s, Datos4: [], Cargando4: false, Error4: true }))
                                                                                }
                                                                            })
                                                                    } else {
                                                                        MySwal.fire(
                                                                            {
                                                                                icon: 'info',
                                                                                html: <div><br />
                                                                                    <h3 className="text-center"><strong>Aviso</strong></h3>
                                                                                    <div className={`modal-body`}>
                                                                                        <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                                                                    </div>
                                                                                </div>,
                                                                                confirmButtonText: `Ok`,
                                                                                confirmButtonAriaLabel: `Ok`,
                                                                                confirmButtonColor: `#3085d6`,
                                                                            }
                                                                        );
                                                                        setLoading(false)
                                                                        setState(s => ({ ...s, Datos4: [], Cargando4: false, Error4: false }))
                                                                    }
                                                                })
                                                        }
                                                    }
                                                })
                                                .catch((error: any) => {
                                                    if (isMounted.current === true) {
                                                        setState(s => ({ ...s, Datos4: [], Cargando4: false, Error4: true }))
                                                        setLoading(false)
                                                    }
                                                })
                                        }
                                        else {
                                            return;
                                        }
                                    } else {
                                        return;
                                    }

                                }}>
                                <Form>
                                    <br />
                                    <div className="text-center columns is-gapless is-multiline is-mobile">
                                        <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <h4>
                                                <strong>Cuenta:</strong>
                                                {loading && <Spinner />}
                                                {!loading && <> {state.CuentaSaldo != '' ? state.CuentaSaldo : 'N/A'}</>}
                                                {loading && errorLoading && <h4>Error!</h4>}
                                            </h4>
                                        </div>
                                        <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <h4>
                                                <strong>Saldo Real:</strong>
                                                {loading && <Spinner />}
                                                {!loading && <>{state.UltimoSaldo <= 0 ? <label style={{ color: 'red' }}>{FormateoDinero.format(state.UltimoSaldo)}</label> : <label style={{ color: 'green' }}>{FormateoDinero.format(state.UltimoSaldo)}</label>}  </>}
                                                {loading && errorLoading && <h4>Error!</h4>}

                                            </h4>
                                        </div>
                                        <div className="column is-one-third-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <h4>
                                                <strong>Cargos Pend:</strong>
                                                {loading && <Spinner />}
                                                {!loading && <>  {state.CargosPendientes <= 0 ? <label style={{ color: 'green' }}>{FormateoDinero.format(state.CargosPendientes)}</label> : <label style={{ color: 'red' }}>{FormateoDinero.format(state.CargosPendientes)}</label>}</>}
                                                {loading && errorLoading && <h4>Error!</h4>}

                                            </h4>
                                        </div>

                                        <div className="column text-center is-full-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <h4>
                                                <strong>Hora de Actualización:</strong>
                                                {loading && <Spinner />}
                                                {!loading && <>{state.FechaUltimoSaldo != '' ? moment(state.FechaUltimoSaldo).parseZone().format("DD/MM/YYYY hh:mm:ss A") : 'N/A'}</>}
                                                {loading && errorLoading && <h4>Error!</h4>}
                                            </h4>
                                        </div>
                                    </div>


                                    <div className="columns is-centered is-mobile is-multiline">
                                        <div className="text-center column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">



                                            <div className='row text-center'>
                                                <span className='text-center'><strong>Selecciona el tipo de consulta: </strong></span>
                                            </div>
                                            <div className='row text-center'>

                                                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                    <br /> <Field checked={state.ConsultaOperativa} type="radio" className="btn-check" name="tipoCliente" id="Cliente1" autoComplete="off" value="1" onClick={() => {
                                                        setState({
                                                            ...state,
                                                            ConsultaOperativa: true,
                                                            Consulta1O: true,
                                                            Consulta1H: true,
                                                            Consulta2O: false,
                                                            Consulta2H: false,
                                                            ConsultaHistorica: false
                                                        })
                                                    }} />
                                                    <label className="btn btn-outline-primary" htmlFor="Cliente1">Operativa</label>

                                                    <Field checked={state.ConsultaHistorica} type="radio" className="btn-check" name="tipoCliente" id="Cliente2" autoComplete="off" value="2" onClick={() => {
                                                        setState({
                                                            ...state,
                                                            ConsultaOperativa: false,
                                                            Consulta1O: true,
                                                            Consulta1H: true,
                                                            Consulta2O: false,
                                                            Consulta2H: false,
                                                            ConsultaHistorica: true
                                                        })
                                                    }} />
                                                    <label className="btn btn-outline-primary" htmlFor="Cliente2">Histórica</label>
                                                </div>
                                                {/*    <div className='col'>
                                                    <DatePickeStart name={'FechaSeleccionada'} label={'Fecha a consultar'} disabled={state.ConsultaOperativa} placeholder={'Fecha'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />
                                                </div>
                                             */}</div>

                                        </div>
                                        <div className="column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <DatePickeStart name={'FechaSeleccionada'} label={'Fecha a consultar'} disabled={state.ConsultaOperativa} placeholder={'Fecha'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />

                                        </div>

                                        <div className="text-center column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <br />
                                            <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light" style={{ backgroundColor: '#3085D6' }} onClick={() => { }}>
                                                <span className="">Realizar consulta</span>&nbsp;<FiRefreshCcw />
                                            </button>

                                        </div>
                                        <div className="text-center column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <br />
                                            <div className="input-group pb-3 mb-10">
                                                <input type="text" className="form-control" placeholder="Buscar orden" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                <span className="input-group-text"><FaSearch /> </span>
                                            </div>
                                        </div>
                                        <div className="text-center column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                            <br />
                                            <button type="button" className="ms-2 btn waves-effect waves-light" style={{ backgroundColor: '#3eba46', color: 'white' }} onClick={() => {
                                                //SetState Form Mostrar 
                                                setState(s => ({ ...s, Form: { Mostrar: true } }))
                                            }}>
                                                <span className="">Rastrear por clave</span>&nbsp;<FaSearch />
                                            </button>

                                        </div>
                                    </div>


                                    <ModalWin open={state.Form.Mostrar} large={false} center={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Buscar por Clave de Rastreo</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {
                                                <ConsultaPorRastreo
                                                    Seguridad={props.oidc}
                                                    initialValues={
                                                        {
                                                            ClaveRastreo: '',
                                                            FechaOperacion: new Date()
                                                        }
                                                    }
                                                    fnCancelar={() => setState(s => ({ ...s, Form: { Mostrar: false } }))}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>

                                    {state.ConsultaOperativa && <>
                                        <div className="columns is-centered is-mobile is-multiline mt-3">

                                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                <br /> <Field checked={state.Consulta1O} type="radio" className="btn-check" name="Consulta1" id="Consulta1" autoComplete="off" value="1" onClick={() => {
                                                    setState({
                                                        ...state,
                                                        Consulta1O: true,
                                                        Consulta2O: false
                                                    })
                                                }} />
                                                <label className="btn btn-outline-primary" htmlFor="Consulta1">Consulta Op. #1 <FaFileAlt></FaFileAlt></label>

                                                <Field disabled={state.Deshabilitar2O} checked={state.Consulta2O} type="radio" className="btn-check" name="Consulta2" id="Consulta2" autoComplete="off" value="2" onClick={() => {
                                                    setState({
                                                        ...state,
                                                        Consulta1O: false,
                                                        Consulta2O: true
                                                    })
                                                }} />
                                                <label className="btn btn-outline-primary" htmlFor="Consulta2">Consulta Op #2 <FaFileAlt></FaFileAlt></label>
                                            </div>
                                        </div>


                                        <div className="tab-content" id="pills-tabContent">
                                            <div className={`tab-pane fade ${state.Consulta1O ? 'show active' : ''}`} id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                {state.Cargando1 && <Spinner />}
                                                {!state.Cargando1 && !state.Error1 &&
                                                    <DataTable
                                                        title={<span><h4>Consulta #1 - Dia Operativo generada el {state.Fecha1 != '' ? moment.parseZone(state.Fecha1).utcOffset(0, true).format('DD/MM/YYYY hh:mm:ss A') : 'S/G'}</h4></span>}
                                                        subHeader
                                                        key={"OrdenDetalle"}
                                                        paginationComponentOptions={{
                                                            noRowsPerPage: false, rowsPerPageText: 'Dispersiones por página',
                                                            rangeSeparatorText: 'de',
                                                            selectAllRowsItem: false,
                                                            selectAllRowsItemText: 'Todos',
                                                        }}
                                                        noDataComponent={<div>No hay datos</div>}
                                                        data={state.DatosMostrar1}
                                                        striped
                                                        pagination
                                                        dense
                                                        responsive
                                                        keyField={"OrdenDetalle"}
                                                        defaultSortField={"OrdenDetalle"}
                                                        columns={Columns}

                                                    />}
                                            </div>
                                            <div className={`tab-pane fade ${state.Consulta2O ? 'show active' : ''}`} id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">


                                                {state.Cargando2 && <Spinner />}
                                                {!state.Cargando2 && !state.Error2 &&
                                                    <DataTable
                                                        title={<span><h4>Consulta #2 - Dia Operativo generada el {state.Fecha2 != '' ? moment.parseZone(state.Fecha2).format('DD/MM/YYYY hh:mm:ss A') : 'S/G'}</h4></span>}
                                                        subHeader
                                                        key={"OrdenDetalle"}
                                                        paginationComponentOptions={{
                                                            noRowsPerPage: false, rowsPerPageText: 'Dispersiones por página',
                                                            rangeSeparatorText: 'de',
                                                            selectAllRowsItem: false,
                                                            selectAllRowsItemText: 'Todos',
                                                        }}
                                                        noDataComponent={<div>No hay datos</div>}
                                                        data={state.DatosMostrar2}
                                                        striped
                                                        pagination
                                                        dense
                                                        responsive
                                                        keyField={"OrdenDetalle"}
                                                        defaultSortField={"OrdenDetalle"}
                                                        columns={Columns}

                                                    />}
                                            </div>
                                        </div></>}

                                    {state.ConsultaHistorica && <>
                                        <div className="columns is-centered is-mobile is-multiline mt-3">
                                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                                <br /> <Field checked={state.Consulta1H} type="radio" className="btn-check" name="Consulta1" id="Consulta1" autoComplete="off" value="1" onClick={() => {
                                                    setState({
                                                        ...state,
                                                        Consulta1H: true,
                                                        Consulta2H: false
                                                    })
                                                }} />
                                                <label className="btn btn-outline-primary" htmlFor="Consulta1">Consulta His. #1 <FaFileAlt></FaFileAlt></label>

                                                <Field disabled={state.Deshabilitar2H} checked={state.Consulta2H} type="radio" className="btn-check" name="Consulta2" id="Consulta2" autoComplete="off" value="2" onClick={() => {
                                                    setState({
                                                        ...state,
                                                        Consulta1H: false,
                                                        Consulta2H: true
                                                    })
                                                }} />
                                                <label className="btn btn-outline-primary" htmlFor="Consulta2">Consulta His. #2 <FaFileAlt></FaFileAlt></label>
                                            </div>
                                        </div>


                                        <div className="tab-content" id="pills-tabContent">
                                            <div className={`tab-pane fade ${state.Consulta1H ? 'show active' : ''}`} id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                                {state.Cargando3 && <Spinner />}
                                                {!state.Cargando3 && !state.Error3 &&
                                                    <DataTable
                                                        title={<span><h4>Consulta #1 - Fecha {state.Fecha3 ? moment(state.Fecha3).format("DD-MM-YYYY") : "S/G"}</h4></span>}
                                                        subHeader
                                                        key={"OrdenDetalle"}
                                                        paginationComponentOptions={{
                                                            noRowsPerPage: false, rowsPerPageText: 'Dispersiones por página',
                                                            rangeSeparatorText: 'de',
                                                            selectAllRowsItem: false,
                                                            selectAllRowsItemText: 'Todos',
                                                        }}
                                                        noDataComponent={<div>No hay datos</div>}
                                                        data={state.DatosMostrar3}
                                                        striped
                                                        pagination
                                                        dense
                                                        responsive
                                                        keyField={"OrdenDetalle"}
                                                        defaultSortField={"OrdenDetalle"}
                                                        columns={Columns}

                                                    />}
                                            </div>
                                            <div className={`tab-pane fade ${state.Consulta2H ? 'show active' : ''}`} id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">


                                                {state.Cargando4 && <Spinner />}
                                                {!state.Cargando4 && !state.Error4 &&
                                                    <DataTable
                                                        title={<span><h4>Consulta #2 - Fecha {state.Fecha4 ? moment(state.Fecha4).format("DD-MM-YYYY") : "S/G"}</h4></span>}
                                                        subHeader
                                                        key={"OrdenDetalle"}
                                                        paginationComponentOptions={{
                                                            noRowsPerPage: false, rowsPerPageText: 'Dispersiones por página',
                                                            rangeSeparatorText: 'de',
                                                            selectAllRowsItem: false,
                                                            selectAllRowsItemText: 'Todos',
                                                        }}
                                                        noDataComponent={<div>No hay datos</div>}
                                                        data={state.DatosMostrar4}
                                                        striped
                                                        pagination
                                                        dense
                                                        responsive
                                                        keyField={"OrdenDetalle"}
                                                        defaultSortField={"OrdenDetalle"}
                                                        columns={Columns}
                                                    />}
                                            </div>
                                        </div></>}

                                </Form>

                            </Formik>

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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultaOrdenesH2H)
