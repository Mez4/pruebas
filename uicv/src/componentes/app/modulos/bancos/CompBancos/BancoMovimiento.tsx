import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoMovimiento/Funciones'
import * as FnCuentas from './BancoCuenta/Funciones'
import Select from 'react-select'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'

// import ModalWin, { MODAL_TITLE_CLASS } from '../../../global/ModalWin'

// Icons
import { FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
// import { CForm } from './BancoMovimiento/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

registerLocale("es", es)

const BancoMovimiento = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        MovimientoID: 0,
        CuentaID: 0,
        FechaAfectacion: '',
        FechaCaptura: '',
        Importe: 0,
        Observaciones: '',
        TipoMovimientoID: 0,
        RefApl: 0,
        UsuarioIDRegistra: 0,
        CorresponsalId: 0,
        gastosRubroID: 0,
        gastoSucursal: 0,
        movimientoIdTraspaso: 0,
        corteId: 0,
        cancelacionObservacion: '',
        cancelacionUsuario: 0,
        cancelacionImporte: 0,
        cancelacionFhRegistro: '',
        cancelacionTipMovimiento: 0,
        balanceCierreId: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        optCuentas,
        startDate: null,
        endDate: null
    })

    const CambioFecha = (stri: any, strf: any) => {
        let data: any[] = []
        let fini: any = new Date(stri)
        let ffin: any = new Date(strf)

        console.log('fini: ', fini.valueOf())
        console.log('ffin: ', ffin.valueOf())

        if (fini.valueOf() === 0 && ffin.valueOf() === 0) {

            data = state.Datos

            setState(s => ({ ...s, DatosMostrar: data, startDate: null, endDate: null }))

        } else {

            if (fini.valueOf() > 0 && ffin.valueOf() === 0) {

                const filtro = function (obj: any) {
                    let date
                    let arr = obj.FechaCaptura.split("/")
                    date = new Date(arr[2], arr[1] - 1, arr[0]);
                    return (date.valueOf()) >= fini.valueOf();
                };

                data = state.Datos.filter(filtro);

                setState(s => ({ ...s, DatosMostrar: data, startDate: fini, endDate: null }))

            } else {

                if (fini.valueOf() === 0 && ffin.valueOf() > 0) {

                    const filtro = function (obj: any) {
                        let date
                        let arr = obj.FechaCaptura.split("/")
                        date = new Date(arr[2], arr[1] - 1, arr[0]);
                        return (date.valueOf()) <= ffin.valueOf();
                    };

                    data = state.Datos.filter(filtro);

                    setState(s => ({ ...s, DatosMostrar: data, startDate: null, endDate: ffin }))

                } else {

                    const filtro = function (obj: any) {
                        let date
                        let arr = obj.FechaCaptura.split("/")
                        date = new Date(arr[2], arr[1] - 1, arr[0]);
                        return (date.valueOf()) >= fini.valueOf() && (date.valueOf()) <= ffin.valueOf();
                    };

                    data = state.Datos.filter(filtro);

                    setState(s => ({ ...s, DatosMostrar: data, startDate: fini, endDate: ffin }))

                }
            }
        }
    }

    const FechaInicial = (fecha: any) => {

        CambioFecha(fecha, state.endDate)

    }

    const FechaFinal = (fecha: any) => {

        CambioFecha(state.startDate, fecha)

    }

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))

        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const FnGetCuentas = () => {
        FnCuentas.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var cuentas = respuesta.map((valor: any) => {
                    var obj = { value: valor.CuentaID, label: `${valor.Cuenta}-${valor.NombreCuenta}` };
                    return obj
                });

                setState(s => ({ ...s, optCuentas: cuentas }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optCuentas: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'MovimientoID', sortable: true, },
                { name: 'Cuenta', selector: 'Cuenta.Cuenta', sortable: true, },
                { name: 'Fecha Afectación', selector: 'FechaAfectacion', sortable: true },
                { name: 'Fecha Captura', selector: 'FechaCaptura', sortable: true, },
                { name: 'Importe', selector: 'Importe', sortable: true, },
                { name: 'Observaciones', selector: 'Observaciones', sortable: true, },
                { name: 'Tipo Movimiento', selector: 'TipoMovimiento.TipoMovimiento', sortable: true, },
                { name: 'Referencia Aplicación', selector: 'RefApl', sortable: true, },
                { name: 'Corresponsal', selector: 'Corresponsal.CorresponsalDesc', sortable: true, },
                { name: 'Gasto Rubro', selector: 'GastoRubro.gastosRubroDesc', sortable: true, },
                { name: 'Sucursal', selector: 'Sucursal.Nombre', sortable: true, },
                { name: 'Observación Cancelación', selector: 'cancelacionObservacion', sortable: true, },
                { name: 'Importe Cancelación', selector: 'cancelacionFhRegistro', sortable: true, },
                { name: 'Fecha Cancelación', selector: 'cancelacionImporte', sortable: true, },
                // {
                //     name: 'Acciones', sortable: false,
                //     cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s,
                //                 Form: {
                //                     ...s.Form, Mostrar: true,
                //                     Datos: {},
                //                     Id: props.DispersionID
                //                 }
                //             }))
                //         }}>
                //             <FaPencilAlt />
                //         </button>
                // },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
            FnGetCuentas()
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

    //  /** funcion Callback al agregar un item */
    //  const cbAgregar = (item: any) => 
    //     setState({ ...state, Datos: [...state.Datos, item], 
    //     Form: { ...state.Form, Mostrar: false, 
    //         Datos: {} 
    //     } })

    // /** funcion Callback al actualizar un item */
    // const cbActualizar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.DispersionID === item.DispersionID ? item : Dato), Form: { ...state.Form, Mostrar: false, 
    //         Datos: {} } })

    // /** funcion para cancelar la forma */
    // const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Movimientos de Cuentas">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-4">
                                                <Select options={[{ value: 0, label: 'Seleccionar Cuenta' }, ...state.optCuentas]} placeholder="Filtrar Cuenta" onChange={e => {
                                                    let data = state.Datos.filter(x => x.Cuenta.CuentaID === e.value)
                                                    setState(s => ({ ...s, DatosMostrar: data }))
                                                }} />
                                            </div>
                                            <div className="col-2"></div>
                                            <div className="col-3" >
                                                <DatePicker className="form-control" selected={state.startDate} selectsStart startDate={state.startDate} endDate={state.endDate} isClearable placeholderText="Fecha Captura Inicial" onChange={FechaInicial} locale="es" dateFormat="dd/MM/yyyy" />
                                            </div>
                                            <div className="col-3">
                                                <DatePicker className="form-control" selected={state.endDate} selectsEnd endDate={state.endDate} minDate={state.startDate} isClearable placeholderText="Fecha Captura Final" onChange={FechaFinal} locale="es" dateFormat="dd/MM/yyyy" />
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar movimientos" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button> */}
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"MovimientoID"}
                                        defaultSortField={"MovimientoID"}
                                        columns={Columns}
                                    />
                                    {/* <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                            {state.Form.Id ? "Editar dispersión" : "Agregar dispersión"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optBancos={state.optBancos}                                          />
                                        </ModalWin.Body>
                                    </ModalWin> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(BancoMovimiento)