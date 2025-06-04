import { DataGrid, GridCsvExportOptions, GridCsvGetRowsToExportParams, gridExpandedSortedRowIdsSelector, GridExportMenuItemProps, GridFooterContainer, gridPageCountSelector, gridPaginatedVisibleSortedGridRowIdsSelector, GridPagination, GridPaginationModel, gridPaginationModelSelector, GridSlotsComponentsProps, GridToolbarContainer, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { Menu, MenuItem, Pagination, TablePaginationProps, Tooltip } from "@mui/material";
import { FaFileExcel, FaSearch, FaUpload } from "react-icons/fa";
import { FiltrarDatos } from "../../global/functions";
import { useEffect, useState, createContext, useContext, useRef, useMemo } from "react";
import moment from "moment";
import XLSX from 'xlsx';
//import PantallasExcel from "../../global/PantallasExcel";
import { IEstado } from "../../interfaces/redux/IEstado";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { toast } from "react-toastify";


type TotalizedColumns = {
    operation: ('sum' | 'avg')[] | 'sum' | 'avg'
    column: string
    format?(value: any): any
}

type IntTableStateContext = {
    addFilter: boolean
    filtro: string
    setFiltro(...props: any): any
    fullData: any[],
    tableTitle?: string,
    totalize?: boolean,
    totalizeColumns?: TotalizedColumns[]
    columns: any[]
    PermisoID: number | undefined
    Exportar?: boolean,
    pagination?: boolean,
    chargeCsvData?: boolean
    getJsonCols(fnData: { columns: any[], data: any[] }): any[]
    setDatos(props: any): any
    setCols(props: any): any
}

const InitValuesTableState: IntTableStateContext = {
    addFilter: true,
    filtro: '',
    setFiltro: () => { },
    fullData: [],
    tableTitle: `${moment().format('DDMMYYYY')}.xlsx`,
    totalize: false,
    PermisoID: undefined,
    columns: [],
    chargeCsvData: false,
    getJsonCols: ({ columns: [], data: [] }) => [],
    setDatos: (_) => [],
    setCols: (_) => []
}

const TableStateContext = createContext<IntTableStateContext>(InitValuesTableState);


type IntTable = {
    data: any[],
    columns?: any[],
    rowId?: string,
    selectedRows?: any[]
    onRowSelected?(props: any): any,
    addFilter?: boolean
    tableTitle?: string
    totalize?: boolean
    totalizeColumns?: TotalizedColumns[]
    PermisoID?: number
    Exportar?: boolean
    pagination?: boolean
    chargeCsvData?: boolean
    extractCsvData?: any
}


const getRowsFromCurrentPage = ({ apiRef }: GridCsvGetRowsToExportParams) => gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);
const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) => gridExpandedSortedRowIdsSelector(apiRef);
interface IntMenuExportItem extends GridExportMenuItemProps<{}> { Titulo: string, Accion: Function }
const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

const MenuExportItem = (props: IntMenuExportItem) => {
    const { hideMenu, Titulo, Accion } = props;

    return <MenuItem
        onClick={() => {
            Accion()
            hideMenu?.();
        }}
    >{Titulo}</MenuItem>
}

function CustomExportMenu({ open, anchorEl, handleClose }) {
    const { fullData, tableTitle } = useContext(TableStateContext);
    const apiRef = useGridApiContext();

    const handleExportCsv = (options: GridCsvExportOptions) => {
        const csvData = apiRef.current.getDataAsCsv(options);
        const csvArray = XLSX.utils.sheet_to_json(XLSX.read(csvData, { type: 'string' }).Sheets.Sheet1, { raw: true, });
        handleExportXlsx(csvArray)
    }

    const handleExportXlsx = (Data = fullData) => {
        const XLSX = require('xlsx-js-style');
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Data, { origin: "A3" });
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, tableTitle);
    }

    return (
        <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
        >
            <MenuExportItem
                Accion={() => handleExportCsv({ getRowsToExport: getRowsFromCurrentPage })}
                Titulo={'Descargar pagina'} />
            <MenuExportItem
                Accion={() => handleExportCsv({ getRowsToExport: getFilteredRows })}
                Titulo={'Descargar filtrado'} />
            <MenuExportItem
                Accion={() => handleExportXlsx(fullData)}
                Titulo={'Descargar todo'} />
        </Menu>
    );
}

const CustomToolbar = (props: NonNullable<GridSlotsComponentsProps['toolbar']>) => {
    const { filtro, setFiltro, PermisoID, chargeCsvData, setDatos, setCols, getJsonCols, Exportar } = useContext(TableStateContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const Estado = useAppSelector<IEstado>(estado => estado)
    const disableExport = useMemo(() => !(Boolean(Estado.UI.PermisosExportar?.find(p => p.PermisoID == PermisoID)) && Exportar), [Estado.UI.PermisosExportar, PermisoID, Exportar]);
    const fileInput = useRef<any>();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleFileInput = () => fileInput && fileInput.current.click()

    const readCsvFile = ({ target: { files } }) => {
        try {
            const XLSX = require('xlsx-js-style');
            const file = files[0]

            if (!file.name.includes('.csv') && !file.name.includes('.xls') && !file.name.includes('.xlsx'))
                throw "El formato del archivo no es valido favor de subir alguno de los sig. formatos (csv, xls, xlsx)"

            var reader: FileReader = new FileReader();

            reader.onload = function (e: any) {
                var data = e.target.result;
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                if (workbook.SheetNames.lenght > 1) throw "Solo se puede leer una hoja por archivo"

                workbook.SheetNames.forEach((sheetName) => {
                    const jsonObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    const jsonWithIDs = jsonObject.map((reg, id) => ({ ...reg, i: id }))

                    setCols(getJsonCols({ columns: [], data: jsonObject }))
                    setDatos(jsonWithIDs)
                })
            };

            reader.onerror = function (ex) {
                console.error(ex)
                toast.error(ex);
            };

            reader.readAsBinaryString(file);

        } catch (ex) {
            console.error(ex)
            toast.error(ex);
        }
    }

    return <>
        <GridToolbarContainer {...props} className="d-flex justify-content-end">
            <div>
                <input type="file" ref={fileInput} onChange={readCsvFile} className="d-none" accept=".csv,.xlsx,.xls" />
                <div className="input-group mt-3 mb-5">
                    <CustomExportMenu open={open} anchorEl={anchorEl} handleClose={handleClose} />
                    {chargeCsvData && <>
                        <Tooltip title={`Cargar informacion`}>
                            <button
                                className={`input-group-text text-white bg-primary`}
                                aria-haspopup="true"
                                onClick={handleFileInput}
                            ><FaUpload /> </button>
                        </Tooltip>
                    </>}
                    <Tooltip title={`${disableExport ? '' : 'Exportar excel'}`}>
                        <button
                            className={`input-group-text text-white ${disableExport ? 'bg-secondary' : 'bg-success '}`}
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            disabled={disableExport}
                        ><FaFileExcel /> </button>
                    </Tooltip>
                    <input type="text" className="form-control" placeholder="Buscar" value={filtro} onChange={e => setFiltro(e.target.value)} />
                    <span className="input-group-text"><FaSearch /> </span>
                </div>
            </div>
        </GridToolbarContainer>
    </>
}

const CustomFooter = (props: any) => {
    const { columns, totalizeColumns, totalize, fullData, pagination } = useContext(TableStateContext);
    const apiRef = useGridApiContext();
    const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);


    // const camposSumados = totalizeColumns?.reduce((a, r) => ({
    //     ...a,
    //     [r.column]: fullData.reduce((a, b) => a + b[r.column], 0)
    // }), {}) || {}

    const camposSumados = columns.reduce((a, r) => ({
        ...a,
        [r.field]: fullData.reduce((a, b) => isNaN(b[r.field]) ? 'N/A' : parseFloat(a) + parseFloat(b[r.field]), "0")
    }), {}) || {}

    // const camposPromediados = totalizeColumns?.reduce((a, r) => ({
    //     ...a,
    //     [r.column]: fullData.reduce((a, b) => (a + b[r.column]) / fullData.length, 0)
    // }), {}) || {}

    // const camposFormatos = totalizeColumns?.reduce((a, c) => ({
    //     ...a,
    //     [c.column]: c.format != undefined ? c.format : (val) => val
    // }), {}) || {}

    // const totales = totalizeColumns?.filter(c =>
    //     Array.isArray(c.operation) ?
    //         [...c.operation].includes('sum') : c.operation == 'sum').map(c => c.column) || []


    // const totales = totalizeColumns?.filter(c =>
    //     Array.isArray(c.operation) ?
    //         [...c.operation].includes('sum') : c.operation == 'sum').map(c => c.column) || []

    // const promedios = totalizeColumns?.filter(c =>
    //     Array.isArray(c.operation) ?
    //         [...c.operation].includes('avg') : c.operation == 'avg').map(c => c.column) || []

    return <GridFooterContainer>
        <div className="w-100 row">
            {(totalize && fullData.length > 0) && <div className="d-flex align-items-center m-3">
                <div className="p-2 d-flex flex-column gap-2">
                    <div className="has-text-weight-semibold">Oper/Col</div>
                    <div className="has-text-weight-semibold">Totales:</div>
                    {/* <div className="has-text-weight-semibold">Promedios:</div> */}
                </div>
                {<div className="d-flex overflow-auto ">
                    {columns.map((c, i) => (c.field) &&
                        <div key={i} className="p-3 d-flex flex-column text-center gap-1">
                            <h6>{c.field}</h6>
                            <div>{camposSumados[c.field]}</div>
                            {/* {promedios.length > 0 && <div>
                                {promedios.includes(c.field) ? camposFormatos[c.field](camposPromediados[c.field]) : '-'}
                            </div>} */}
                        </div>)}
                </div>}
            </div>}

            {pagination && <GridPagination
                {...props}
                page={paginationModel.page}
                count={apiRef.current.getRowsCount()}
                onChange={(e, newPage) => apiRef.current.setPage(newPage)}
            />}
        </div>
    </GridFooterContainer>
}

const DataGridComp = ({ addFilter = true, pagination = true, PermisoID, Exportar = true, ...props }: IntTable) => {
    // SON LAS VARIABLES PARA CONTROLAR EL USO DE LOS DATOS Y COLUMNAS
    const [columns, setColumns] = useState<any[]>(props.columns || [])
    // const [datosMostrar, setDatosMostrar] = useState<any[]>([])
    const [datos, setDatos] = useState<any[]>([])
    const [filtro, setFiltro] = useState('')
    const [Cols, setCols] = useState<any[]>(props.columns || [])

    /**
     * @returns array de columnas formateadas para MUI
     */
    const thisColumns = (fnData = { columns: props.columns, data: props.data }) => {
        if ((fnData.columns?.length || 0) == 0 && fnData.data.length > 0) {
            const cols = Object.keys(fnData.data[0]);
            setColumns(cols.map(v => ({ selector: v, name: v })))

            return Object.keys(fnData.data[0]).map((v, i) => ({
                field: v,
                headerName: v,
                center: true,
                // width: 100,
                flex: 1,
                minWidth: 120,
                renderCell: (row: any = {}) => row.value
            }))
        }

        setColumns(fnData.columns || [])
        return (fnData.columns || []).map(c => ({
            ...c,
            field: c.selector,
            headerName: c.name,
            flex: 1,
            minWidth: 120,
        }))
    }



    useEffect(() => {
        const dat = props.data.map((reg, ind) => ({ ...reg, i: ind }))
        setDatos(dat)
        setCols(thisColumns())
    }, [props.data, props.columns]);


    const datosMostrar = useMemo(() => {
        console.log("M: DT: UPDATE DATOS")
        props.extractCsvData && props.extractCsvData(datos)
        return FiltrarDatos(datos, columns, filtro)
    }, [datos, columns, filtro])

    // 

    return (<>
        <TableStateContext.Provider value={{
            addFilter,
            filtro,
            setFiltro,
            fullData: datos,
            tableTitle: props.tableTitle,
            PermisoID,
            Exportar,
            columns: Cols,
            totalizeColumns: props.totalizeColumns,
            totalize: props.totalize,
            pagination: pagination,
            chargeCsvData: (props.chargeCsvData || false),
            setDatos,
            setCols,
            getJsonCols: thisColumns
        }}>
            <DataGrid
                columns={Cols}
                density="compact"
                className="mt-5"
                rows={datosMostrar}
                keepNonExistentRowsSelected
                getRowId={(row) => props.rowId ? row[props.rowId] : row['i']}
                disableColumnFilter
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                pageSizeOptions={[10, 20, 30, 40, 50, 60]}
                checkboxSelection={props.selectedRows != undefined && props.onRowSelected != undefined}
                rowSelectionModel={props.selectedRows}
                onRowSelectionModelChange={props.onRowSelected}
                slots={{ toolbar: CustomToolbar, footer: CustomFooter }}
            />
        </TableStateContext.Provider>

    </>)
}


export default DataGridComp