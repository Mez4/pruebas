import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CompCatalogoPermisos/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

// Modelos de base de datos
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../global/variables'
import { DBConfia_Sistema } from '../../../../../interfaces_db/DBConfia/Sistema'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoPermisosExcel = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { EstadoCivilID: '', EstadoCivil: '' }
    const Datos: DBConfia_Sistema.IPermisos_VW[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Item: undefined as DBConfia_Sistema.IPermisos_VW | undefined,
        MostrarForm: false
    })

    const FNGetLocal = async () => {

        // Cargando
        setState(s => ({ ...s, Cargando: true }))

        try {
            // Hacemos la consulta al servicio web
            const Datos = (await axios.get(`${GetServerUrl()}Sistema/Permisos`, GenerarCabeceraOIDC(props.oidc))).data

            // Definimos el estado
            setState(e => ({ ...e, Cargando: false, Datos }))
        }
        catch (error) {
            // Definimos el estado
            setState(e => ({ ...e, Cargando: false, Datos: [], Error: true }))
        }
    }

    // Eliminamos un rol (Confirmar)
    const FNEliminar = async (permiso: DBConfia_Sistema.IPermisos_VW) => {

        // Generamos el gestor de alertas
        const MySwal = withReactContent(Swal)

        // Mostramos el dialogo de confirmación
        MySwal.fire({
            html:
                <div className='text-center my-2'>
                    <p className='is-size-5'>¿Desea continuar eliminando el permiso <strong>{permiso.PermisoNombre}</strong>?</p>
                    <p className='is-size-7'>Esta accion eliminara el permiso y lo quitara de todos los roles, impidiendo su uso</p>
                    <p><strong>Esta accion no es reversible</strong></p>
                    <p><strong>{MySwal.isLoading}</strong></p>
                </div>,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'No',
            confirmButtonText: 'Eliminar',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: async () => {

                // Hacemos la petición a servidor para eliminar el rol con sus permisos
                try {
                    let respuesta = await axios.delete(`${GetServerUrl()}Sistema/Permisos/${permiso.PermisoID}`, GenerarCabeceraOIDC(props.oidc))
                    return respuesta.data
                }
                catch {
                    MySwal.showValidationMessage('Ocurrio un error al eliminar el permiso')
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    html:
                        <div className='text-center my-2'>
                            <p className='is-size-5'>Eliminado</p>
                            <p className='is-size-7'>El rol ha sido eliminado, valide el acceso a las pantallas de los usuarios</p>
                        </div>,
                    icon: 'success'
                })

                await FNGetLocal()
            }
        })
    }

    const Columns = [
        // { name: 'Id', selector: 'Id', sortable: true, },
        { name: 'Id', selector: 'PermisoID', sortable: true },
        { name: 'Modulo', selector: 'ModuloNombre', sortable: true },
        { name: 'Pantalla', selector: 'PantallaNombre', sortable: true },
        { name: 'Permiso', selector: 'PermisoNombre', sortable: true },
        {
            name: 'Acciones', sortable: false,
            cell: (cprops: DBConfia_Sistema.IPermisos_VW) =>
                <React.Fragment>
                    <button className="asstext mx-1" type={"button"} onClick={() => {
                        setState(s => ({
                            ...s, Item: cprops, MostrarForm: true
                        }))
                    }}>
                        <FaPencilAlt />
                    </button>
                    <button style={{ color: 'darkred' }} className="asstext mx-1" type={"button"} onClick={() => {
                        FNEliminar(cprops)
                    }}>
                        <FaTrash />
                    </button>
                </React.Fragment>
        },
    ]

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
    const cbAgregar = (item: DBConfia_Sistema.IPermisos_VW) =>
        setState({ ...state, Datos: [...state.Datos, item], MostrarForm: false })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: DBConfia_Sistema.IPermisos_VW) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.PermisoID === item.PermisoID ? item : Dato), MostrarForm: false })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, MostrarForm: false, Item: undefined })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="PERMISOS EXCEL DE APLICACIÓN">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar permiso" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, MostrarForm: true, Item: undefined })}
                                                        ><FaPlus /></button>
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
                                        keyField={"EstadoCivilID"}
                                        defaultSortField={"EstadoCivilID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.MostrarForm} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Item ? "Editar Permiso" : "Agregar Permiso"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                key={"frm__" + state.Item?.PermisoID ?? 0}
                                                oidc={props.oidc}
                                                Permiso={state.Item}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoPermisosExcel)