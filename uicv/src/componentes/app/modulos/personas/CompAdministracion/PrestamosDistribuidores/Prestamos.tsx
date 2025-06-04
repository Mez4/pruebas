import React, { useState, useEffect } from 'react'
import { AnyIfEmpty, connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../../global'
import { DBConfia_Creditos } from '../../../../../../interfaces_db/DBConfia/Creditos'
import * as FnIncrementos from './Funciones'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ErrorMessage, Field } from 'formik'

// Iconos
import { FiRefreshCcw } from 'react-icons/fi'
import { FcCheckmark, FcOk } from "react-icons/fc";
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaRegCheckCircle, FaRegCircle, FaCircle, FaMinus, FaEye } from 'react-icons/fa'
import { IoAddSharp } from "react-icons/io5";

import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify'

// SubComponentes
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import CreditoDistribuidor from '../../../creditos/CompCreditos/CreditoDistribuidor'
import * as Funciones from './Funciones'
import * as FnCajas from '../../../tesoreria/CompTesoreria/CajasUsuarios/Funciones'
import { SeleccionarCajaSucursal } from '../../../../../selectores'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormateoDinero, FormateoNumero } from '../../../../../../global/variables'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import moment from 'moment'

enum EColumnas {
    CreditoID,
    Capital,
    ImporteTotal,
    Abonos,
    SaldoActual,
    SaldoAtrasado,
    DiasAtraso,
    FechaHoraRegistro,
    EstatusID
}

const GenerarColumna = (Columna: EColumnas): IDataTableColumn => {
    switch (Columna) {
        case EColumnas.CreditoID:
            return ({ name: 'Crédito', selector: 'CreditoID', sortable: true, cell: (cprops) => <span>{cprops.CreditoID}</span> })
        case EColumnas.Capital:
            return ({ name: 'Capital', selector: 'Capital', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Capital)}</span> })
        case EColumnas.ImporteTotal:
            return ({ name: 'Importe', selector: 'ImporteTotal', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ImporteTotal)}</span> })
        case EColumnas.Abonos:
            return ({ name: 'Abonos', selector: 'Abonos', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Abonos)}</span> })
        case EColumnas.SaldoActual:
            return ({ name: 'Saldo', selector: 'SaldoActual', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SaldoActual)}</span> })
        case EColumnas.SaldoAtrasado:
            return ({ name: 'Atrasado', selector: 'SaldoAtrasado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SaldoAtrasado)}</span> })
        case EColumnas.DiasAtraso:
            return ({ name: 'Dias Atr', selector: 'DiasAtraso', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.DiasAtraso)}</span> })
        case EColumnas.FechaHoraRegistro:
            return ({ name: 'Fch Reg', selector: 'FechaHoraRegistro', sortable: true, cell: (cprops) => <span>{moment(cprops.FechaHoraRegistro).format('DD/MM/YYYY')}</span> })
        case EColumnas.EstatusID:
            return ({
                name: 'Estatus', selector: 'EstatusID', sortable: true, cell: (cprops) =>
                    <>
                        <span data-tip data-for={`CreditoEsttTooltip${cprops.CreditoID}`} ><FaCircle color={cprops.Color} title={cprops.color} /></span>
                        <ReactTooltip id={`CreditoEsttTooltip${cprops.CreditoID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            {cprops.EstatusNombre}
                        </ReactTooltip>
                    </>
            })

    }
}

type FuncionesTabla = {
    Control(props: any): React.ReactElement,
    Funcion(Creditos: DBConfia_Creditos.ICreditosPermisos_VW): any
}

type PrestamosTipo = {

    oidc: IOidc

    Columnas: EColumnas[]

    Funciones: FuncionesTabla[]

    ProductoID: number | undefined

    DatosConsulta: {
        ProductoID: number
        DistribuidorID: number
        ClienteID: number
    }

    Refresh: number
}

type PrestamosEstadoTipo = {
    Creditos: DBConfia_Creditos.ICreditosPermisos_VW[],
    DatosDetalle: DBConfia_Creditos.IPlanPagos[],
    Cargando: boolean,
    Error: boolean,
    CredID: number,
    DetallePlan: boolean,
    Mostrar: boolean,
    SucursalId: number,
    CajaID: number,
    CajaDefault: {
        ProductoID: number,
        SucursalID: number,
        CajaID: number
    },
    ShowCaja: boolean,
    optSucursales: any[]
    // Type: number,
}

const Prestamos = (props: PrestamosTipo) => {

    const [Estado, definirEstado] = useState<PrestamosEstadoTipo>({
        Creditos: [],
        DatosDetalle: [],
        Cargando: true,
        Error: false,
        CredID: 0,
        DetallePlan: false,
        Mostrar: false,
        SucursalId: 0,
        CajaID: 0,
        CajaDefault: {
            ProductoID: 0,
            SucursalID: 0,
            CajaID: 0
        },
        ShowCaja: false,
        optSucursales: []
        // Type: 1,
    })

    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = useState(false)

    const ConsultarDatos = async () => {

        definirEstado(s => ({
            ...s,
            Cargando: true, Error: false, Creditos: [], DatosDetalle: [],
            CredID: 0,
            DetallePlan: false,
            Mostrar: false,
            SucursalId: 0,
            CajaID: 0,
            CajaDefault: {
                ProductoID: 0,
                SucursalID: 0,
                CajaID: 0
            },
            ShowCaja: false,
            // optSucursales: []
        }))

        try {
            var Creditos = await Funciones.FNgetbyfiltros(props.oidc, {
                ...props.DatosConsulta,
                SucursalID: 0,
                EstatusID: '',
                ZonaID: 0,
                DistribuidorNivelID: 0,
                ContratoID: 0,
                CoordinadorID: 0,
                EmpresaId: 0,
            })

            definirEstado(s => ({
                ...s,
                Cargando: false, Error: false, Creditos, DatosDetalle: [],
                CredID: 0,
                DetallePlan: false,
                Mostrar: false,
                // SucursalId: 0,            
            }))
        }
        catch (e) {
            definirEstado(s => ({
                ...s,
                Cargando: false, Error: false, Creditos: [], DatosDetalle: [],
                CredID: 0,
                DetallePlan: false,
                Mostrar: false,
                // SucursalId: 0,            
            }))
        }
    }


    const GetDatosGrupo = async () => {
        try {
            var Datos = await Funciones.FNGetGrupoDistribuidor(props.oidc,
                { ProductoID: props.ProductoID, DistribuidorID: props.DatosConsulta.DistribuidorID }
            )

            // console.log('Datos: ', Datos)

            definirEstado(s => ({ ...s, SucursalId: Datos.SucursalID }))
        }
        catch (e) {
            definirEstado(s => ({ ...s, SucursalId: 0 }))
        }
    }

    const fnGetSucursalesCaja = () => {
        FnCajas.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {

                // console.log('respuesta: ', respuesta)

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Sucursal };
                    return obj
                });

                definirEstado(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                definirEstado(s => ({ ...s, optSucursales: [] }))
            })
    }

    const fnSetSucCaja = (Data: any) => {
        // setState(s => ({ ...s, Form: { ...state.Form, Datos: {...state.Form.Datos, SucursalId: Data.SucursalID, CajaID: Data.CajaID} }, ShowCaja: false }))

        definirEstado(s => ({
            ...s,
            ShowCaja: false,
            SucursalId: Data.SucursalID,
            CajaID: Data.CajaID,
            Mostrar: true
        }))
    }

    useEffect(() => {

        fnGetSucursalesCaja()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {

        ConsultarDatos()
        GetDatosGrupo()
        // eslint-disable-next-line
    }, [props.Refresh])

    const SwalWarning = (title: string, msg: string) => {
        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">{title}</h3>
                    <div className={`modal-body`}>
                        <div className='row text-center'>
                            <span className="text-center"><h4>{msg}</h4></span>
                            <br />
                            <span className='text-center'><h4><strong>Por favor espere...</strong></h4></span>
                        </div>
                    </div>
                </div>,
                timerProgressBar: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: `Ok`,
                didOpen: () => {
                    MySwal.showLoading()
                },

            }
        );
    }

    const FNGetDetalle = (CreditoID: number) => {
        SwalWarning('Aviso', 'Obteniendo Plan de Pagos.');
        definirEstado(s => ({ ...s, DatosDetalle: [] }))
        Funciones.FNGetPlanPagos(props.oidc, CreditoID)
            .then((respuesta: any) => {

                if (respuesta.length > 0) {
                    // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
                    let tabla: any[] = []
                    let ImporteTotal = 0
                    let Abonos = 0
                    let SaldoActual = 0
                    let Comision = 0

                    respuesta.forEach((element: any) => {
                        // posicion = posicion + 1
                        //if (cajaAnteriorID == 0) {
                        let PlanPagos: any = {
                            NoPago: element.NoPago,
                            FechaVencimiento: element.FechaVencimiento,
                            ImporteTotal: element.ImporteTotal,
                            Abonos: element.Abonos,
                            SaldoActual: element.SaldoActual,
                            Comision: element.Comision,
                            FechaLiquidacion: element.FechaLiquidacion,
                            DiasAtraso: element.DiasAtraso,
                        }

                        ImporteTotal += element.ImporteTotal
                        SaldoActual += element.SaldoActual
                        Abonos += element.Abonos
                        Comision += element.Comision

                        tabla.push(PlanPagos)
                    });

                    let TotalPlanPagos: any = {
                        NoPago: null,
                        FechaVencimiento: '',
                        ImporteTotal,
                        Abonos,
                        SaldoActual,
                        Comision,
                        FechaLiquidacion: '',
                        DiasAtraso: 0,
                    }

                    tabla.push(TotalPlanPagos)

                    // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

                    definirEstado(s => ({ ...s, DetallePlan: true, DatosDetalle: tabla, CredID: CreditoID }))
                    MySwal.close();
                } else {
                    definirEstado(s => ({ ...s, DetallePlan: true, DatosDetalle: [], CredID: CreditoID }))
                    MySwal.close();
                }

            })
            .catch(() => {
                definirEstado(s => ({ ...s, DetallePlan: false, DatosDetalle: [] }))
                MySwal.close();
                toast.error("Error al consultar, vuelva a intentarlo")
            })
    }

    const fnCancelar = (res: any) => {
        definirEstado({ ...Estado, Mostrar: false })
        ConsultarDatos()
    }

    // Define the columns
    const Columns = //React.useMemo(
        () => {
            // Columnas basicas a incluir en la tabla
            const Columnas: IDataTableColumn[] =
                [
                    { name: 'Crédito', selector: 'CreditoID', sortable: true },
                ]

            // Iteramos las columnas
            for (let c: number = 0; c < props.Columnas.length; c++)
                Columnas.push(GenerarColumna(props.Columnas[c]))

            if (props.Funciones.length > 0)
                Columnas.push({
                    name: 'Plan Pagos', sortable: false, minWidth: `${props.Funciones.length * 50}px`,
                    cell: (cprops) =>
                        <div>
                            {props.Funciones.map((Fn, FnId) =>
                                <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                    <button title='Detalle' data-tip data-for={`DetallePagoTooltip${cprops.CreditoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button"
                                        onClick={() => {
                                            FNGetDetalle(cprops.CreditoID)
                                        }}>
                                        <FaEye />
                                    </button>
                                    <ReactTooltip id={`DetallePagoTooltip${cprops.CreditoID}`}
                                        type="info"
                                        effect="solid"
                                        clickable
                                        globalEventOff="click"
                                    >
                                        Ver Plan de Pagos
                                    </ReactTooltip>
                                </div>
                                // <span key={`fn_${cprops.DistribuidorID}_${FnId}`} onClick={() => FNGetDetalle(cprops.CreditoID)}>
                                //     {/* {Fn.Control} */}                                    
                                // </span>
                            )}
                        </div>
                })

            return Columnas
            //eslint-disable-next-line
        }//, [])

    const DetailColumns: //= React.useMemo(() => {
        //let colRet: 
        IDataTableColumn[] =
        [
            // { name: '# Pago', width: '95px', selector: 'CreditoID', sortable: true, },
            {
                name: '# Pago', width: '95px', selector: 'NoPago', sortable: false, cell: (props) => props.NoPago != null ? <span style={{ width: '95px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{props.NoPago}</span> : <span>TOTAL</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
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
                name: 'Importe', width: '150px', selector: 'ImporteTotal', sortable: false, format: row => FormateoDinero.format(row.ImporteTotal), conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',

                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'

                        },

                    },
                ]
            },
            {
                name: 'Abono', width: '150px', selector: 'Abonos', sortable: false, format: row => FormateoDinero.format(row.Abonos), conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',

                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'

                        },

                    },
                ]
            },
            {
                name: 'Saldo', width: '150px', selector: 'SaldoActual', sortable: false, format: row => FormateoDinero.format(row.SaldoActual), conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',

                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'

                        },

                    },
                ]
            },
            {
                name: 'Vencimiento', width: '150px', selector: 'FechaVencimiento', sortable: false, cell: (props) => props.NoPago != null ? <span>{moment(props.FechaVencimiento).format('DD/MM/YYYY')}</span> : <span></span>, conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',

                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'

                        },

                    },
                ]
            },
            {
                name: 'Días Atr', width: '95px', selector: 'DiasAtraso', sortable: false, cell: (props) => props.NoPago != null ? <span>{props.DiasAtraso}</span> : <span></span>, conditionalCellStyles: [
                    {
                        when: row => row.DiasAtraso > 0,
                        style: {
                            color: 'red',
                        }
                    },
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',

                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'

                        },

                    },
                ]
            },
            {
                name: 'Fch Liq', width: '150px', selector: 'FechaLiquidacion', sortable: false, cell: (props) => props.NoPago != null ? <span>{props.FechaLiquidacion ? moment(props.FechaLiquidacion).format('DD/MM/YYYY') : ''}</span> : <span></span>, conditionalCellStyles: [
                    {
                        when: row => row.NoPago == null,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',

                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'

                        },

                    },
                ]
            },

        ]
    //     return colRet
    // }, [])

    // Si el componente esta cargando lo mostramos
    if (Estado.Cargando && !Estado.Error)
        return (
            <div className="text-center">
                <Spinner />
                <br />
                <span>Obteniendo prestamos</span>
            </div>
        )

    // Regresamos un mensaje de error y la posibilidad de actualizar el componente
    else if (!Estado.Cargando && Estado.Error)
        return (
            <div className="text-center">
                <span>Ocurrio un error al obtener los creditos</span>
                <br />
                <button title='Actualizar' onClick={ConsultarDatos} className="btn btn-sm btn-confia text-white"><FiRefreshCcw /> </button>
            </div>
        )

    // Si no se tuvo un error al consultar los datos
    else if (!Estado.Cargando && !Estado.Error)
        return (
            <>
                <DataTable
                    subHeader
                    subHeaderComponent=
                    {
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="input-group mb-3">
                                    <button className="btn btn-outline-secondary" type="button"
                                        onClick={() => {
                                            definirEstado({ ...Estado, ShowCaja: true })
                                        }}
                                    >Nuevo <FaPlus /></button>
                                    <button title='Nuevo' className="btn btn-outline-secondary" type="button" onClick={() => ConsultarDatos()}><FiRefreshCcw /></button>
                                </div>
                            </div>
                        </div>
                    }
                    data={Estado.Creditos}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"CreditoID"}
                    columns={Columns()}
                />
                <ModalWin open={Estado.DetallePlan} zIndex={3000} xlarge scrollable>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            <strong><h4>{"Plan de Pagos"}</h4></strong>
                            {/* <strong>{DescripcionDistribuidor(1)}</strong>{`: ` + state.datosDist?.DistribuidorID + " - " + state.datosDist?.NombreCompleto} <br /> */}
                            {/* <strong>Cliente: </strong>{"" + state.datosCliente?.ClienteID + " - " + state.datosCliente?.NombreCompleto} <br /> */}
                            <strong>{"N° Crédito: "}</strong>
                            {Estado.CredID}
                        </h5>
                        <button title='Cerrar' type="button" className="delete" onClick={() => definirEstado({ ...Estado, DetallePlan: false })} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        <DataTable
                            data={Estado.DatosDetalle}
                            striped
                            noDataComponent="Sin plan de pagos."
                            dense
                            noHeader
                            responsive
                            keyField={"NoPago"}
                            defaultSortAsc={true}
                            defaultSortField={"NoPago"}
                            columns={DetailColumns}
                        />
                    </ModalWin.Body>
                </ModalWin>
                <ModalWin zIndex={4001} center open={Estado.Mostrar} large>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            {"Nuevo Prestamo Personal"}
                        </h5>
                        <button type="button" title='Cerrar' className="delete" onClick={() => definirEstado({ ...Estado, Mostrar: false })} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {Estado.Mostrar &&
                            <CreditoDistribuidor
                                ProductoID={props.ProductoID}
                                DistribuidorID={props.DatosConsulta.DistribuidorID}
                                SucursalId={Estado.SucursalId}
                                CajaID={Estado.CajaID}
                                optSucursales={Estado.optSucursales}
                                ProdPresPersonal={props.DatosConsulta.ProductoID}
                                fnCancelar={fnCancelar} />
                        }
                    </ModalWin.Body>
                </ModalWin>
                {Estado.ShowCaja &&
                    <ModalWin open={Estado.ShowCaja} large scrollable>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>
                                Selección de Caja
                            </h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                            {Estado.ShowCaja &&
                                <SeleccionarCajaSucursal
                                    optSucursales={Estado.optSucursales}
                                    initialValues={Estado.CajaDefault}
                                    cbAceptar={fnSetSucCaja}
                                />
                            }
                        </ModalWin.Body>
                    </ModalWin>
                }
            </>

        )

    return null
}

Prestamos.EColumnas = EColumnas

export default Prestamos