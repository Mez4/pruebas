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
import { BuscarCreditoColocaciondvs } from './CreditoColocacionDvs/BuscarCreditoColocaciondvs'
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

const CreditoColocacionSocia = (props: CatalogosType) => {    // Controll our mounted state
    const ExpPermisos = permisoExportar(2935);
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
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.Datos.map(reg => ({
            "ZonaID": reg.ZonaID,
            "Nombre Zona": reg.Zona,
            "Nombre Sucursal": reg.Sucursal_Nombre,
            "SucursalID": reg.SucursalID,
            "CoordinadorID": reg.CoordinadorID,
            "Nombre Coordinador": reg.CoordinadorNombre,
            "SociaID": reg.DistribuidorID,
            "Nombre Socia": reg.PersonaNombre,
            "Vales Colocados": reg.ValesColocados,
            "Distribuidores": reg.Distribuidores,
            "Total Colocado": reg.TotalColocado,
            "Saldo Actual": reg.SaldoActual,
            "Capital": reg.Capital,
            "Interes": reg.interes,
            "Seguro": reg.Seguro,
            "Total Prestado": reg.TotalPrestado,
            "Nombre Promotor": reg.NombrePromotor,

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

        XLSX.writeFile(wb, 'ColocacionSocias.xlsx');

    }
    ////////////////////////////////////////////

    const Columns: IDataTableColumn[] =
        [
            {
                name: "ZonaID",
                selector: "Zonaid",
                center: true,
                sortable: false,
                // minWidth: "4%",
                width: '65px',
                cell: (propss) => (
                    <span className="text-center" > {propss.ZonaID} </span>
                ),
            },
            {
                center: true,
                name: "Nombre Zona",
                selector: "Zona",
                sortable: false,
                minWidth: "7%",
                cell: (propss) => (
                    <span className='text-center' > {propss.Zona} </span>
                )
            },
            {
                name: "Nombre Sucursal",
                selector: "Sucursal_Nombre",
                center: true,
                sortable: false,
                minWidth: "9%",
                cell: (propss) => <span className="text-center" > {propss.Sucursal_Nombre} </span>,
            },
            {
                name: "SucursalID",
                selector: "SucursalID",
                center: true,
                sortable: false,
                minWidth: "5%",
                cell: (propss) => (
                    <span className="text-center" > {propss.SucursalID} </span>
                ),
            },
            {
                name: "CoordinadorID",
                selector: "CoordinadorID",
                center: true,
                sortable: false,
                minWidth: "6%",
                cell: (propss) => (
                    <span className="text-center" > {propss.CoordinadorID} </span>
                ),
            },
            {
                name: "Nombre Coordinador",
                selector: "CoordinadorNombre",
                sortable: false,
                center: true,
                minWidth: "14%",
                cell: (propss) => (
                    <div className="text-center">
                        {propss.CoordinadorNombre}
                    </div>
                ),
            },
            {
                name: "SociaID",
                selector: "DistribuidorID",
                sortable: false,
                center: true,
                minWidth: "5%",
                cell: (propss) => (
                    <span className="text-center" > {propss.DistribuidorID} </span>
                ),
            },
            {
                name: "Nombre Socia",
                selector: "PersonaNombre",
                sortable: false,
                center: true,
                minWidth: "14%",
                cell: (propss) => (
                    <span className="text-center" > {propss.PersonaNombre} </span>
                ),
            },
            {
                center: true,
                name: "Vales Colocados",
                selector: "ValesColocados",
                sortable: false,
                minWidth: "4%",
                cell: (propss) => (
                    <div className="text-center">
                        {propss.ValesColocados}
                    </div>
                ),
            },
            {
                center: true,
                name: "Distribuidores",
                selector: "Distribuidores",
                sortable: false,
                minWidth: "7%",
                // width: '180px',
                // minWidth: "9%",
                cell: (propss) => (
                    <span className="text-center" > {propss.Distribuidores} </span>
                ),
            },
            {
                center: true,
                name: "Total Colocado",
                selector: "TotalColocado",
                sortable: false,
                width: '120px',
                // minWidth: "9%",
                cell: (propss) => (
                    <span className="text-center" >
                        {FormateoDinero.format(propss.TotalColocado)}
                    </span>
                ),
            },
            {
                center: true,
                name: "Saldo Actual",
                selector: "SaldoActual",
                sortable: false,
                minWidth: "7%",
                cell: (propss) => (
                    <span className="text-center" >
                        {FormateoDinero.format(propss.SaldoActual)}
                    </span>
                ),
            },
            {
                name: "Capital",
                selector: "Capital",
                sortable: false,
                center: true,
                // width: '160px',
                minWidth: "7%",
                cell: (propss) => (
                    <span className="text-center" >
                        {FormateoDinero.format(propss.Capital)}
                    </span>
                ),
            },
            {
                name: "Interes",
                selector: "interes",
                center: true,
                sortable: false,
                minWidth: "7%",
                // width: '120px',
                cell: (propss) => (
                    <span className="text-center" >
                        {FormateoDinero.format(propss.interes)}
                    </span>
                ),
                // cell: (propss) => (
                //   <span className="text-center">
                //     {moment(propss.interes).utc().format("DD-MM-YYYY HH:mm:ss A")}
                //   </span>
                // ),
            },
            {
                name: "Seguro",
                selector: "Seguro",
                sortable: false,
                center: true,
                width: '160px',
                // minWidth: "10%",
                cell: (propss) => (
                    <span className="text-center" >
                        {FormateoDinero.format(propss.Seguro)}
                    </span>
                ),
            },
            {
                name: "Total Prestado",
                selector: "TotalPrestado",
                center: true,
                sortable: false,
                width: '120px',
                cell: (propss) => (
                    <span className="text-center" >
                        {FormateoDinero.format(propss.TotalPrestado)}
                    </span>
                ),
                //   cell: (propss) => (
                //     <span className="text-center">
                //       {moment(propss.FechaValida).utc().format("DD-MM-YYYY HH:mm:ss A")}
                //     </span>
                //   ),
            },
            {
                name: "Nombre Promotor",
                selector: "NombrePromotor",
                sortable: false,
                center: true,
                // width: '160px',
                // minWidth: "10%",
                minWidth: "18%",
                cell: (propss) => (
                    <span className="text-center" > {propss.PersonaNombre} </span>
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
        //state.Datos = state.DatosCopia
        let datosFiltro = [...state.DatosCopia]
        if (state.FiltroSucursal > 0) {
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })
        }

        //setState(s => ({ ...s, Datos: datosFiltro }))
        // Agregar una clave única a cada elemento
        const datosConClavesUnicas = datosFiltro.map((item, index) => ({
            ...item,
            uniqueKey: `${item.DistribuidorID}-${item.SucursalID}-${index}` // Combina propiedades para crear una clave única
        }));

        setState(s => ({ ...s, Datos: datosConClavesUnicas }));
    }





    return (
        <React.Fragment>
            <div className="row " >
                <div className="col-12" >
                    <Card Title="DETALLE DE COLOCACION SOCIAS" >
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
                                            keyField="uniqueKey" // Usa la nueva clave única
                                            defaultSortField="DistribuidorID"
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
export default connect(mapStateToProps, mapDispatchToProps)(CreditoColocacionSocia);