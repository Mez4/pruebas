//
import React, { useEffect, useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { FormateoDinero } from '../../../../../global/variables';
import * as Funciones from './CreditoColocacion/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan, FaDollarSign, FaSearch, FaRegChartBar, FaBarcode, FaBars, FaChartBar, FaLevelDownAlt, FaLevelUpAlt } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer, CustomSelect, CustomSelect2 } from '../../../../global'
import moment from 'moment'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { BuscarCreditoColocaciondvs } from './CreditoReporteActivaciones/BuscarCreditoColocaciondvs'
import { date, string } from 'yup'
import DatePicker, { registerLocale } from "react-datepicker"
import es from 'date-fns/locale/es'
import { FaFileExcel, FaCashRegister, FaListAlt } from 'react-icons/fa'
import XLSX from 'xlsx';
import { permisoExportar } from '../../../../hooks/ExoportarExcelBtnPermisos'



registerLocale("es", es)
type EstadoTipo = {
    FechaInicio: Date;
    FechaFin: Date;
};

type CatalogosType = {
    oidc: IOidc,
    ui: iUI
    DatosExcel: any[]

    // DATA-TABLE CACHE
    defaultSortField: string
    defaultSortAsc: boolean
    paginationDefaultPage: number
}

const CreditoReporteActivaciones = (props: CatalogosType) => {    // Controll our mounted state
    const ExpPermisos = permisoExportar(0); 
    let isMounted = React.useRef(false)
    const [loading, setLoading] = React.useState(false)
    const Datos: any[] = []
    const DatosCopia: any[] = []
    const Datos2: any[] = []
    const Datos3: any[] = []
    const DatosMostrar: any[] = []
    const OptionsUsuario: any[] = []
    const optDia: any[] = []
    const FiltroSucursal: number = 0
    let Filtrando: any



    //SE AGREGA ESTA NUEVA PARTE PARA FILTRADO POR SUCURSAL//////////////////////////////////////////////
    // const SucursalesTable = ({ sucursales }) => {
    //   const [filtroNombre, setFiltroNombre] = useState('');
    //   const [sucursalesFiltradas, setSucursalesFiltradas] = useState([]);

    //   useEffect(() => {
    //     // Cuando cambia el filtroNombre, actualiza las sucursales filtradas
    //     if (filtroNombre.trim() === '') {
    //       setSucursalesFiltradas(sucursales); // Si el filtro está vacío, muestra todas las sucursales
    //     } else {
    //       const filteredSucursales = sucursales.filter(sucursal =>
    //         sucursal.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    //       );
    //       setSucursalesFiltradas(filteredSucursales);
    //     }
    //   }, [filtroNombre, sucursales]);

    //   const handleChangeFiltro = (event) => {
    //     setFiltroNombre(event.target.value);
    //   };
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    let fechaActual = moment();

    // Calcular la fecha de inicio (7 días antes de la fecha actual)
    let fechaInicio = fechaActual.clone().subtract(7, 'days').format('YYYY-MM-DD');

    // Formato de fecha fin (fecha actual)
    let fechaFin = fechaActual.format('YYYY-MM-DD');
    const [state, setState] = React.useState({
        DatosExcel: [],
        Filtrando: 0,
        DistribuidorID: 0,
        DatosCopia,
        Datos,
        Datos2,
        Datos3,
        DatosMostrar,
        TipoEstatus: [],
        DatosInc: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        Form: {
            src: '',
            Ruta: '',
            DistribuidorID: 0,
            Mostrar: false,
            Id: undefined,
        },
        OptionsUsuario,
        optDia,
        DatosFecha: {
            FechaInicio: fechaActual,
            FechaFin: fechaFin,
        }
        , defaultSortAsc: true,
        defaultSortField: 'NombreCompleto',
        paginationDefaultPage: 1,
        FiltroSucursal
    })

    const cbRespuesta = (Datos: any) => {
        console.log("cbRespuesta", Datos)

        setState(s => ({ ...s, Datos: Datos, DatosCopia: Datos, Filtrando: 1 }))

    }

    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY")
    }
    /////////////////////////////////////////////
    const generarXLSX = () => {
        //if (state.MultiSaldoCajaID > 0) {
        //const XLSX = require('sheetjs-style');
        const XLSX = require('xlsx-js-style');
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.Datos.map(reg=>({
            DistribuidorID: reg.DistribuidorID,
            SucursalID: reg.SucursalID,
            Sucursal	: reg.Sucursal,
            PromotorID: reg.PromotorID,
            NombrePromotor: reg.NombrePromotor,
            CoordinadorID: reg.CoordinadorID,
            NombreCoordinador: reg.NombreCoordinador,
            FechaPrimerCanje: reg.FechaPrimerCanje,
            FechaHoraRegistro: reg.FechaHoraRegistro,
            DistribuidorNivelID: reg.DistribuidorNivelID,
            DistribuidorNivel: reg.DistribuidorNivel,
            DistribuidorNivelOrigenID: reg.DistribuidorNivelOrigenID,
            NivelOrigen: reg.NivelOrigen	
            
        })), { origin: "A3" });
        // XLSX.utils.sheet_add_aoa(ws, [["Reporte Global de Vales  " + new Date().toISOString()]], { origin: "A1" });

        for (let i in ws) {
            if (typeof (ws[i]) != "object") continue;
            let cell = XLSX.utils.decode_cell(i);
            // console.log(cell, 'cell')
            if (i.replace(/[^0-9]/ig, '') === '3') {
                ws[i].s = {
                    fill: {
                        patternType: "solid",
                        fgColor: { rgb: "9bbb58 " },
                        bgColor: { rgb: "9bbb58 " }
                    },
                    font: {
                        name: "Song Ti",
                        sz: 10,
                        bold: true,
                    },
                    border: {
                        bottom: {
                            style: 'thin',
                            color: 'FF000000'
                        }
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: '1',
                    },
                }
            } else {
                ws[i].s = {
                    font: {
                        name: "Song Ti",
                        sz: 10,
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: '1',
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

                        }
                    }

                };

                if (cell.c == 13 || cell.c == 14 || cell.c == 16 || cell.c == 17 || cell.c == 20 || cell.c == 24) { // first column

                    ws[i].s.numFmt = "$#,###.00"; // other numbers
                }

                if (cell.r % 2) {
                    ws[i].s.fill = {
                        patternType: "solid",
                        fgColor: { rgb: "EEEEEE" },
                        bgColor: { rgb: "EEEEEE" }
                    };
                }
            }
        }

        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        ws['!ref'] = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: 40, r: 1 + state.Datos.length + 1 }
        });
        ws['C9'] = { f: 'SUM(C2:C5)' };
        ws['B9'] = { v: 'Total' };

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'ReporteActivaciones.xlsx');

    }
    ////////////////////////////////////////////

    const Columns: IDataTableColumn[] =
        [
            {
                name: "DistribuidorID",
                selector: "DistribuidorID",
                center: true,
                sortable: false,
                // minWidth: "4%",
                width: '100px',
                cell: (propss) => (
                    <span className="text-center" > {propss.DistribuidorID} </span>
                ),
            },
            {
                center: true,
                name: "SucursalID",
                selector: "SucursalID",
                sortable: false,
                minWidth: "7%",
                cell: (propss) => (
                    <span className='text-center' > {propss.SucursalID} </span>
                )
            },
            {
                name: "Sucursal",
                selector: "Sucursal",
                center: true,
                sortable: false,
                minWidth: "9%",
                cell: (propss) => <span className="text-center" > {propss.Sucursal} </span>,
            },
            {
                name: "PromotorID",
                selector: "PromotorID",
                center: true,
                sortable: false,
                minWidth: "13%",
                cell: (propss) => (
                    <span className="text-center" > {propss.PromotorID} </span>
                ),
            },
            {
                name: "Promotor",
                selector: "NombrePromotor",
                center: true,
                sortable: false,
                minWidth: "30%",
                cell: (propss) => (
                    <span className="text-center" > {propss.NombrePromotor} </span>
                ),
            },
            {
                name: "CoordinadorID",
                selector: "CoordinadorID",
                sortable: false,
                center: true,
                minWidth: "13%",
                cell: (propss) => (
                    <span className="text-center" > {propss.CoordinadorID} </span>
                ),
            },
            {
                name: "Coordinador",
                selector: "NombreCoordinador",
                sortable: false,
                center: true,
                minWidth: "30%",
                cell: (propss) => (
                    <div className="text-center">
                        {propss.NombreCoordinador}
                    </div>
                ),
            },

            {
                name: "FechaPrimerCanje",
                selector: "FechaPrimerCanje",
                sortable: false,
                center: true,
                minWidth: "9%",
                cell: (propss) => (
                    <span className="text-center">
                        {moment(propss.FechaPrimerCanje).utc().format("DD-MM-YYYY")}
                    </span>)
            },
            {
                name: "FechaHoraRegistro",
                selector: "FechaHoraRegistro",
                sortable: false,
                center: true,
                minWidth: "9%",
                cell: (propss) => (
                    <span className="text-center">
                        {moment(propss.FechaHoraRegistro).utc().format("DD-MM-YYYY")}
                    </span>)
            },
            {
                center: true,
                name: "NivelID",
                selector: "DistribuidorNivelID",
                sortable: false,
                minWidth: "7%",
                cell: (propss) => (
                    <div className="text-center">
                        {propss.DistribuidorNivelID}
                    </div>
                ),
            },
            {
                center: true,
                name: "DistribuidorNivel",
                selector: "DistribuidorNivel",
                sortable: false,
                minWidth: "13%",
                // width: '180px',
                // minWidth: "9%",
                cell: (propss) => (
                    <span className="text-center" > {propss.DistribuidorNivel} </span>
                ),
            },
            {
                name: "OrigenID",
                selector: "DistribuidorNivelOrigenID",
                sortable: false,
                center: true,
                // width: '160px',
                // minWidth: "10%",
                minWidth: "7%",
                cell: (propss) => (
                    <span className="text-center" > {propss.DistribuidorNivelOrigenID} </span>
                ),
            },
            {
                name: "NivelOrigen",
                selector: "NivelOrigen",
                sortable: false,
                center: true,
                // width: '160px',
                // minWidth: "10%",
                minWidth: "13%",
                cell: (propss) => (
                    <span className="text-center" > {propss.NivelOrigen} </span>
                ),
            },
        ]

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [props.oidc])

    React.useEffect(() => {
        FnFiltrando()
        return () => {
            isMounted.current = false
        }
    }, [state.FiltroSucursal])


    const fnGetFiltrosSucursales = (SucursalID: number) => {
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }

    const FnFiltrando = () => {
        state.Datos = state.DatosCopia
        let datosFiltro = state.Datos
        if (state.FiltroSucursal > 0) {
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })
        }
        setState(s => ({ ...s, Datos: datosFiltro }))
    }


    return (
        <React.Fragment>
            <div className="row " >
                <div className="col-12" >
                    <Card Title="REPORTE DE ACTIVACIONES" >
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {
                                    !state.Cargando && !state.Error &&
                                    <div>
                                        <BuscarCreditoColocaciondvs
                                            filtrandoSusursal={state.Filtrando}
                                            oidc={props.oidc}
                                            ui={props.ui}
                                            cbRespuesta={cbRespuesta}
                                            cbFiltrar={fnGetFiltrosSucursales}
                                            generarXLSX={generarXLSX}
                                            initialValues={
                                                {
                                                    FechaInicio: '',
                                                    FechaFin: ''
                                                }
                                            }

                                        />
                                        <div className="text-end">
                                            <br />
                                            <button type="button" disabled={!ExpPermisos} className="btn mx-1 btn-success waves-effect waves-light"

                                                //disabled={state.estatusPeriodo != "A" ? true : false}
                                                onClick={() => {
                                                    generarXLSX()
                                                }}>
                                                <span className="is-hidden-touch">Export</span>&nbsp;<FaFileExcel />
                                            </button>
                                        </div>
                                        < DataTable
                                            subHeader
                                            data={state.Datos}
                                            striped
                                            pagination
                                            dense
                                            noHeader
                                            responsive
                                            paginationPerPage={30}
                                            keyField={"DistribuidorID"}
                                            defaultSortField={"DistribuidorID"}
                                            columns={Columns}

                                            // Cache de configuracion
                                            onSort={(Column, Direction) => setState(e => ({ ...e, defaultSortField: Column.selector as string, defaultSortAsc: Direction === "asc" }))}
                                            onChangePage={(page) => setState(e => ({ ...e, paginationDefaultPage: page }))}

                                            // Valores por defecto

                                            defaultSortAsc={state.defaultSortAsc}
                                            paginationDefaultPage={state.paginationDefaultPage}
                                        />

                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div >
        </React.Fragment >
    )
}


const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditoReporteActivaciones);