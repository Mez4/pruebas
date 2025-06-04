import React, { useEffect } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './MultisaldosV2/Funciones'
import { toast } from 'react-toastify'
import { ErrorMessage, Field, Formik } from 'formik'
import { Form } from 'usetheform'
import XLSX from "xlsx";



// Icons
import { FaClone, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card, Spinner } from '../../../../global'
import { CForm } from './CuentaMovimientosCuenta/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import { FormateoDinero } from '../../../../../global/variables'

type CatalogosType = {
    oidc: IOidc
}

const MultiSaldosV2 = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        NumeroCuentaPrincipal: '',
        DescripcionCuentaPrincipal: '',
        CuentaBancoID: 0,
        NumeroCuenta: '',
        DescripcionCuenta: '',
        SucursalID: 0,
        ProductoID: 0,
        TipoCuenta: '',
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptPrincipales: any[] = []
    const OptSucursales: any[] = []
    const OptProductos: any[] = []
    const [SaldoReal, setSaldoReal] = React.useState(0)


    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        CuentaBancariaPrincipalID: 0,
        OptPrincipales,
        OptSucursales,
        OptProductos,
        DatosExcel: [],
        CuentaBancoID: 0,
        BalanceID: 0,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })


    const fngetMultisaldosCuenta = (id: any) => {
        Funciones.FNGetMultiSaldosCuentas(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("RESPUESTA ,", respuesta)
                    setSaldoReal(respuesta.saldoTotalCuenta)
                    var Excelit = respuesta.map((valor: any) => ({
                        CuentaID: valor.CuentaID,
                        Cuenta: valor.Cuenta,
                        Cargos: valor.Cargos,
                        Abonos: valor.Abonos,
                        SaldoEnMovs: valor.SaldoEnMovs,
                        SALDOACTUAL: valor.SALDOACTUAL,
                        TOTAL: valor.TOTAL,
                    }));
                    setState(s => ({
                        ...s,
                        Cargando: false,
                        Error: false,
                        Datos: respuesta,
                        DatosExcel: Excelit

                    }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setSaldoReal(0)
                }
            })
    }

    const FNGetLocal = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, id)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("RESPUESTAAAAA", respuesta)
                    console.log("Cuenta seleccionada ,", id)
                    fngetMultisaldosCuenta(id)
                    var Excelit = respuesta.map((valor: any) => ({
                        CuentaID: valor.CuentaID,
                        Cuenta: valor.Cuenta,
                        Cargos: valor.Cargos,
                        Abonos: valor.Abonos,
                        SaldoEnMovs: valor.SaldoEnMovs,
                        SALDOACTUAL: valor.SALDOACTUAL,
                        TOTAL: valor.TOTAL,
                    }));
                    setState(s => ({
                        ...s,
                        Cargando: false,
                        Error: false,
                        Datos: respuesta,
                        DatosExcel: Excelit
                    }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetPrincipal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetPrincipales(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var principales = respuesta.map((valor: any) => {
                        var obj = { value: valor.BalanceID, label: valor.BalanceID + " - " + valor.NombreBalance + " - " + valor.NumeroBalance };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptPrincipales: principales }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptPrincipales: [] }))
                }
            })
    }

    const FNGetSucursales = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var principales = respuesta.map((valor: any) => {
                        var obj = { value: valor.SucursalID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptSucursales: principales }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptSucursales: [] }))
                }
            })
    }
    const FNGetProductos = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetProductos(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var principales = respuesta.map((valor: any) => {
                        var obj = { value: valor.ProductoID, label: valor.Producto };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptProductos: principales }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptProductos: [] }))
                }
            })
    }
    const generarXLSX = () => {
        toast.success("Excel Generado");

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

        var range = XLSX.utils.decode_range(ws["!ref"]);
        var noRows = range.e.r; // No.of rows
        var noCols = range.e.c; // No. of cols

        for (let i in ws) {
            if (typeof ws[i] != "object") continue;
            let cell = XLSX.utils.decode_cell(i);
            if (cell.r === 0) {
                ws[i].s = styleHeader;
            }
        }

        XLSX.writeFile(wb, "Balance.xlsx");

    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'CuentaID ',
                selector: 'CuentaID',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.CuentaID}</span>

            },
            {
                name: 'Cuenta',
                selector: 'Cuenta',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.Cuenta}</span>
            },
            {
                name: 'Cargos',
                selector: 'Cargos',
                sortable: false,
                center: true,
                format: row => FormateoDinero.format(row.Cargos)
            },
            {
                name: 'Abonos',
                selector: 'Abonos',
                sortable: false,
                center: true,
                format: row => FormateoDinero.format(row.Abonos)
            },
            {
                name: 'SaldoEnMovs',
                selector: 'SaldoEnMovs',
                sortable: false,
                center: true,
                format: row => FormateoDinero.format(row.SaldoEnMovs)
            },
            {
                name: 'SALDOACTUAL',
                selector: 'SALDOACTUAL',
                sortable: false,
                center: true,
                format: row => FormateoDinero.format(row.SALDOACTUAL)
            },
            {
                name: 'TOTAL',
                selector: 'TOTAL',
                sortable: false,
                center: true,
                format: row => FormateoDinero.format(row.TOTAL)
            },
        ]

    React.useEffect(() => {
        FNGetPrincipal()
        // FNGetSucursales()
        //FNGetProductos()
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
        toast.success('La cuenta se agrego correctamente')

        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false, Datos: {
                    NumeroCuentaPrincipal: '',
                    DescripcionCuentaPrincipal: '',
                    CuentaBancoID: 0,
                    NumeroCuenta: '',
                    DescripcionCuenta: '',
                    SucursalID: 0,
                    ProductoID: 0,
                    TipoCuenta: '',
                }
            }
        })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {

        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.TipoID === item.TipoID ? item : Dato), Form: {
                ...state.Form, Mostrar: false, Datos: {
                    NumeroCuentaPrincipal: '',
                    DescripcionCuentaPrincipal: '',
                    CuentaBancoID: 0,
                    NumeroCuenta: '',
                    DescripcionCuenta: '',
                    SucursalID: 0,
                    ProductoID: 0,
                    TipoCuenta: '',
                }
            }
        })
        toast.success('La cuenta se actualizó correctamente')
    }


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({
        ...state, Form: {
            ...state.Form, Mostrar: false, Datos: {
                NumeroCuentaPrincipal: '',
                DescripcionCuentaPrincipal: '',
                CuentaBancoID: 0,
                NumeroCuenta: '',
                DescripcionCuenta: '',
                SucursalID: 0,
                ProductoID: 0,
                TipoCuenta: '',
            }
        }
    })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="MultisaldosV2">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={state.Datos}
                                enableReinitialize
                                onSubmit={(values: any) => {
                                }}>
                                <Form>

                                    <div className="column is-full-desktop is-full-mobile is-full-tablet" style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                        <div className="row">
                                            {/* <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center mt-4">
                                                <h3>Total de la cuenta: {FormateoDinero.format(SaldoReal)} </h3>
                                            </div> */}
                                            <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center ">

                                                <Field name={"CuentaBancoID"} className="form-select"  >
                                                    {({ field }) => (
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Seleccione un balance:"
                                                            name="BalanceID"
                                                            placeholder={'Seleccione un balance'}
                                                            options={state.OptPrincipales.map((optn, index) => ({ value: optn.value, label: optn.label }))}
                                                            addDefault={true}
                                                            valor={state.BalanceID}
                                                            accion={(value: any) => {
                                                                //IF > 0
                                                                if (value > 0) {
                                                                    setState(s => ({ ...s, CuentaBancoID: value }))
                                                                    FNGetLocal(value)
                                                                }
                                                                else {
                                                                    setState(s => ({ ...s, CuentaBancoID: 0, Datos: [], }))
                                                                }

                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage component="div" name={"CuentaBancoID"} className="text-danger" />

                                                <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                                                    <div className="text-end">
                                                        {<button disabled={true ? false : true} type={"button"} className={"btn btn-success waves-effect waves-light"} onClick={() => {
                                                            generarXLSX()
                                                        }}>
                                                            <span>Excel</span>&nbsp;<FaPrint />
                                                        </button>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Form>
                            </Formik>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div className='mt-3'>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader

                                        subHeaderComponent={
                                            <div className="row">
                                                <div className="input-group pb-3 mb-10">
                                                    <input type="text" className="form-control" placeholder="Buscar tipo de cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                    <span className="input-group-text"><FaSearch /> </span>
                                                    {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal(state.CuentaBancariaPrincipalID)}><FiRefreshCcw /></button> */}
                                                </div>
                                            </div>
                                        }
                                        noDataComponent={
                                            <div className="text-center">
                                                Selecciona un balance
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"CuentaID"}
                                        defaultSortField={"defaultSortField"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Replicar cuenta</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                OptSucursales={state.OptSucursales}
                                                OptProductos={state.OptProductos}
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
export default connect(mapStateToProps, mapDispatchToProps)(MultiSaldosV2);