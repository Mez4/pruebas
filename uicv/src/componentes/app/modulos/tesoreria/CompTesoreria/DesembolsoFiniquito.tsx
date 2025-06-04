import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './DesembolsoFiniquito/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnPersona from '../../general/CompGeneral/Empleado/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './DesembolsoFiniquito/CForm'
import { Desembolsar } from './DesembolsoFiniquito/Desembolsar'
import { CambiarCuenta } from './DesembolsoFiniquito/CambiarCuenta'
import { FiRefreshCcw } from 'react-icons/fi'
import { FaCashRegister, FaExchangeAlt } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../global/functions'

import ReactTooltip from 'react-tooltip';
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc
}

const DesembolsoFiniquito = (props: CatalogosType) => {
    const MySwal = withReactContent(Swal)
    let isMounted = React.useRef(true)
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
    const DatosDefecto = { SucursalID: 0, SACId: 0, CuentaBancoID: 0, Todos: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optSucursales: any[] = []
    const optEmpleados: any[] = []
    const Empleados: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form: DatosDefecto,
        // Distribuidores: [] as number[],
        Empleados,
        optSucursales,
        optEmpleados,
        loading: false
    })

    const fnGetSucursales = () => {
        setState(s => ({ ...s, Cargando: true }))
        FnSucursales.FNGet(props.oidc)
            .then((respuesta: any) => {

                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, Cargando: false, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, optSucursales: [] }))
            })
    }

    const fnGetEmpleados = (SucursalID: number, Nombre: string, callback: any) => {
        if (SucursalID! > 0) {

            let Datos = { SucursalID, Nombre }

            FnPersona.FNGetBySucursal(props.oidc, Datos)
                .then((respuesta: any) => {

                    var empleados = respuesta.map((valor: any) => {
                        var obj = { value: valor.PersonaID, label: valor.PersonaID + ' - ' + valor.NombreCompleto };
                        return obj
                    });

                    setState(s => ({ ...s, optEmpleados: empleados, Empleados: respuesta }))

                    callback(empleados)
                })
                .catch(() => {
                    setState(s => ({ ...s, optEmpleados: [], Empleados: [] }))

                    callback([])
                })
        }
    }

    // const FNDesembolsar = (Id: number) => {
    //     Funciones.FNDesembolsar(props.oidc, { SolicitudID: Id, ProductoId: 1, TipoDesembolsoID: 87 })
    //         .then((respuesta: any) => {
    //             if (respuesta.res == 1) {
    //                 toast.success(respuesta.msj)
    //                 cbActualizar(respuesta.Data)
    //             }
    //             else {
    //                 toast.warning(respuesta.msj)
    //             }
    //         })
    //         .catch(() => {
    //             toast.error("Error al desembolsar el finiquito, vuelva a intentarlo.")
    //         })
    // }

    const cerrarSwal = () => {
        MySwal.close();
    }

    const Columns: IDataTableColumn[] =
        [
            { name: 'Id Solicitud', selector: 'Id', sortable: true, },
            { name: 'CIA', selector: 'Cia', sortable: true, },
            { name: 'Id Empleado', selector: 'SACId', sortable: true },
            { name: 'Nombre', selector: 'NombreCompleto', sortable: true },
            { name: 'Sucursal', selector: 'Sucursal', sortable: true },
            { name: 'Cuenta', selector: 'NumeroCuenta', sortable: true },
            {
                name: 'Importe', selector: 'Importe', sortable: true, format: row => formatter.format(row.Importe), style: {
                    fontWeight: 'bold',
                }
            },
            { name: 'Fecha Registro', width: '110px', selector: 'FechaCreo', sortable: true, cell: (props) => <span>{moment(props.FechaCreo).format('DD/MM/YYYY')}</span> },
            { name: 'Desembolsado', selector: 'Desembolsado', sortable: true, cell: (props) => <span>{props.Desembolsado ? "SI" : "No"}</span> },
            { name: 'Fecha Desembolso', width: '110px', selector: 'FechaDesembolso', sortable: true, cell: (props) => <span>{props.FechaDesembolso ? moment(props.FechaDesembolso).format('DD/MM/YYYY') : ''}</span> },
            {
                name: 'Acciones', sortable: false,
                cell: (data) =>
                    <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button disabled={data.Desembolsado ? true : false} data-tip="true" data-for={`DesembolsoTooltip${data.Id}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            MySwal.fire({
                                showCloseButton: true,
                                html: <div>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Desembolsar Finiquito</h5>
                                    </div>
                                    <div className={`modal-body`}>
                                        <Desembolsar
                                            isMounted={isMounted.current}
                                            cbActualizaDatos={cbActualizar}
                                            cerrarSwal={cerrarSwal}
                                            Seguridad={props.oidc}
                                            initialValues={{
                                                ProductoId: data.ProductoID,
                                                SolicitudID: data.Id,
                                                SucursalID: data.SucursalID,
                                                TipoDesembolsoID: 0,
                                                CajaID: 0
                                            }}
                                        />
                                    </div>
                                </div>,
                                showCancelButton: false,
                                showConfirmButton: false,
                            })
                            // MySwal.fire({
                            //     title: '<strong>Desembolsar Finiquito</strong>',
                            //     icon: 'question',
                            //     html:
                            //         <div className="text-center">
                            //             Se desembolsara el finiquito ¿Desea continuar?
                            //         </div>,
                            //     showCloseButton: false,
                            //     showCancelButton: true,
                            //     showConfirmButton: true,
                            //     focusConfirm: false,
                            //     cancelButtonText: 'Cancelar',
                            //     confirmButtonText: 'Aceptar',
                            //     confirmButtonAriaLabel: 'Aceptar',
                            //     cancelButtonAriaLabel: ''
                            // }).then((result) => {
                            //     if (result.isConfirmed) {
                            //         FNDesembolsar(data.Id)
                            //     }
                            // })
                        }}>
                            <FaCashRegister />
                        </button>
                        <ReactTooltip id={`DesembolsoTooltip${data.Id}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Desembolsar Finiquito
                        </ReactTooltip>
                        &nbsp;
                        <button disabled={data.Desembolsado ? true : false} data-tip="true" data-for={`CambiaCtaTooltip${data.Id}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            MySwal.fire({
                                showCloseButton: true,
                                html: <div>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Cambiar Cuenta</h5>
                                    </div>
                                    <div className={`modal-body`}>
                                        <CambiarCuenta
                                            isMounted={isMounted.current}
                                            cbActualizaDatos={cbActualizar}
                                            cerrarSwal={cerrarSwal}
                                            Seguridad={props.oidc}
                                            initialValues={{
                                                ProductoId: data.ProductoID,
                                                SolicitudID: data.Id,
                                                SucursalID: data.SucursalID,
                                                CuentaBancoID: data.CuentaBancoID
                                            }}
                                        />
                                    </div>
                                </div>,
                                showCancelButton: false,
                                showConfirmButton: false,
                            })
                        }}>
                            <FaExchangeAlt />
                        </button>
                        <ReactTooltip id={`CambiaCtaTooltip${data.Id}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Cambiar Cuenta
                        </ReactTooltip>
                    </div>
            },
        ]

    React.useEffect(() => {
        if (isMounted.current === true) {
            fnGetSucursales()
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
    // const cbAgregar = (item: any) =>
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.Id === item.Id ? item : Dato), Form: DatosDefecto })

    const cbSolicitudes = (item: any) => {
        // console.log('item: ', item)
        setState(s => ({ ...s, Datos: item }))
    }

    return (
        // <div className="row">
        //     <div className="col-12">
        <Card Title="Desembolsos Finiquitos">
            <Card.Body>
                <Card.Body.Content>
                    {state.Cargando && <Spinner />}
                    {state.Error && <span>Error al cargar los datos...</span>}
                    {!state.Cargando && !state.Error &&
                        <div>
                            <CForm
                                oidc={props.oidc}
                                initialValues={state.Form}
                                cbSolicitudes={cbSolicitudes}
                                fnGetEmpleados={fnGetEmpleados}
                                optSucursales={state.optSucursales}
                                optEmpleados={state.optEmpleados}
                            />
                            <DataTable
                                subHeader
                                subHeaderComponent=
                                {
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" placeholder="Buscar desembolso" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                <span className="input-group-text"><FaSearch /></span>
                                                {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                            </div>
                                        </div>
                                    </div>
                                }
                                data={state.DatosMostrar}
                                // selectableRows
                                // onSelectedRowsChange={}
                                // selectableRowSelected={rowSelectCritera}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"Id"}
                                defaultSortField={"Id"}
                                columns={Columns}
                            />
                        </div>
                    }
                </Card.Body.Content>
            </Card.Body>
        </Card>
        //     </div>
        // </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(DesembolsoFiniquito)