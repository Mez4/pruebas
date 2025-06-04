import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoGlobal/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaFileExcel, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { BuscarGlobal } from './CreditoGlobal/BuscarGlobal'
// import { CForm } from './CreditoGlobal/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';

import ReactTooltip from 'react-tooltip';
import moment from 'moment'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'
import XLSX from 'xlsx';
import { iUI } from '../../../../../interfaces/ui/iUI'


type CatalogosType = {
    oidc: IOidc,
    ui: iUI
}

type EstadoTipo = {
    DatosExcel: any[]
    Datos: DBConfia_Creditos.IGlobal_VW[],
    datosDist?: DBConfia_Creditos.IGlobal_VW,
    DatosMostrar: DBConfia_Creditos.IGlobal_VW[],
    DatosDetalle: DBConfia_Creditos.IPlanPagos[],
    datosPagos?: DBConfia_Creditos.IPlanPagos,
    DatosClientes: DBConfia_Creditos.IDistribuidoresClientesGlobalVW[],
    datosCliente?: DBConfia_Creditos.IDistribuidoresClientesGlobalVW,
    DatosCreditos: DBConfia_Creditos.ICreditos_VW[],
    Filtro: string,
    Cargando: boolean,
    Error: boolean
    Form:
    {
        Mostrar: boolean,
        Datos?: DBConfia_Creditos.ICreditos
        Id?: number
    },
    Detalle: boolean
    DetalleCredito: boolean,
    DetallePlan: boolean,
    CredID: number,
}

const CreditoGlobal = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const MySwal = withReactContent(Swal)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const [state, setState] = React.useState<EstadoTipo>({
        DatosExcel: [],
        Datos: [],
        datosDist: undefined,
        DatosMostrar: [],
        DatosDetalle: [],
        datosPagos: undefined,
        DatosClientes: [],
        datosCliente: undefined,
        DatosCreditos: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        Form: {
            Mostrar: false,
            Datos: undefined,
            Id: undefined
        },
        Detalle: false,
        DetalleCredito: false,
        DetallePlan: false,
        CredID: 0
    })

    const FNGetDetalle = (CreditoID: number) => {
        Funciones.FNGetPlanPagos(props.oidc, CreditoID)
            .then((respuesta: any) => {
                let creditos = state.DatosDetalle.find(Dato => Dato.CreditoID === CreditoID)
                setState(s => ({ ...s, datosPagos: creditos, CredID: CreditoID }))
                setState(s => ({ ...s, DetallePlan: true, DatosDetalle: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, DetallePlan: false, DatosDetalle: [] }))
            })
    }
    const FNGetClientes = (DistribuidorID: number) => {
        Funciones.FNGetClientes(props.oidc, DistribuidorID)
            .then((respuesta: any) => {
                let distribuidor = state.Datos.find(Dato => Dato.DistribuidorID === DistribuidorID)
                setState(s => ({ ...s, datosDist: distribuidor }))
                setState(s => ({ ...s, Detalle: true, DatosClientes: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, Detalle: false, DatosClientes: [] }))
            })
    }

    const FNGCreditosCliente = (DistribuidorID?: number, ClienteID?: number, ProductoID?: number) => {
        Funciones.FNGCreditosCliente(props.oidc, DistribuidorID, ClienteID, ProductoID)
            .then((respuesta: any) => {
                let cliente = state.DatosClientes.find(Dato => Dato.ClienteID === ClienteID)
                // setState(s => ({ ...s, datosCliente: cliente }))
                setState(s => ({ ...s, DetalleCredito: true, DatosCreditos: respuesta, datosCliente: cliente }))
            })
            .catch(() => {
                setState(s => ({ ...s, DetalleCredito: false, DatosCreditos: [] }))
            })
    }

    const generarXLSX = () => {
        //if (state.MultiSaldoCajaID > 0) {
        //const XLSX = require('sheetjs-style');
        const XLSX = require('xlsx-js-style');
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel, { origin: "A3" });
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
                        // color: { rgb: "FFFFFF" },
                        //   name: 'Song Ti', // fuente
                        //   sz: 12, // tamaño de fuente
                        //   bold: true // negrita
                    },
                    border: {
                        // guion bajo
                        bottom: {
                            style: 'thin',
                            color: 'FF000000'
                        }
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: '1', // any truthy value here
                    },
                }
            } else {
                ws[i].s = { // styling for all cells
                    font: {
                        name: "Song Ti",
                        sz: 10,
                        //  bold: true,
                        //  color: { rgb: "FFFFFF" },
                        //   name: 'Song Ti', // fuente
                        //   sz: 12, // tamaño de fuente
                        //   bold: true // negrita
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center",
                        wrapText: '1', // any truthy value here
                    },
                    border: {
                        right: {
                            style: "thin",
                            // color: "24E924"
                        },
                        left: {
                            style: "thin",
                            // color: "24E924"
                        },
                        bottom: {
                            style: "thin",
                            // color: "24E924"
                        }
                    }

                };

                if (cell.c == 13 || cell.c == 14 || cell.c == 16 || cell.c == 17 || cell.c == 20 || cell.c == 24) { // first column
                    //     ws[i].s.numFmt = "DD/MM/YYYY HH:MM"; // for dates
                    //     ws[i].z = "DD/MM/YYYY HH:MM";
                    // } else { 
                    ws[i].s.numFmt = "$#,###.00"; // other numbers
                }

                // if (cell.r == 0 ) { // first row
                //     ws[i].s.border.bottom = { // bottom border
                //         style: "thin",
                //         color: "6EDF3E"
                //     };
                // }
                // var cellz = {f: ''};
                // // cellz.forEach({} => {

                // // });
                // // console.log(cellz,' celllz')
                // for (let index  in cellz) {
                //     const element = cellz[index];
                //     console.log(element)

                // }
                // var cellRef = XLSX.utils.encode_cell({r:0, c:0});

                // var range = {s:{r: 0, c: 0},
                // e: {c:0, r:0}};
                // ws[cellRef] = cellz;
                // console.log(ws[cellRef] )
                // ws['!ref'] = XLSX.utils.encode_range(range);
                // 


                if (cell.r % 2) { // every other row
                    ws[i].s.fill = { // background color
                        patternType: "solid",
                        fgColor: { rgb: "EEEEEE" },
                        bgColor: { rgb: "EEEEEE" }
                    };
                }
            }
        }

        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // state.DatosExcel.forEach(element => {
        //     console.log(element, 'elementefor')
        // });

        ws['!ref'] = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: 40, r: 1 + state.DatosExcel.length + 1 }
        });
        ws['C9'] = { f: 'SUM(C2:C5)' };
        ws['B9'] = { v: 'Total' };

        // wb.Props. = "Insert Title Here";
        // wb = XLSX.WorkBook('images.xlsx')
        // worksheet = workbook.add_worksheet()
        // if (!wb.Props) wb.Props = {};
        // wb.Props.Title = "Insert Title Here";
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'GlobalCreditos.xlsx');

    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id Producto', selector: 'ProductoID', sortable: true, width: '70px' },
                { name: 'Producto', selector: 'Producto', sortable: true, /*width: '180px'*/ },
                { name: 'Id Director', selector: 'DirectorID', sortable: true, width: '70px' },
                { name: 'Nombre Director', selector: 'NombreDirector', sortable: true, width: '250px' },
                { name: 'Id Zona', selector: 'ZonaID', sortable: true, },
                { name: 'Zona', selector: 'ZonaNombre', sortable: true, },
                { name: 'Id Sucursal', selector: 'SucursalID', sortable: true, },
                { name: 'Sucursal', selector: 'Nombre', sortable: true, },
                { name: 'Id Grupo', selector: 'GrupoID', sortable: true, },
                {
                    name: 'Grupo', selector: 'ClasificadorGrupoID', sortable: true,
                    cell: (props) => <div className="d-flex flex-row-reverse">
                        {props.ClasificadorGrupoID == 1 && <span>{props.Descripcion}</span>}
                        {props.ClasificadorGrupoID == 2 && <span>{props.ClasificadorGrupoID}</span>}
                    </div>
                },
                { name: 'Id Socia', selector: 'DistribuidorID', sortable: true, },
                {
                    name: 'Nombre Socia', width: '250px', selector: 'NombreCompleto', sortable: true,
                    cell: (props) =>
                        <>
                            <span data-tip data-for={`DistribuidorTooltip${props.DistribuidorID}`}>{props.NombreCompleto}</span>
                            <ReactTooltip id={`DistribuidorTooltip${props.DistribuidorID}`}
                                type="dark"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                {props.NombreCompleto}
                            </ReactTooltip>
                        </>
                },
                { name: 'Limite De Crédito', selector: 'LimiteDeCredito', sortable: true, format: row => formatter.format(row.LimiteDeCredito) },
                { name: 'Disponible', selector: 'Disponible', sortable: true, format: row => formatter.format(row.Disponible) },
                { name: 'Socia Nivel', selector: 'DistribuidorNivel', sortable: true, },
                { name: 'Cartera', selector: 'Cartera', sortable: true, format: row => formatter.format(row.Cartera) },
                { name: 'Saldo Prestamo Personal', selector: 'saldoPresPersonal', sortable: true, format: row => formatter.format(row.saldoPresPersonal) },
                {
                    name: 'Número Prestamos Personales', selector: 'numCreditosPersonales', sortable: true,
                    cell: (props) => <div className="d-flex flex-row-reverse">
                        {props.numCreditosPersonales > 0 && <span>{props.numCreditosPersonales}</span>}
                        {props.numCreditosPersonales <= 0 && <span><p>0</p></span>}
                    </div>
                },
                { name: 'Créditos Activos', selector: 'CreditosActivos', sortable: true, },
                { name: 'Saldo Atrasado', selector: 'SaldoAtrasado', sortable: true, format: row => formatter.format(row.SaldoAtrasado) },
                { name: 'Días Atraso', selector: 'DiasAtraso', sortable: true, },
                { name: 'Pagos Atrasados', selector: 'PagosAtrasados', sortable: true },
                { name: 'Créditos Atrasados', selector: 'CreditosAtrasados', sortable: true },
                { name: 'Capital Creditos', selector: 'Capital', sortable: true, format: row => formatter.format(row.Capital) },
                { name: 'Intereses', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes) },
                { name: 'Seguro', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro) },
                { name: '% Colocacion Límite', selector: 'PorcColocacionLimite', sortable: true, cell: (props) => <span>{props.PorcColocacionLimite + "%"}</span> },
                // // { name: 'Fecha Último Vale', selector: 'fechaUltimoVale', sortable: true, cell: (props) => <span>{moment(props.fechaUltimoVale).format('DD/MM/YYYY')}</span> },
                {
                    name: 'Fecha Último Vale', selector: 'fechaUltimoVale       ', sortable: true,
                    cell: (props) => <div className="d-flex flex-row-reverse">
                        {props.fechaUltimoVale != null && <span>{moment(props.fechaUltimoVale).format('DD/MM/YYYY')}</span>}
                        {props.fechaUltimoVale == null && <span><p>00/00/00</p></span>}
                    </div>
                },
                { name: 'Capital Liquidado', selector: 'CapLiquidado', sortable: true, format: row => formatter.format(row.CapLiquidado) },
                { name: 'Cartera En Riesgo', selector: 'CarteraEnRiesgo', sortable: true, format: row => formatter.format(row.CarteraEnRiesgo) },
                // { name: 'Avales', selector: 'Avales', sortable: true, },
                { name: 'Saldo En Riesgo', selector: 'saldoEnRiesgo', sortable: true, format: row => formatter.format(row.saldoEnRiesgo) },
                { name: 'Última Relación Importe', selector: 'UltRelacionImporte', sortable: true, format: row => formatter.format(row.UltRelacionImporte) },
                { name: 'Recuperado', selector: 'Recuperado', sortable: true, format: row => formatter.format(row.Recuperado) },
                // { name: 'Última Relación Fecha', selector: ' UltimaFechaRelacion', sortable: true, cell: (props) => <span>{moment(props. UltimaFechaRelacion).format('DD/MM/YYYY')}</span> },
                {
                    name: 'Última Relación Fecha', selector: 'UltimaFechaRelacion', sortable: true,
                    cell: (props) => <div className="d-flex flex-row-reverse">
                        {props.UltimaFechaRelacion != null && <span>{moment(props.UltimaFechaRelacion).format('DD/MM/YYYY')}</span>}
                        {props.UltimaFechaRelacion == null && <span><p>00/00/0000</p></span>}
                    </div>
                },

                { name: 'Días Desde UltPago', selector: 'DiasDesdeUltPago', sortable: true, },
                { name: 'EstatusID', selector: 'DistribuidoresEstatusID', sortable: true, },
                { name: 'Estatus', selector: 'DistribuidoresEstatus', sortable: true, },
            ]
        return colRet
    }, [])

    const DetailColumns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: '# Pago', width: '95px', selector: 'NoPago', sortable: true, },
                { name: 'Fecha Vencimiento', width: '110px', selector: 'FechaVencimiento', sortable: true, cell: (props) => <span>{moment(props.FechaVencimiento).format('DD/MM/YYYY')}</span> },
                { name: 'Importe', width: '150px', selector: 'ImporteTotal', sortable: true, format: row => formatter.format(row.ImporteTotal) },
                { name: 'Abono', width: '150px', selector: 'Abonos', sortable: true, format: row => formatter.format(row.Abonos) },
                { name: 'Saldo', width: '150px', selector: 'SaldoActual', sortable: true, format: row => formatter.format(row.SaldoActual) },
                { name: 'Comisión', width: '150px', selector: 'Comision', sortable: true, format: row => formatter.format(row.Comision) },
                { name: 'Fecha Liquidacion', width: '110px', selector: 'FechaLiquidacion', sortable: true, cell: (props) => <span>{props.FechaLiquidacion ? moment(props.FechaLiquidacion).format('DD/MM/YYYY') : ''}</span> },
                { name: 'Días Atraso', selector: 'DiasAtraso', sortable: true, },
            ]
        return colRet
    }, [])

    const DetailColumnsCliente = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ClienteID', width: '95px', selector: 'ClienteID', sortable: true, },
                { name: 'Nombre Completo', width: '110px', selector: 'NombreCompleto', sortable: true, },
                { name: 'Importe Total', width: '150px', selector: 'ImporteTotal', sortable: true, format: row => formatter.format(row.ImporteTotal) },
                { name: 'Saldo Actual', width: '150px', selector: 'SaldoActuals', sortable: true, format: row => formatter.format(row.SaldoActual) },
                { name: 'Pagos Atrasados', width: '150px', selector: 'PagosAtrasados', sortable: true, },
                { name: 'Días Atraso', selector: 'DiasAtraso', sortable: true, },
                { name: 'Fecha Último Pago', width: '110px', selector: 'FechaHoraUltimoPago', sortable: true, cell: (props) => <span>{props.FechaHoraUltimoPago ? moment(props.FechaHoraUltimoPago).format('DD/MM/YYYY') : ''}</span> },
                { name: 'Capital', width: '150px', selector: 'Capital', sortable: true, format: row => formatter.format(row.Capital) },
                { name: 'Interes', width: '150px', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes) },
                { name: 'Seguro', width: '150px', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro) },
                { name: 'Pago Moda', width: '150px', selector: 'PagoMod', sortable: true, format: row => formatter.format(row.PagoMod) },
            ]
        return colRet
    }, [])


    const DetailColumnsCreditos = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'N° Crédito', selector: 'CreditoID', sortable: true, },
                { name: 'Id Cliente', selector: 'ClienteID', sortable: true, },
                {
                    name: 'Nombre Cliente', width: '250px', selector: 'NombreCompleto', sortable: true,
                    cell: (props) =>
                        <>
                            <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
                            <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
                                type="dark"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                {props.NombreCompleto}
                            </ReactTooltip>
                        </>
                },
                { name: 'Capital', selector: 'Capital', sortable: true, format: row => formatter.format(row.Capital) },
                { name: 'Interes', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes) },
                { name: 'MC', selector: 'ManejoCuenta', sortable: true, format: row => formatter.format(row.ManejoCuenta) },
                { name: 'Seguro', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro) },
                { name: 'Cargo', selector: 'Cargo', sortable: true, format: row => formatter.format(row.Cargo) },
                { name: 'IVA', selector: 'IVA', sortable: true, format: row => formatter.format(row.IVA) },
                { name: 'Total', selector: 'ImporteTotal', sortable: true, format: row => formatter.format(row.ImporteTotal) },
                {
                    name: 'Abonos', selector: 'Abonos', sortable: true, format: row => formatter.format(row.Abonos), style: {
                        fontWeight: 'bold',
                    }
                },
                {
                    name: 'Saldo', selector: 'SaldoActual', sortable: true, format: row => formatter.format(row.SaldoActual), style: {
                        fontWeight: 'bold',
                    }
                },
                {
                    name: 'Atrasado', selector: 'SaldoAtrasado', sortable: true, format: row => formatter.format(row.SaldoAtrasado), conditionalCellStyles: [
                        {
                            when: row => row.SaldoAtrasado > 0,
                            style: {
                                color: 'red',
                            }
                        }
                    ]
                },
                {
                    name: 'Días Atraso', selector: 'DiasAtraso', sortable: true, conditionalCellStyles: [
                        {
                            when: row => row.DiasAtraso > 0,
                            style: {
                                color: 'red',
                            }
                        }
                    ]
                },
                { name: 'Fecha Registro', width: '110px', selector: 'FechaHoraRegistro', sortable: true, cell: (props) => <span>{moment(props.FechaHoraRegistro).format('DD/MM/YYYY')}</span> },
                { name: 'Vale', selector: 'ValeCanje', sortable: true, },
                { name: 'Estatus', selector: 'EstatusNombre', sortable: true, cell: (props) => <span>{props.EstatusNombre}</span> },
                { name: 'Desembolsado', selector: 'MovimientoID', sortable: true, cell: (props) => <span>{props.MovimientoID ? "SI" : "No"}</span> },
                { name: 'Movimiento', selector: 'MovimientoID', sortable: true, },
                { name: 'Id Venta', selector: 'VentaId', sortable: true, },
            ]
        return colRet
    }, [])

    const HiddenColumns: IDataTableColumn[] =
        [
            {
                name: 'Acciones',
                sortable: false,
                wrap: true,
                cell: (data) =>
                    <div style={{ width: '25%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {/* {console.log(data, 'data')} */}
                        <button data-tip data-for={`DetalleDvTooltip${data.DistribuidorID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {
                            FNGetClientes(data.DistribuidorID)
                        }}>
                            <FaListAlt />
                        </button>
                        <ReactTooltip id={`DetalleDvTooltip${data.DistribuidorID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Detalle Socia
                        </ReactTooltip>
                    </div>

                // FNGCreditosCliente
            },
        ]
    // return col
    // }, [])

    const HiddenColumns2: IDataTableColumn[] =
        [
            {
                name: 'Acciones',
                sortable: false,
                wrap: true,
                cell: (data) =>
                    <div style={{ width: '25%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button data-tip data-for={`DetalleClieTooltip${data.ClienteID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {
                            FNGCreditosCliente(data.DistribuidorID, data.ClienteID, data.ProductoID)
                        }}>
                            <FaListAlt />
                        </button>
                        <ReactTooltip id={`DetalleClieTooltip${data.ClienteID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Detalle Cliente
                        </ReactTooltip>
                    </div>

            },
        ]
    // return col
    // }, [])

    const HiddenColumns3: IDataTableColumn[] =
        [
            {
                name: 'Acciones',
                sortable: false,
                wrap: true,
                cell: (data) =>
                    <div style={{ width: '25%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button data-tip data-for={`DetallePagoTooltip${data.CreditoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {

                            FNGetDetalle(data.CreditoID)
                        }}>
                            <FaListAlt />
                        </button>
                        <ReactTooltip id={`DetallePagoTooltip${data.CreditoID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Detalle Plan de Pagos
                        </ReactTooltip>
                    </div>

                // FNGCreditosCliente
            },
        ]
    // return col
    // }, [])

    const HiddenData = (data: any) => {
        const Datos = [data.data]
        // console.log(Datos, 'hiddendatadatos')
        return (
            <DataTable
                data={Datos}
                striped
                noHeader
                noTableHead
                responsive
                keyField={"CreditoID"}
                defaultSortField={"CreditoID"}
                columns={HiddenColumns}
            />
        )
    }

    const HiddenData2 = (data: any) => {
        const Datos = [data.data]
        return (
            <DataTable
                data={Datos}
                striped
                noHeader
                noTableHead
                responsive
                keyField={"ClienteID"}
                defaultSortField={"ClienteID"}
                columns={HiddenColumns2}
            />
        )
    }

    const HiddenData3 = (data: any) => {
        const Datos = [data.data]
        return (
            <DataTable
                data={Datos}
                striped
                noHeader
                noTableHead
                responsive
                keyField={"CreditoID"}
                defaultSortField={"CreditoID"}
                columns={HiddenColumns3}
            />
        )
    }

    React.useEffect(() => {
        if (isMounted.current === true) {
            // FNGetLocal()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbRespuesta = (Datos: any) => {
        // console.log(Datos, 'cbRespuesta1')
        if (isMounted.current === true) {
            if (Datos.length > 0) {
                setState(s => ({ ...s, ProductoID: Datos[0].ProductoID }))
                let tabla: any[] = []
                // let totalDiferencia = 0
                // let totalCajaFisico = 0
                // let totalCajaSistema = 0
                // let cajaAnteriorID = 0
                // let posicion = 0
                // let posicion2 = 0
                // let tabla2: any[] = []

                Datos.forEach((element: any) => {
                    // posicion = posicion + 1
                    // if (cajaAnteriorID == 0) {
                    let datosGlobal: any
                        = {
                        ProductoID: element.ProductoID,
                        Producto: element.Producto,
                        DirectorID: element.DirectorID,
                        Director: element.NombreDirector,
                        ZonaID: element.ZonaID,
                        Zona: element.ZonaNombre,
                        SucursalID: element.SucursalID,
                        Sucursal: element.Nombre,
                        GrupoID: element.GrupoID,
                        Grupo: element.ClasificadorGrupoID,
                        Descripcion: element.Descripcion,
                        DistribuidorID: element.DistribuidorID,
                        Distribuidor: element.NombreCompleto,
                        Credito: element.LimiteDeCredito,
                        Disponible: element.Disponible,
                        Nivel: element.DistribuidorNivel,
                        Cartera: element.Cartera,
                        PrestamoPersonal: element.saldoPresPersonal,
                        NoCreditosPersonales: element.numCreditosPersonales,
                        CreditosActivos: element.CreditosActivos,
                        SaldoAtrasado: element.SaldoAtrasado,
                        DiasAtraso: element.DiasAtraso,
                        PagosAtrasados: element.PagosAtrasados,
                        CreditosAtrasados: element.CreditosAtrasados,
                        Capital: element.Capital,
                        Intereses: element.Interes,
                        Seguro: element.Seguro,
                        PorcentajeColocacion: element.PorcColocacionLimite,
                        FechaUltimoVale: element.fechaUltimoVale,
                        CapitalLiquidado: element.CapLiquidado,
                        CarteraRiesgo: element.CarteraEnRiesgo,
                        SaldoRiesgo: element.saldoEnRiesgo,
                        UltimoImporteRelacion: element.UltRelacionImporte,
                        Recuperado: element.Recuperado,
                        UltimaFechaRelacion: element.UltimaRelacionFecha,
                        DiasDesdeUltimoPago: element.DiasDesdeUltPago,
                        EstatusID: element.DistribuidoresEstatusID,
                        Estatus: element.DistribuidoresEstatus,

                    }


                    tabla.push(datosGlobal)
                    // cajaAnteriorID = element.CajaID
                    // }

                });


                /*     respuesta.forEach(element => {
                        
                    }); */

                setState(s => ({ ...s, Datos: Datos, DatosExcel: tabla }))
            }


        }
        //  setState(s => ({ ...s, Datos: Datos, DatosExcel: Datos }))
    }


    /** funcion Callback al actualizar un item */
    // const cbActualizar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.CreditoID === item.CreditoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: undefined } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    // const cbCancelar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.filter((obj) => { return obj.CreditoID !== item.CreditoID }) })

    const Export = ({ onExport }) => <button className="ms-2 btn btn-primary waves-effect waves-light" type={"button"} onClick={e => onExport(e.target)}>Exportar</button>;

    const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(state.DatosMostrar)} />, []);

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(state.DatosMostrar[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Global Créditos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <BuscarGlobal
                                        oidc={props.oidc}
                                        ui={props.ui}
                                        initialValues={
                                            {
                                                DirectorID: 0,
                                                ProductoID: 1,
                                                ClienteID: 0,
                                                SucursalID: 0,
                                                ZonaID: 0,
                                                EmpresaID: 0,
                                                DistribuidorID: 0,
                                                CoordinadorID: 0,
                                                ContratoID: 0,
                                                EstatusID: 'A',
                                                DistribuidorNivelID: 0,
                                                FechaInicio: moment().add(-30, 'd').toDate(),
                                                FechaFin: new Date(),
                                                GrupoID: 0,
                                                Permiso: true,
                                                tipoDias: '1',
                                            }
                                        }
                                        fnCargando={() => setState({ ...state, Cargando: true })}
                                        cbRespuesta={cbRespuesta}
                                        generarXLSX={generarXLSX}
                                    />
                                    <button type="button" className="btn mx-1 btn-success waves-effect waves-light"
                                        //disabled={state.estatusPeriodo != "A" ? true : false}
                                        onClick={() => {
                                            generarXLSX()
                                        }}>
                                        <FaFileExcel size="20px" />
                                    </button>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar crédito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* {actionsMemo} */}
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: undefined, Id: undefined } })}
                                                        ><FaPlus />
                                                        </button> */}
                                                        {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        // noHeader
                                        responsive
                                        keyField={"CreditoID"}
                                        defaultSortField={"CreditoID"}
                                        columns={Columns}
                                        expandableRows
                                        // expandOnRowClicked
                                        onRowExpandToggled={(res: any) => {
                                            HiddenData(res)
                                        }}
                                        expandableRowsComponent={<HiddenData />}
                                    // actions={actionsMemo} 
                                    />
                                    <ModalWin open={state.Detalle} xlarge scrollable>
                                        <ModalWin.Header>
                                            {/* <div className="d-flex flex-row-reverse">
                                            </div> */}
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Detalle Socia"} <br />  {state.datosDist?.ClasificadorGrupoID == 1 && <span>Grupo: {state.datosDist?.Descripcion}</span>}
                                                {state.datosDist?.ClasificadorGrupoID == 2 && <span>Grupo: {state.datosDist?.ClasificadorGrupoID}</span>} <br />
                                                {/* {"Detalle del Socia" + state.datosDist?.ClasificadorGrupoID+ state.datosDist?.Descripcion} <br /> */}
                                                {"Socia: " + state.datosDist?.DistribuidorID + " - " + state.datosDist?.NombreCompleto} <br />
                                                {"Estatus: " + state.datosDist?.DistribuidoresEstatus} <br />
                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState({ ...state, Detalle: false })} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <DataTable
                                                data={state.DatosClientes}
                                                striped
                                                // pagination
                                                dense
                                                noHeader
                                                responsive
                                                keyField={"ClienteID"}
                                                defaultSortField={"ClienteID"}
                                                columns={DetailColumnsCliente}
                                                expandableRows
                                                expandOnRowClicked
                                                onRowExpandToggled={(res: any) => {
                                                    HiddenData2(res)
                                                }}
                                                expandableRowsComponent={<HiddenData2 />}
                                            // actions={actionsMemo} 
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>

                                    {/* MODAL DE PANTALLA COMPLETA */}
                                    <ModalWin open={state.DetalleCredito} xlarge scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Creditos Cliente"} <br />
                                                {"Socia: " + state.datosDist?.DistribuidorID + " - " + state.datosDist?.NombreCompleto} <br />
                                                {"Cliente: " + state.datosCliente?.ClienteID + " - " + state.datosCliente?.NombreCompleto}
                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState({ ...state, DetalleCredito: false })} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <DataTable
                                                data={state.DatosCreditos}
                                                striped
                                                // pagination
                                                dense
                                                noHeader
                                                responsive
                                                keyField={"CreditoID"}
                                                defaultSortField={"CreditoID"}
                                                columns={DetailColumnsCreditos}
                                                expandableRows
                                                // expandOnRowClicked
                                                onRowExpandToggled={(res: any) => {
                                                    HiddenData3(res)
                                                }}
                                                expandableRowsComponent={<HiddenData3 />}
                                            // actions={actionsMemo} 
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>


                                    <ModalWin open={state.DetallePlan} xlarge scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Plan de Pagos"} <br />
                                                {"Socia: " + state.datosDist?.DistribuidorID + " - " + state.datosDist?.NombreCompleto} <br />
                                                {"Cliente: " + state.datosCliente?.ClienteID + " - " + state.datosCliente?.NombreCompleto} <br />
                                                {"N°Crédito: "}
                                                {state.CredID}

                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState({ ...state, DetallePlan: false })} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <DataTable
                                                data={state.DatosDetalle}
                                                striped
                                                // pagination
                                                dense
                                                noHeader
                                                responsive
                                                keyField={"NoPago"}
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
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoGlobal)
