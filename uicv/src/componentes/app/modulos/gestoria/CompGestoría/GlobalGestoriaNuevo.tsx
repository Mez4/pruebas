import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { ActionSelect, Card, Spinner } from "../../../../global";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import moment from "moment";
import React, { useEffect, useState } from "react"; // Asegúrate de importar useState y useEffect
import * as Funciones from "./CreditoGlobal/Funciones";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import FiltroPorUsuario from "../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ReactTooltip from "react-tooltip";
import { FaBan, FaCheck, FaCircle, FaPrint } from "react-icons/fa";
import { FormateoDinero } from "../../../../../global/variables";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import XLSX from "xlsx";

// Definición de tipos
type CreditoCierreValesDistVencimientoType = {
    oidc: IOidc;
    ui: iUI;
};

function CreditoGlobalNuevoGestoria(
    props: CreditoCierreValesDistVencimientoType
) {
    const MySwal = withReactContent(Swal);
    let isMounted = React.useRef(true);
    const FechaCorte: Date | undefined = undefined;
    const Datos: any[] = [];
    const [state, setState] = useState({
        FechaCorte: FechaCorte,
        Cargando: false,
        Error: false,
        Datos,
        DatosExcel: [],

    });

    const [SaldoReal, setSaldoReal] = React.useState(0);

    const [showContent, setShowContent] = useState(false);

    const filtrar = (values: any) => {
        // setCargandoDatos(true);
        // clearFormByLevel(0);
        setState((s) => ({ ...s, keyTemp: Math.random() }));
        Funciones.FNgetbyfiltros(props.oidc, {
            ...values,
            DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
            ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID, //props.ui.Producto?.ProductoID ?? 1,
            ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
            SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
            ZonaID: !Number.isInteger(values.ZonaID) ? 0 : values.ZonaID,
            DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
            GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
            Tipo: 1,
        })
            .then((respuesta: any) => {
                console.log(respuesta, "resp fngetbyfiltros");
                // cbDirectores(respuesta, {
                //   ...values,
                //   DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
                //   ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
                //   ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
                //   SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
                //   ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
                //   DistribuidorID: isNaN(values.DistribuidorID)
                //     ? 0
                //     : values.DistribuidorID,
                //   GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
                //   // Tipo: 1
                // });
                // response();
                // setCargandoDatos(false);
            })
            .catch(() => {
                // cbDirectores([], values);
                toast.error("Error al consultar, vuelva a intentarlo");
            });
    };


    const FNGetUltimaActualizacion = () => {
        Funciones.FNGetFechaUltimaActualizacionGlobal(props.oidc)
            .then((respuesta: any) => {
                setState((s) => ({ ...s, FechaCorte: respuesta.Fecha_Global }));
            })
            .catch(() => {
                setState((s) => ({ ...s, FechaCorte: undefined }));
            });
    };


    const FNGetGlobal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetGlobal(props.oidc)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))
                if (isMounted.current === true) {
                    // Mapeamos los datos y agregamos nuevos campos al objeto
                    var Excelit = respuesta.map((valor: any) => ({
                         CoordinadorValeID: valor.CoordinadorID ?? "",
                                        ZonaVales: valor.empresaNombre ?? "",
                                        SucursalVale: valor.SucursalNombre?? "",
                                        catGrupos: valor.catGrupos ?? "",
                                        CoordinadorVale: valor.CoordinadorNombre ?? "",
                                        DistribuidorID: valor.DistribuidorID ?? "",
                                        NombreCom: valor.NombreSocia ?? "",
                                        LimiteCredito: valor.LC_Efectivo,
                                        limiteDeCreditoD: valor.LC_Efectivo ?? "",
                                        disponibleD: valor.LCD_Efectivo ?? "",
                                        CreditoDisponible: valor.CreditoDisponible ?? "",
                                        ZonaValesID: valor.ZonaID ?? 0,
                                        limiteDeCreditoCS: valor.LimiteDeCreditoCS ?? "",
                                        disponibleCS: valor.DisponibleCS ?? "",
                                        Nivel: valor.Nivel ?? "",
                                        SucursalValeID: valor.SucursalID ?? "",
                                        EstatusID: valor.EstatusID ?? "",
                                        FechaUltimoPago_1: valor.FHUltPago
                                          ? moment(valor.FHUltPago).format("DD/MM/YYYY")
                                          : "",
                                        OrigenIngresoID: valor.DistribuidorNivelOrigenID ?? "",
                                        limiteDeCreditoTDA: valor.LC_Tiendita ?? 0,
                                        disponibleTDA: valor.LCD_Tiendita ?? "",
                                        ventasTotalesTiendita: valor.TienditaCF ?? "",
                                        OrigenIngreso: valor.Origen ?? "",
                                        Contraseña: valor.Contraseña ?? "",
                                        "Vales Digitales": valor.ValesDigital ?? "",
                                        nivelSocieconomicoId: valor.nivelSocieconomicoId ?? "",
                                        color: valor.color ?? "",
                                        saldoEnRiesgoTDA: valor.saldoEnRiesgoTDA ?? "",
                                        TienditaAtr: valor.SaldoAtrasado_Tiendita ?? "",
                                        AnalistaID: valor.AnalistaID ?? "",
                                        NombreAnalista: valor.NombreAnalista ?? "",
                                        Foraneo: valor.Foraneo ?? "",
                                        Dia: valor.Dia ?? "",
                                        " ": "",
                                        saldoActualD: valor.SaldoActual ?? "",
                                        saldoActualCS: valor.SaldoActual_Tiendita ?? "",
                                        Cartera: valor.Cartera ?? "",
                                        SaldoPrestPer: valor.SaldoActual_PrePersonal ?? "",
                                        CredActivos: valor.NoCreditosActivos ?? "",
                                        NumPrestPer: valor.NoCreditosActivosPP ?? "",
                                        SaldoAtrasado: valor.SaldoAtrasado ?? "",
                                        SaldoAtrPrestPer: valor.SaldoAtrPrestPer ?? "",
                                        DiasAtraso: valor.DiasAtraso ?? "",
                                        PagosAtrasados: valor.PagosAtrasados ?? "",
                                        CreditosAtrasados: valor.CreditosAtrasados ?? "",
                                        Capital: respuesta.Capital ?? "",
                                        Interes: respuesta.Interes ?? "",
                                        Seguro: valor.Seguro ?? "",
                                        PorcColocacionLimite: valor.PorcColocacionLimite ?? "",
                                        FechaUltimoPago: valor.FHUltPago
                                          ? moment(valor.FHUltPago).format("DD/MM/YYYY")
                                          : "",
                                        FechaUltimoVale: valor.FHUltVale
                                          ? moment(valor.FHUltVale).format("DD/MM/YYYY")
                                          : "",
                                        CapitalLiquidado: valor.CapitalLiquidado ?? "",
                                        TabuladorComisionesID: valor.TabuladorComisionesID ?? "",
                                        CarteraEnRiesgo: valor.CarteraEnRiesgo ?? "",
                                        ExpedienteDigitalEstatus: valor.EXPEDIENTEDIG ?? "",
                                        GestorID: valor.GestorID ?? "",
                                        NombreGestor: valor.ResponsableNombre ?? "SIN GESTOR",
                                        ExpedienteID: valor.ExpedienteID ?? "",
                                        PromotorID: valor.PromotorID ?? "",
                                        EstatusCarteraID: valor.EstatusCarteraID ?? "",
                                        Convenio: valor.DistribuidoresEstatusID === "C" ? "TRUE" : "FALSE",
                                        Pendiente: valor.PENDIENTE ?? "",
                                        UltRelacionFecha: valor.UltimaRelacionFecha
                                          ? moment(valor.UltimaRelacionFecha).format("DD/MM/YYYY")
                                          : "",
                                        SaldoUltimoCorte: valor.UltRelacionImporte ?? "",
                                        FechaPrimerCanje: valor.FHPrimerVale
                                          ? moment(valor.FHPrimerVale).format("DD/MM/YYYY")
                                          : "",
                                        numAvales: valor.NumAvales ?? "",
                                        ContrasenaT: valor.ContrasenaT ?? "",
                                        lineaTipoDescripcionD: valor.lineaTipoDescripcionD ?? "",
                                        lineaTipoDescripcionCS: valor.lineaTipoDescripcionCS ?? "",
                                        saldoEnRiesgoD: valor.CarteraEnRiesgo ?? "",
                                        saldoEnRiesgoCS: valor.SaldoEnRiesgoCS ?? "",
                                        saldoAtrasadoD: valor.SaldoAtrasado ?? "",
                                        saldoAtrasadoCS: valor.SaldoAtrasadoCS ?? "",
                                        eslineaD: valor.eslineaD ?? "",
                                        eslineaCS: valor.eslineaCS ?? "",
                                        saldoActualCovid: valor.saldoActualCovid ?? "",
                                        saldoTotalCovid: valor.saldoTotalCovid ?? "",
                                        Recuperado: valor.Recuperado ?? "",
                                        UltRelacionImporte: valor.UltRelacionImporte ?? "",
                                        DiasDesdeUltPago: valor.DiasDesdeUltPago ?? "",
                                        Promotor: valor.NombrePromotor ?? "Migrada",
                                        DistribCondicionID: valor.DistribCondicionID ?? "",
                                        Condición: valor.Condición ?? "",
                                        UsuarioIncremLineaD: valor.UsuarioIncremLineaD ?? "",
                                        NombreAutorizaIncremLineaD:
                                        valor.NombreAutorizaIncremLineaD ?? "",
                                        TipoIncremLineaD: valor.TipoIncremLineaD ?? "",
                                        FHIncremLineaD: valor.FHIncremLineaD ?? "",
                                        IncrementoLineaD: valor.IncrementoLineaD ?? "",
                                        UsuarioIncremLineaCS: valor.UsuarioIncremLineaCS ?? "",
                                        NombreAutorizaIncremLineaCS:
                                        valor.NombreAutorizaIncremLineaCS ?? "",
                                        TipoIncremLineaCS: valor.TipoIncremLineaCS ?? "",
                                        FHIncremLineaCS: valor.FHIncremLineaCS ?? "",
                                        IncrementoLineaCS: valor.IncrementoLineaCS ?? "",
                                        SaldoActual: valor.SaldoActual ?? "",
                                        SalActConvenio: valor.SalActConvenio ?? "",
                                        SalAtrConvenio: valor.SalAtrConvenio ?? "",
                                        SalRieConvenio: valor.SalRieConvenio ?? "",
                                        Reestructura: valor.Reestructura ?? "",
                                        SalActReestructura: valor.SalActReestructura ?? "",
                                        SalAtrReestructura: valor.SalAtrReestructura ?? "",
                                        SalRieReestructura: valor.SalRieReestructura ?? "",
                                        "  ": "",
                                        Estatus: valor.DistribuidoresEstatus ?? "",
                                        PorcMora: valor.PorcMora ?? "",
                                        PorcCalidad: valor.Calidad ?? "",
                                        PesoxZona: valor.PesoxZona ?? "",
                                        PesoxSucursal: valor.PesoxSucursal ?? "",
                                        PesoxCoordi: valor.PesoxCoordi ?? "",

                    }));

                    setState((s) => ({
                        ...s,
                        Datos: respuesta, // Los datos originales
                        Cargando: false,
                        Error: false,
                        DatosExcel: Excelit, // Los datos transformados y con los nuevos campos
                    }));
                }
            })
            .catch(() => {
                setState((s) => ({
                    ...s,
                    Datos: [],
                    Cargando: false,
                    Error: true,
                }));
            });
    };


    const generarXLSX = async () => {
        const toastId = toast.warning("Excel Generándose...", { autoClose: false });
    
        await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms
    
        const XLSX = require("xlsx-js-style");
    
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
        const styleHeader = {
            font: {
                name: "Calibri",
                sz: 12,
                bold: true,
            },
            alignment: {
                horizontal: "center",
                vertical: "center",
            },
            fill: {
                fgColor: { rgb: "71d63e" },
            },
            wpx: 800,
        };
    
        const colWidths: { wch: number }[] = [];
    
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
            let maxLength = 0;
            for (let row = range.s.r; row <= range.e.r; row++) {
                const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                if (cell && cell.v) {
                    maxLength = Math.max(maxLength, cell.v.toString().length);
                }
            }
            colWidths.push({ wch: maxLength + 2 }); 
        }
    
        ws["!cols"] = colWidths;
    
        for (let i in ws) {
            if (typeof ws[i] != "object") continue;
            let cell = XLSX.utils.decode_cell(i);
    
            if (cell.r === 0) {
                ws[i].s = {
                    fill: {
                        patternType: "solid",
                        fgColor: { rgb: "9bbb58" },
                        bgColor: { rgb: "9bbb58" },
                    },
                    font: {
                        name: "Song Ti",
                        sz: 10,
                        bold: true,
                    },
                    border: {
                        bottom: {
                            style: "thin",
                            color: "FF000000",
                        },
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: "1",
                    },
                };
            } else {
                ws[i].s = {
                    font: {
                        name: "Song Ti",
                        sz: 10,
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: "1",
                    },
                    border: {
                        right: {
                            style: "thin",
                        },
                        left: {
                            style: "thin",
                        },
                        bottom: {
                            style: "thin",
                        },
                    },
                };
                if (cell.r % 2 === 0) {
                    ws[i].s.fill = {
                        patternType: "solid",
                        fgColor: { rgb: "EEEEEE" },
                        bgColor: { rgb: "EEEEEE" },
                    };
                }
            }
        }
    
        XLSX.writeFile(wb, "GlobalNuevo.xlsx");
    
        toast.dismiss(toastId);
    
        toast.success("Excel Generado con éxito", { autoClose: 5000 });
    };
        
            
    
    


    const Columns: GridColDef[] = [
        {
            headerName: "ProductoID",
            field: "ProductoID",
            sortable: true,
            headerAlign: "center",
            flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {row.value}
                </div>
            ),
        },
        {
            headerName: "Producto",
            field: "empresaNombre",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "DistribuidorID",
            field: "DistribuidorID",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "Distribuidor",
            field: "NombreSocia",
            sortable: true,
            headerAlign: "center",
            // flex: 2,

        },
        {
            headerName: "Estatus",
            field: "DistribuidoresEstatus",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "LCD Efectivo",
            field: "LCD_Efectivo",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {FormateoDinero.format(row.value)}
                </div>
            ),
        },
        {
            headerName: "LCD Tiendita",
            field: "LCD_Tiendita",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {FormateoDinero.format(row.value)}
                </div>
            ),
        },
        {
            headerName: "LCD P. Personal",
            field: "LCD_PrePersonal",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {FormateoDinero.format(row.value)}
                </div>
            ),
        },
        {
            headerName: "Productividad",
            field: "Productividad",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        }, {
            headerName: "Nivel",
            field: "Nivel",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        }, {
            headerName: "Origen",
            field: "Origen",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        }, {
            headerName: "SucursalNombre",
            field: "SucursalNombre",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "CoordinadorNombre",
            field: "CoordinadorNombre",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "SaldoActual",
            field: "SaldoActual",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {FormateoDinero.format(row.value)}
                </div>
            ),
        },
        {
            headerName: "SaldoAtrasado",
            field: "SaldoAtrasado",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {FormateoDinero.format(row.value)}
                </div>
            ),
        },
        {
            headerName: "SaldoPendCorte",
            field: "SaldoPendCorte",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {FormateoDinero.format(row.value)}
                </div>
            ),
        },
        {
            headerName: "DiasAtraso",
            field: "DiasAtraso",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "PagosAtrasados",
            field: "PagosAtrasados",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "Calidad",
            field: "Calidad",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "NoCreditosActivos",
            field: "NoCreditosActivos",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            // renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "FHUltPago",
            field: "FHUltPago",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "FHUltVale",
            field: "FHUltVale",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "FHPrimerVale",
            field: "FHPrimerVale",
            sortable: true,
            headerAlign: "center",
            cellClassName: "text-center",
            // flex: 2,
            renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
        },
        {
            headerName: "TFHUltVale",
            field: "TipoMovimiento",
            sortable: true,
            headerAlign: "center",
            // flex: 4,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {row.value}
                </div>
            ),
        },
        {
            headerName: "Gestor",
            field: "ResponsableNombre",
            sortable: true,
            headerAlign: "center",
            // flex: 3,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {row.value}
                </div>
            ),
        },
        {
            headerName: "Promotor",
            field: "NombrePromotor",
            sortable: true,
            headerAlign: "center",
            // flex: 3,
            renderCell: (row: any) => (
                <div
                    style={{ display: "flex", justifyContent: "center", width: "100%" }}
                >
                    {row.value}
                </div>
            ),
        },
    ];


    useEffect(() => {
        FNGetUltimaActualizacion();
        const showModal = async () => {
            const result = await MySwal.fire({
                title: "<strong>AVISO</strong>",
                icon: "warning",
                html: (
                    <div className="text-center">
                        Este reporte incluye cambios importantes y su información se actualizará cada 30 minutos, por lo que no se reflejarán pagos en tiempo real. Las horas de última actualización se mostrarán en la parte superior derecha.
                    </div>
                ),
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                showLoaderOnConfirm: true,
                focusConfirm: false,
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
                confirmButtonColor: `#3085d6`,
            });

            if (result.isConfirmed) {
                setShowContent(true);
            } else {
                setShowContent(false);
            }
        };

        showModal();
    }, []);

    if (!showContent) {
        return null;
    }

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card
                        Title=""
                        TitleEnd={
                            <>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>GLOBAL DE VALES GESTORIA </span>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            whiteSpace: "nowrap",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{ fontSize: "0.9rem", marginRight: "1rem", color: 'black' }}>
                                            Fecha/Hora Última Actualización:{" "}
                                            {!!state.FechaCorte
                                                ? moment(state.FechaCorte).utc().format("DD-MM-YYYY HH:mm:ss A")
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </>
                        }
                    >
                        <Card.Body>
                            <Card.Body.Content>
                                <Formik
                                    initialValues={state.Datos}
                                    enableReinitialize
                                    onSubmit={(values: any) => { }}
                                >
                                    <Form>
                                        <div
                                            className="column is-full-desktop is-full-mobile is-full-tablet"
                                            style={{
                                                backgroundColor: "#F7F7F7",
                                                padding: "1em",
                                                borderRadius: "15px",
                                            }}
                                        >
                                            {/* <div className="row">
                                                <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center mt-4">
                                                    <h3>
                                                        Total de la cuenta: {FormateoDinero.format(SaldoReal)}{" "}
                                                    </h3>
                                                </div>
                                            </div> */}
                                            <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                                                <div className="text-end">
                                                    {
                                                        <button
                                                            disabled={state.Datos.length > 0 ? false : true}
                                                            type={"button"}
                                                            className={
                                                                "btn btn-success waves-effect waves-light"
                                                            }
                                                            onClick={() => {
                                                                generarXLSX();
                                                            }}
                                                        >
                                                            <span>Excel</span>&nbsp;
                                                            <FaPrint />
                                                        </button>
                                                    }
                                                </div>
                                            </div>

                                            <div className="text-end">
                                                {
                                                    <button
                                                        disabled={true ? false : true}
                                                        type={"button"}
                                                        className={
                                                            "btn btn-primary waves-effect waves-light"
                                                        }
                                                        onClick={() => {
                                                            FNGetGlobal();
                                                        }}
                                                    >
                                                        <span>Generar</span>&nbsp;
                                                        <FaCheck />
                                                    </button>
                                                }

                                            </div>
                                        </div>
                                    </Form>
                                </Formik>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error && (
                                    <div className="mt-3">
                                        <DataGrid
                                            columns={Columns}
                                            density="compact"
                                            rows={state.Datos}
                                            getRowId={(row) => row.DistribuidorID}
                                            // disableColumnFilter
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { pageSize: 10, page: 0 },
                                                },
                                            }}
                                            pageSizeOptions={[10, 20, 30]}
                                        ></DataGrid>
                                    </div>
                                )}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreditoGlobalNuevoGestoria);
