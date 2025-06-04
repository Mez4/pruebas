import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CajasUsuarios/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaKey, FaUserCheck, FaUserTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CajasUsuarios/CForm'
import { FiRefreshCcw, FiUserPlus } from 'react-icons/fi'
import { FaExchangeAlt } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Tesoreria } from '../../../../../interfaces_db/DBConfia/Tesoreria'
import { toast } from 'react-toastify'

import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type CatalogosType = {
    oidc: IOidc
}

const CajasUsuarios = (props: CatalogosType) => {
    const MySwal = withReactContent(Swal)
    let isMounted = React.useRef(true)
    const DatosDefecto = { UsuarioID: 0 }
    const DatosDetalleDefecto = { CajaID: 0, UsuarioID: 0, Activo: true, PuedeDesembolsar: true }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const DatosDetalle: DBConfia_Tesoreria.ICatalogoCajasUsuarios_VW[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        DatosDetalle,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        FormDetalle:
        {
            Mostrar: false,
            Datos: DatosDetalleDefecto,
            Id: 0
        },
        Detalle: false,
        // Traspasar: false,
        CajaID: 0
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetUsers(props.oidc)
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

    const FNGetDetalle = (UsuarioID: number) => {
        Funciones.FNGet(props.oidc, UsuarioID)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Detalle: true, DatosDetalle: respuesta, FormDetalle: { ...state.FormDetalle, Id: UsuarioID } }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Detalle: false, DatosDetalle: [], FormDetalle: { ...state.FormDetalle, Id: 0 } }))
                // }
            })
    }

    const FnCambiarEstt = (CajaID: number, UsuarioID: number, Activo: boolean, PuedeDesembolsar: boolean) => {
        Funciones.FNUpdate(props.oidc, { CajaID, UsuarioID, Activo, PuedeDesembolsar })
            .then((respuesta: any) => {
                toast.success('Se cambio el acceso a la caja')
                cbActualizarDetalle(respuesta)
            })
            .catch(() => {
                toast.error("Ocurrio un Error, vuelva a intentarlo.")
            })
    }

    // const Columns = React.useMemo(() => {
    const Columns: IDataTableColumn[] =
        [
            { name: 'Id', selector: 'UsuarioID', sortable: true, },
            { name: 'Nombre', selector: 'NombreCompleto', sortable: true, },
            { name: 'Correo', selector: 'Correo', sortable: true, },
            { name: 'Estatus', selector: 'Bloqueado', sortable: true, cell: (props) => <span>{props.Bloqueado ? "Inactivo" : "Activo"}</span> },
            {
                name: 'Acciones', sortable: false,
                cell: (data) =>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button title='Permiso a Caja' data-tip data-for={`PermisosTooltip${data.UsuarioID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {
                            FNGetDetalle(data.UsuarioID)
                        }}>
                            <FaKey />
                        </button>
                        <ReactTooltip id={`PermisosTooltip${data.UsuarioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Permiso a Caja
                        </ReactTooltip>
                    </div>
            },
        ]
    //     return colRet
    // }, [])

    // const DetailColumns = React.useMemo(() => {
    const DetailColumns: IDataTableColumn[] =
        [
            { name: 'Id', width: '10%', selector: 'CajaID', sortable: true },
            { name: 'Nombre', width: '25%', selector: 'Nombre', sortable: true },
            { name: 'Sucursal', width: '20%', selector: 'Sucursal', sortable: true },
            { name: 'Estatus', width: '10%', selector: 'Estatus', sortable: true, cell: (props) => <span>{props.Estatus ? "Activo" : "Inactivo"}</span> },
            // { name: 'Numero Cuenta', selector: 'NumeroCuenta', sortable: true },
            { name: 'Acceso', width: '10%', selector: 'Activo', sortable: true, cell: (props) => <span>{props.Activo ? "Si" : "No"}</span> },
            {
                name: 'Permiso Lectura', width: '10%', sortable: false,
                cell: (data) =>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button data-tip data-for={`EstTooltip${data.CajaID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {
                            MySwal.fire({
                                // title: '<strong>Permiso Caja</strong>',
                                icon: 'question',
                                html:

                                    <div className="text-center">
                                        <h2>
                                            {data.Activo ? 'Quitar Caja' : 'Agregar Caja'}
                                        </h2>
                                        {data.Activo ? 'Se desactivara el permiso a la caja ¿Desea continuar?' : 'Se activara el permiso a la caja ¿Desea continuar?'}
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: true,
                                showConfirmButton: true,
                                focusConfirm: false,
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Aceptar',
                                confirmButtonAriaLabel: 'Aceptar',
                                cancelButtonAriaLabel: ''
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    FnCambiarEstt(data.CajaID, data.UsuarioID, data.Activo ? false : true, data.PuedeDesembolsar)
                                }
                            })
                        }}>
                            {!data.Activo && <FaUserTimes style={{ color: '#FF5733' }} />}
                            {data.Activo && <FaUserCheck style={{ color: '#23C532' }} />}

                        </button>
                        <ReactTooltip id={`EstTooltip${data.CajaID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            {data.Activo ? 'Desactivar' : 'Activar'}
                        </ReactTooltip>
                    </div>
            },
            {
                name: 'Puede Desembolsar', width: '10%', sortable: false,
                cell: (data) =>
                    <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                        <button data-tip data-for={`EstTooltip${data.CajaID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {
                            MySwal.fire({
                                // title: '<strong>Permiso Desembolsar</strong>',
                                icon: 'question',
                                html:
                                    <div className="text-center">
                                        <h2>
                                            {data.PuedeDesembolsar ? 'Quitar Permiso' : 'Agregar Permiso'}
                                        </h2>
                                        {data.PuedeDesembolsar ? 'Se desactivara el permiso para desembolsar ¿Desea continuar?' : 'Se activara el permiso para desembolsar ¿Desea continuar?'}
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: true,
                                showConfirmButton: true,
                                focusConfirm: false,
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Aceptar',
                                confirmButtonAriaLabel: 'Aceptar',
                                cancelButtonAriaLabel: ''
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    FnCambiarEstt(data.CajaID, data.UsuarioID, data.Activo, data.PuedeDesembolsar ? false : true)
                                }
                            })
                        }}>
                            {!data.PuedeDesembolsar && <FaTimesCircle style={{ color: '#FF5733' }} />}
                            {data.PuedeDesembolsar && <FaCheckCircle style={{ color: '#23C532' }} />}
                        </button>
                        <ReactTooltip id={`EstTooltip${data.CajaID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            {data.Activo ? 'Desactivar' : 'Activar'}
                        </ReactTooltip>

                    </div>
            }
        ]
    //     return colRet
    // }, [])
    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
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
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion Callback al actualizar un item */
    // const cbActualizar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.CajaID === item.CajaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    const cbAgregarDetalle = (item: any) =>
        setState({ ...state, DatosDetalle: [...state.DatosDetalle, item] })

    const cbActualizarDetalle = (item: any) => {
        setState({ ...state, DatosDetalle: state.DatosDetalle.map(Dato => Dato.CajaID === item.CajaID && Dato.UsuarioID === item.UsuarioID ? item : Dato) })
    }
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Permisos Cajas">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    {/* <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div> */}
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar usuarios" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus />
                                                        </button> */}
                                                        <button title='Actualizar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        keyField={"UsuarioID"}
                                        defaultSortField={"UsuarioID"}
                                        columns={Columns}
                                    />
                                    {/* <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Cajas" : "Agregar Cajas"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar} />
                                        </ModalWin.Body>
                                    </ModalWin> */}

                                    <ModalWin open={state.Detalle} scrollable large center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Permisos Cajas"}
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => setState({ ...state, Detalle: false })} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.FormDetalle.Datos}
                                                Id={state.FormDetalle.Id}
                                                cbActualizar={cbActualizarDetalle}
                                                cbGuardar={cbAgregarDetalle}
                                            />
                                            <br />
                                            <DataTable
                                                data={state.DatosDetalle}
                                                striped
                                                // pagination
                                                dense
                                                noHeader
                                                responsive
                                                keyField={"CajaID"}
                                                defaultSortField={"CajaID"}
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
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CajasUsuarios)