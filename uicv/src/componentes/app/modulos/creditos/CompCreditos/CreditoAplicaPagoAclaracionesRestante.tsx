import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import { Distribuidores, SeleccionarCajaSucursal } from "../../../../selectores";
import * as Funciones from "./CreditoAplicaPagoAclaracionesRestante/Funciones";
import * as FnCreditos from "./CreditoCredito/Funciones";
import * as FnGlobal from "./CreditoGlobal/Funciones";
import * as FnClientes from '../../distribuidor/CompDistribuidor/Cliente/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaEye } from "react-icons/fa";

import moment from "moment";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CreditoAplicaPagoAclaracionesRestante/CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FaMoneyBillWave, FaMoneyBill } from "react-icons/fa";

import ReactTooltip from "react-tooltip";

import { truncateDecimals, addOneDay, addTenDay } from "../../../../../global/functions";
import { FiltrarDatos } from "../../../../../global/functions";
import { Clientes, Sucursales } from "../../../../selectores";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import { iUI } from "../../../../../interfaces/ui/iUI";

type CatalogosType = {
    oidc: IOidc;
    iUI: iUI;
};

const CreditoAplicaPagoAclaracionesRestante = (props: CatalogosType) => {
    let isMounted = React.useRef(true);
    const DatosDefecto = {
        ProductoID: 0,
        ZonaID: 0,
        DistribuidorNivelID: 0,
        DistribuidorID: 0,
        EstatusID: "A",
        ContratoID: 0,
        CoordinadorID: 0,
        EmpresaId: 0,
        SucursalID: 0,
        // CajaID: 0,
        ClienteID: 0,
        FechaInicio: null,
        FechaFin: null,
        CreditoID: 0,
        NombreCompleto: "",
        Capital: 0,
        Interes: 0,
        ManejoCuenta: 0,
        Seguro: 0,
        Cargo: 0,
        IVA: 0,
        ImporteTotal: 0,
        Abonos: 0,
        SaldoActual: 0,
        SaldoAtrasado: 0,
        DiasAtraso: 0,
    };
    const CFDatos = {
        SucursalId: 0,
        CuentaBancoID: 0,
        CajaID: 0,
        ClienteID: 0,
        NombreCompleto: "",
        ImporteTotal: 0,
        SaldoActual: 0,
        Interes: 0,
        Porc_Int: 0,
        A_Condonar: 0,
        A_Pagar: 0,
        Liquida: false,
        Comision: false,
        DistribuidorID: 0,
        Distribuidor: ""
    };
    const Datos: any[] = [];
    const DatosMostrar: any[] = [];
    const DatosDetalle: any[] = [];
    const optSucursales: any[] = [];
    const CajaDefault = {
        ProductoID: 0,
        SucursalID: 0,
        CajaID: 0,
    };
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: "",
        Cargando: false,
        Error: false,
        CredID: 0,
        DetallePlan: false,
        DatosDetalle,
        // Form:
        // {
        //     Mostrar: false,
        //     Datos: DatosDefecto,
        //     Id: undefined
        // },
        loading: false,
        Mostrar: false,
        CFDatos,
        optSucursales,
        ShowCaja: true,
        CajaDefault,
        DistribuidorID: 0
    });
    const [loading, setLoading] = React.useState(false);
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    const fnGetSucursalesCaja = () => {
        FnCajas.FNGetCuentas(props.oidc)
            .then((respuesta: any) => {
                // console.log('respuesta: ', respuesta)

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.CuentaBancoID, label: valor.NumeroCuenta };
                    return obj;
                });

                setState((s) => ({ ...s, optSucursales: sucursales }));
            })
            .catch(() => {
                setState((s) => ({ ...s, optSucursales: [] }));
            });
    };

    const fnSetSucCaja = (Data: any) => {
        setState((s) => ({
            ...s,
            CFDatos: {
                ...state.CFDatos,
                SucursalId: Data.SucursalID,
                CajaID: Data.CajaID,
            },
            ShowCaja: false,
        }));
    };

    const FNGetDetalle = (CreditoID: number) => {
        FnGlobal.FNGetPlanPagos(props.oidc, CreditoID)
            .then((respuesta: any) => {
                if (respuesta.length > 0) {
                    // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
                    let tabla: any[] = [];
                    let ImporteTotal = 0;
                    let Abonos = 0;
                    let SaldoActual = 0;
                    let Comision = 0;

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
                        };

                        ImporteTotal += element.ImporteTotal;
                        SaldoActual += element.SaldoActual;
                        Abonos += element.Abonos;
                        Comision += element.Comision;

                        tabla.push(PlanPagos);
                    });

                    let TotalPlanPagos: any = {
                        NoPago: null,
                        FechaVencimiento: "",
                        ImporteTotal,
                        Abonos,
                        SaldoActual,
                        Comision,
                        FechaLiquidacion: "",
                        DiasAtraso: 0,
                    };

                    tabla.push(TotalPlanPagos);

                    // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

                    setState((s) => ({
                        ...s,
                        DetallePlan: true,
                        DatosDetalle: tabla,
                        CredID: CreditoID,
                    }));
                } else {
                    setState((s) => ({
                        ...s,
                        DetallePlan: true,
                        DatosDetalle: [],
                        CredID: CreditoID,
                    }));
                }

                // console.log(respuesta, "respPLANPAGOS")
                // console.log(CreditoID)
                // let creditos = state.DatosDetalle.find(Dato => Dato.CreditoID === CreditoID)
                // setState(s => ({ ...s, datosPagos: creditos, CredID: CreditoID }))
                // if (isMounted.current === true) {
                // setState(s => ({ ...s, DetallePlan: true, DatosDetalle: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState((s) => ({ ...s, DetallePlan: false, DatosDetalle: [] }));
                toast.error("Error al consultar, vuelva a intentarlo");
                // }
            });
    };

    const FNGCreditosCliente = (ClienteID: number) => {
        setState((s) => ({ ...s, Cargando: true }));

        FnClientes.FNGetbyId(props.oidc, { ClienteID, ProductoID: 0 })
            .then((respuesta: any) => {
                setState((s) => ({ ...s, DistribuidorID: respuesta.DistribuidorID }));
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState((s) => ({ ...s, DistribuidorID: 0 }));
                // }
            });

        FnGlobal.FNGCreditosCliente(props.oidc, 0, ClienteID, 0, true)
            .then((respuesta: any) => {
                // console.log("respCreditos: ", respuesta)

                if (respuesta.length > 0) {
                    // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
                    let tabla: any[] = [];
                    let Capital = 0;
                    let ImporteTotal = 0;
                    let Abonos = 0;
                    let Interes = 0;
                    let SaldoActual = 0;
                    let SaldoAtrasado = 0;
                    let Seguro = 0;

                    respuesta.forEach((element: any) => {
                        // posicion = posicion + 1
                        //if (cajaAnteriorID == 0) {
                        let Creditos: any = {
                            CreditoID: element.CreditoID,
                            Capital: element.Capital,
                            ImporteTotal: element.ImporteTotal,
                            Abonos: element.Abonos,
                            SaldoActual: element.SaldoActual,
                            SaldoAtrasado: element.SaldoAtrasado,
                            DiasAtraso: element.DiasAtraso,
                            FechaHoraRegistro: element.FechaHoraRegistro,
                            EstatusID: element.EstatusID,
                            EstatusNombre: element.EstatusNombre,
                            MovimientoID: element.MovimientoID,
                            Interes: element.Interes,
                            Seguro: element.Seguro,
                            Color: element.Color,
                        };

                        if (element.EstatusID == "A" || element.EstatusID == "L") {
                            Capital += element.Capital;
                            ImporteTotal += element.ImporteTotal;
                            Interes += element.Interes;
                            SaldoActual += element.SaldoActual;
                            SaldoAtrasado += element.SaldoAtrasado;
                            Seguro += element.Seguro;
                            Abonos += element.Abonos;
                        }

                        tabla.push(Creditos);
                    });

                    let TotalCreditos: any = {
                        CreditoID: null,
                        Capital,
                        ImporteTotal,
                        Abonos,
                        SaldoActual,
                        SaldoAtrasado,
                        DiasAtraso: 0,
                        FechaHoraRegistro: "",
                        EstatusID: "",
                        EstatusNombre: "",
                        MovimientoID: 0,
                        Interes,
                        Seguro,
                        Color: "",
                    };

                    tabla.push(TotalCreditos);

                    setState((s) => ({ ...s, Datos: tabla, Cargando: false }));
                } else {
                    setState((s) => ({ ...s, Datos: [], Cargando: false }));
                }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState((s) => ({ ...s, Datos: [], Cargando: false }));
                toast.error("Error al obtener los creditos del cliente");
                // }
            });


    };

    //     const fnRefresca = (Data: any) => {

    //         let Datos = {
    //             ProductoID: 0,
    //             ClienteID: Data.ClienteID,
    //             SucursalID: 0,
    //             ZonaID: 0,
    //             EmpresaId: 0,
    //             DistribuidorID: 0,
    //             CoordinadorID: 0,
    //             ContratoID: 0,
    //             EstatusID: '',
    //             DistribuidorNivelID: 0,
    //             CajaID: 0,
    //             FechaInicio: null,
    //             FechaFin: null
    //         }

    //         console.log('fnRefresca Datos: ', Datos)

    //         FnCreditos.FNgetbyfiltros(props.oidc, Datos)
    //             .then((respuesta: any) => {
    //                 setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
    //                 setLoading(false)
    //             })
    //             .catch(() => {
    //                 setLoading(false)
    //                 toast.error("Error al consultar, vuelva a intentarlo")
    //             })
    // }

    const cbActualizaDatos = (
        SucursalId: number,
        ClienteID: number,
        Liquida: boolean
    ) => {
        // console.log('ClienteID: ', ClienteID)

        if (ClienteID > 0) {
            Funciones.FNGetSaldos(props.oidc, { ClienteID: ClienteID })
                .then((respuesta: any) => {
                    console.log('respuestaGETSALDOS: ', respuesta);
                    setState({
                        ...state,
                        Mostrar: true,
                        CFDatos: {
                            ...state.CFDatos,
                            // SucursalId,
                            ClienteID: respuesta.ClienteID,
                            NombreCompleto: respuesta.NombreCompleto,
                            ImporteTotal: truncateDecimals(respuesta.ImporteTotal, 2),
                            SaldoActual: truncateDecimals(respuesta.SaldoActual, 2),
                            Interes: truncateDecimals(respuesta.Interes, 2),
                            Porc_Int: truncateDecimals(respuesta.Porc_Int * 100, 2),
                            A_Condonar: Liquida
                                ? truncateDecimals(respuesta.A_Condonar, 2)
                                : 0,
                            A_Pagar: Liquida ? truncateDecimals(respuesta.A_Pagar, 2) : 0,
                            Liquida,
                            Comision: false,
                            DistribuidorID: respuesta.DistribuidorID,
                            Distribuidor: respuesta.Distribuidor
                        },
                    });
                })
                .catch((error: any) => {
                    console.log(JSON.stringify(error));
                    setLoading(false);
                    toast.error("Error al recuperar el saldo, intentelo nuevamente");
                });
        } else {
            toast.error("Seleccione un cliente primeramente.");
            setLoading(false);
        }
    };

    const fnCancelar = () => {
        setLoading(false);
        setState((s) => ({
            ...s,
            CFDatos: {
                ...state.CFDatos,
                ClienteID: 0,
                NombreCompleto: "",
                ImporteTotal: 0,
                SaldoActual: 0,
                Interes: 0,
                Porc_Int: 0,
                A_Condonar: 0,
                A_Pagar: 0,
                Liquida: false,
                Comision: false,
            },
            Mostrar: false,
            loading: false,
        }));
    };

    const Columns: //= React.useMemo(() => {
        //let colRet:
        IDataTableColumn[] = [
            {
                name: "Crédito",
      /*width: '95px',*/ selector: "CreditoID",
                sortable: false,
                cell: (props) =>
                    props.CreditoID != null ? (
                        <span
                            style={{ width: "95px", whiteSpace: "nowrap", overflow: "hidden" }}
                        >
                            {props.CreditoID}
                        </span>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            // { name: 'Id Cliente', selector: 'ClienteID', sortable: true, },
            // {
            //     name: 'Nombre Cliente', width: '250px', selector: 'NombreCompleto', sortable: true,
            //     cell: (props) =>
            //         <>
            //             <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
            //             <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
            //                 type="dark"
            //                 effect="solid"
            //                 clickable
            //                 globalEventOff="click"
            //             >
            //                 {props.NombreCompleto}
            //             </ReactTooltip>
            //         </>
            // },
            {
                name: "Capital",
                selector: "Capital",
                sortable: false,
                format: (row) => formatter.format(row.Capital),
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            // {
            //     name: 'Interes', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes), conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            // {
            //     name: 'MC', selector: 'ManejoCuenta', sortable: true, format: row => formatter.format(row.ManejoCuenta), conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            // {
            //     name: 'Seguro', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro), conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            // {
            //     name: 'Cargo', selector: 'Cargo', sortable: true, format: row => formatter.format(row.Cargo), conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            // {
            //     name: 'IVA', selector: 'IVA', sortable: true, format: row => formatter.format(row.IVA), conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            {
                name: "Importe",
                selector: "ImporteTotal",
                sortable: false,
                format: (row) => formatter.format(row.ImporteTotal),
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Abonos",
                selector: "Abonos",
                sortable: false,
                format: (row) => formatter.format(row.Abonos),
                style: {
                    fontWeight: "bold",
                },
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Saldo",
                selector: "SaldoActual",
                sortable: false,
                format: (row) => formatter.format(row.SaldoActual),
                style: {
                    fontWeight: "bold",
                },
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Atrasado",
      /*width: '80px',*/ selector: "SaldoAtrasado",
                sortable: false,
                format: (row) => formatter.format(row.SaldoAtrasado),
                conditionalCellStyles: [
                    {
                        when: (row) => row.SaldoAtrasado > 0,
                        style: {
                            color: "red",
                        },
                    },
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",
                            color: "red",
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Días Atr",
      /*width: '60px',*/ selector: "DiasAtraso",
                sortable: false,
                cell: (props) =>
                    props.CreditoID != null ? (
                        <span>{props.DiasAtraso}</span>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.DiasAtraso > 0,
                        style: {
                            color: "red",
                        },
                    },
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",
                            color: "red",
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Fecha Registro",
      /*width: '110px',*/ selector: "FechaHoraRegistro",
                sortable: false,
                cell: (props) =>
                    props.CreditoID != null ? (
                        <span>{moment(props.FechaHoraRegistro).format("DD/MM/YYYY")}</span>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            // {
            //     name: 'Vale', selector: 'ValeCanje', sortable: true, conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            {
                name: "Estatus", //width: '150px',
                selector: "EstatusID",
                sortable: false,
                center: true,
                // cell: (props) => <span>{props.EstatusID}</span>,
                cell: (props) =>
                    props.CreditoID != null ? (
                        <>
                            <span data-tip data-for={`CreditoEsttTooltip${props.CreditoID}`}>
                                <FaCircle color={props.Color} title={props.color} />
                            </span>
                            <ReactTooltip
                                id={`CreditoEsttTooltip${props.CreditoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                {props.EstatusNombre}
                            </ReactTooltip>
                        </>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            // {
            //     name: 'Desembolsado', selector: 'MovimientoID', sortable: false, cell: (props) => props.CreditoID != null ? <span>{props.MovimientoID ? "SI" : "No"}</span> : <span></span>, conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == null,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            // {
            //     name: 'Movimiento', selector: 'MovimientoID', sortable: true, conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            // {
            //     name: 'Id Venta', selector: 'VentaId', sortable: true, conditionalCellStyles: [
            //         {
            //             when: row => row.CreditoID == 0,
            //             style: {
            //                 textAlign: 'center',
            //                 borderTop: '1px solid black',

            //                 backgroundColor: '#f0f0f0',
            //                 fontWeight: 'bold'

            //             },

            //         },
            //     ]
            // },
            {
                name: "Plan Pagos",
                sortable: false,
                center: true,
                wrap: true,
                // width: '150px',
                cell: (data) =>
                    data.CreditoID != null ? (
                        <div
                            style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
                        >
                            <button
                                title="Detalle"
                                data-tip
                                data-for={`DetallePagoTooltip${data.CreditoID}`}
                                className="asstext"
                                style={{
                                    margin: ".15em",
                                    width: "15%",
                                    height: "40px",
                                    padding: "0px",
                                    tableLayout: "fixed",
                                    borderCollapse: "collapse",
                                }}
                                type="button"
                                onClick={() => {
                                    FNGetDetalle(data.CreditoID);
                                }}
                            >
                                <FaEye />
                            </button>
                            <ReactTooltip
                                id={`DetallePagoTooltip${data.CreditoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Ver Plan de Pagos
                            </ReactTooltip>
                        </div>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.CreditoID == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
                // FNGCreditosCliente
            },
        ];
    //     return colRet
    // }, [])

    const DetailColumns: //= React.useMemo(() => {
        //let colRet:
        IDataTableColumn[] = [
            // { name: '# Pago', width: '95px', selector: 'CreditoID', sortable: true, },
            {
                name: "# Pago",
                width: "95px",
                selector: "NoPago",
                sortable: false,
                cell: (props) =>
                    props.NoPago != null ? (
                        <span
                            style={{ width: "95px", whiteSpace: "nowrap", overflow: "hidden" }}
                        >
                            {props.NoPago}
                        </span>
                    ) : (
                        <span>TOTAL</span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Importe",
                width: "150px",
                selector: "ImporteTotal",
                sortable: false,
                format: (row) => formatter.format(row.ImporteTotal),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Abono",
                width: "150px",
                selector: "Abonos",
                sortable: false,
                format: (row) => formatter.format(row.Abonos),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Saldo",
                width: "150px",
                selector: "SaldoActual",
                sortable: false,
                format: (row) => formatter.format(row.SaldoActual),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Comisión",
                width: "150px",
                selector: "Comision",
                sortable: false,
                format: (row) => formatter.format(row.Comision),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Vencimiento",
                width: "150px",
                selector: "FechaVencimiento",
                sortable: false,
                cell: (props) =>
                    props.NoPago != null ? (
                        <span>{moment(addTenDay(new Date(props.FechaVencimiento))).format("DD/MM/YYYY")}</span>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Días Atr",
                width: "95px",
                selector: "DiasAtraso",
                sortable: false,
                cell: (props) =>
                    props.NoPago != null ? <span>{props.DiasAtraso}</span> : <span></span>,
                conditionalCellStyles: [
                    {
                        when: (row) => row.DiasAtraso > 0,
                        style: {
                            color: "red",
                        },
                    },
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
            {
                name: "Fch Liq",
                width: "150px",
                selector: "FechaLiquidacion",
                sortable: false,
                cell: (props) =>
                    props.NoPago != null ? (
                        <span>
                            {props.FechaLiquidacion
                                ? moment(addOneDay(new Date(props.FechaLiquidacion))).format("DD/MM/YYYY")
                                : ""}
                        </span>
                    ) : (
                        <span></span>
                    ),
                conditionalCellStyles: [
                    {
                        when: (row) => row.NoPago == null,
                        style: {
                            textAlign: "center",
                            borderTop: "1px solid black",

                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    },
                ],
            },
        ];
    //     return colRet
    // }, [])

    // const Columns = React.useMemo(() => {
    //     let colRet: IDataTableColumn[] =
    //         [

    //             { name: 'N° Crédito', selector: 'CreditoID', sortable: true, },
    //             { name: 'Id Cliente', selector: 'ClienteID', sortable: true, },
    //             { name: 'Nombre Cliente', selector: 'NombreCompleto', sortable: true, },
    //             // {
    //             //     name: 'Nombre Cliente', width: '250px', selector: 'NombreCompleto', sortable: true,
    //             //     cell: (props) =>
    //             //         <>
    //             //             <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
    //             //             <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
    //             //                 type="dark"
    //             //                 effect="solid"
    //             //                 clickable
    //             //                 globalEventOff="click"
    //             //             >
    //             //                 {props.NombreCompleto}
    //             //             </ReactTooltip>
    //             //         </>
    //             // },
    //             { name: 'Capital', selector: 'Capital', sortable: true, format: row => formatter.format(row.Capital) },
    //             { name: 'Interes', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes) },
    //             { name: 'MC', selector: 'ManejoCuenta', sortable: true, format: row => formatter.format(row.ManejoCuenta) },
    //             { name: 'Seguro', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro) },
    //             { name: 'Cargo', selector: 'Cargo', sortable: true, format: row => formatter.format(row.Cargo) },
    //             { name: 'IVA', selector: 'IVA', sortable: true, format: row => formatter.format(row.IVA) },
    //             { name: 'Total', selector: 'ImporteTotal', sortable: true, format: row => formatter.format(row.ImporteTotal) },
    //             {
    //                 name: 'Abonos', selector: 'Abonos', sortable: true, format: row => formatter.format(row.Abonos), style: {
    //                     fontWeight: 'bold',
    //                 }
    //             },
    //             {
    //                 name: 'Saldo', selector: 'SaldoActual', sortable: true, format: row => formatter.format(row.SaldoActual), style: {
    //                     fontWeight: 'bold',
    //                 }
    //             },
    //             {
    //                 name: 'Atrasado', selector: 'SaldoAtrasado', sortable: true, format: row => formatter.format(row.SaldoAtrasado), conditionalCellStyles: [
    //                     {
    //                         when: row => row.SaldoAtrasado > 0,
    //                         style: {
    //                             color: 'red',
    //                         }
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true, conditionalCellStyles: [
    //                     {
    //                         when: row => row.DiasAtraso > 0,
    //                         style: {
    //                             color: 'red',
    //                         }
    //                     }
    //                 ]
    //             }
    //         ]
    //     return colRet
    // }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            fnGetSucursalesCaja();
        }

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setState((s) => ({
            ...s,
            DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
        }));
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro]);

    return (
        <Card Title="Pagos Aclaraciones">
            <Card.Body>
                <Card.Body.Content>
                    {/* {state.Cargando && <Spinner />} */}
                    {state.Error && <span>Error al cargar los datos...</span>}
                    {!state.Error && (
                        <div>
                            <Formik
                                initialValues={state.CFDatos}
                                // enableReinitialize
                                validationSchema={Yup.object().shape({
                                    ClienteID: Yup.number()
                                        .required("Seleccione el cliente")
                                        .moreThan(0, "Seleccione el cliente"),
                                })}
                                onSubmit={(values: any) => {
                                    setLoading(true);
                                    console.log("values: ", values);
                                    FnCreditos.FNgetbyfiltros(props.oidc, values)
                                        .then((respuesta: any) => {
                                            setState((s) => ({
                                                ...s,
                                                Cargando: false,
                                                Error: false,
                                                Datos: respuesta,
                                            }));
                                            setLoading(false);
                                        })
                                        .catch(() => {
                                            setLoading(false);
                                            toast.error("Error al consultar, vuelva a intentarlo");
                                        });
                                }}
                            >
                                {({ values }) => (
                                    <Form>
                                        <div
                                            style={{
                                                backgroundColor: "#F7F7F7",
                                                padding: "1em",
                                                borderRadius: "15px",
                                            }}
                                        >
                                            <div className="columns is-desktop is-tablet">
                                                {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                                    <Sucursales disabled={loading} ProductoID={props.iUI.Producto?.ProductoID} name={'SucursalID'} valor={values.SucursalID} />
                                                </div> */}
                                                <div className="column is-12-mobile is-12-tablet is-4-desktop">
                                                    <Clientes
                                                        disabled={loading}
                                                        DistribuidorID={0}
                                                        name={"ClienteID"}
                                                        cbCliente={FNGCreditosCliente}
                                                    />
                                                </div>
                                                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                                    <Distribuidores
                                                        disabled
                                                        SucursalID={0}
                                                        GrupoID={0}
                                                        name={'DistribuidorID'}
                                                        valor={state.DistribuidorID}
                                                    />
                                                </div>
                                                <div className="column is-12-mobile is-12-tablet is-2-desktop">
                                                    <br />
                                                    <button
                                                        type="button"
                                                        disabled={loading}
                                                        className="ms-2 btn btn-primary waves-effect waves-light"
                                                        onClick={() => {
                                                            setLoading(true);
                                                            cbActualizaDatos(
                                                                values.SucursalId,
                                                                values.ClienteID,
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <span>Abonar</span>&nbsp;
                                                        <FaMoneyBillWave />
                                                    </button>
                                                </div>
                                                {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                                    <br />
                                                    <button
                                                        type="button"
                                                        disabled={loading}
                                                        className="ms-2 btn btn-primary waves-effect waves-light"
                                                        onClick={() => {
                                                            setLoading(true);
                                                            cbActualizaDatos(
                                                                values.SucursalId,
                                                                values.ClienteID,
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <span>Pagar </span>&nbsp;
                                                        <FaMoneyBill />
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            <br />
                            {state.Cargando && <Spinner />}
                            {!state.Cargando && (
                                <DataTable
                                    data={state.DatosMostrar}
                                    striped
                                    // pagination
                                    noDataComponent="Cliente no cuenta con Créditos."
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"CreditoID"}
                                    defaultSortAsc={true}
                                    defaultSortField={"CreditoID"}
                                    // selectableRowSelected={(row: any) => row.CreditoID > 0 ? true : false}
                                    // defaultSortField={"CreditoID"}
                                    columns={Columns}
                                // expandableRows
                                // // expandOnRowClicked
                                // onRowExpandToggled={(res: any) => {
                                //     HiddenData3(res)
                                // }}
                                // expandableRowDisabled={(row: any) => row.CreditoID == null ? true : false}
                                // expandableRowsComponent={<HiddenData3 />}
                                // actions={actionsMemo}
                                />
                            )}
                            {/* <DataTable
                                subHeader
                                data={state.DatosMostrar}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"CreditoID"}
                                defaultSortField={"CreditoID"}
                                columns={Columns}
                            /> */}
                            <ModalWin
                                open={state.DetallePlan}
                                zIndex={3000}
                                xlarge
                                scrollable
                            >
                                <ModalWin.Header>
                                    <h5 className={MODAL_TITLE_CLASS}>
                                        <strong>
                                            <h4>{"Plan de Pagos"}</h4>
                                        </strong>
                                        {/* <strong>{DescripcionDistribuidor(1)}</strong>{`: ` + state.datosDist?.DistribuidorID + " - " + state.datosDist?.NombreCompleto} <br />
                                        <strong>Cliente: </strong>{"" + state.datosCliente?.ClienteID + " - " + state.datosCliente?.NombreCompleto} <br />
                                        */}
                                        <strong>{"N° Crédito: "}</strong>
                                        {state.CredID}
                                    </h5>
                                    <button
                                        title="Cerrar"
                                        type="button"
                                        className="delete"
                                        onClick={() => setState({ ...state, DetallePlan: false, DatosDetalle: [] })}
                                    />
                                </ModalWin.Header>
                                <ModalWin.Body>
                                    <DataTable
                                        data={state.DatosDetalle}
                                        striped
                                        noDataComponent="Sin plan de pagos."
                                        // pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"NoPago"}
                                        defaultSortAsc={true}
                                        defaultSortField={"NoPago"}
                                        columns={DetailColumns}
                                    // expandableRows
                                    // expandOnRowClicked
                                    // onRowExpandToggled={(res: any) => {
                                    //     HiddenData(res)
                                    // }}
                                    // expandableRowsComponent={<HiddenData/>}
                                    />
                                </ModalWin.Body>
                            </ModalWin>

                            <ModalWin open={state.Mostrar}>
                                <ModalWin.Header>
                                    <h5 className={MODAL_TITLE_CLASS}>{"Pronto Pago"}</h5>
                                </ModalWin.Header>
                                <ModalWin.Body>
                                    {state.Mostrar && (
                                        <CForm
                                            oidc={props.oidc}
                                            ProductoID={props.iUI.Producto?.ProductoID as number}
                                            initialValues={state.CFDatos}
                                            optSucursales={state.optSucursales}
                                            fnCancelar={fnCancelar}
                                            fnRefresca={FNGCreditosCliente}
                                            cbActualizaDatos={cbActualizaDatos}
                                        />
                                    )}
                                </ModalWin.Body>
                            </ModalWin>

                            {/* {
                                state.ShowCaja && (
                                    <ModalWin open={state.ShowCaja} large scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Selección de Caja</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowCaja && (
                                                <SeleccionarCajaSucursal
                                                    optSucursales={state.optSucursales}
                                                    initialValues={state.CajaDefault}
                                                    cbAceptar={fnSetSucCaja}
                                                />
                                            )}
                                        </ModalWin.Body>
                                    </ModalWin>
                                )
                            } */}
                        </div >
                    )}
                </Card.Body.Content >
            </Card.Body >
        </Card >
    );
};

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    iUI: state.UI,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreditoAplicaPagoAclaracionesRestante);
