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
import { CForm } from './PermisosEsp/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

// Modelos de base de datos
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../global/variables'
import { DBConfia_Sistema } from '../../../../../interfaces_db/DBConfia/Sistema'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { DBConfia_Seguridad } from '../../../../../interfaces_db/DBConfia/Seguridad'

type CatalogosType = {
    oidc: IOidc

}

const PermisosEspeciales = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { EstadoCivilID: '', EstadoCivil: '' }
    const Datos: DBConfia_Sistema.IPantallas_VW[] = []
    const DatosMostrar: any[] = []
    const DetallePermisos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',

        Cargando: true,
        Error: false,
        Item: undefined as DBConfia_Sistema.IPantallas_VW | undefined,
        Item2: undefined as DBConfia_Seguridad.IUsuariosPermisosVW | undefined,
        MostrarForm: false,
        DetallePermisos
    })

    const FNGetLocal = async () => {

        // Cargando
        setState(s => ({ ...s, Cargando: true }))

        try {
            // Hacemos la consulta al servicio web
            const Datos = (await axios.get(`${GetServerUrl()}Sistema/Usuarios`, GenerarCabeceraOIDC(props.oidc))).data

            // Definimos el estado
            setState(e => ({ ...e, Cargando: false, Datos }))
        }
        catch (error) {
            // Definimos el estado
            setState(e => ({ ...e, Cargando: false, Datos: [], Error: true }))
        }
    }
    const FNGetPermisos = async () => {

        // Cargando
        setState(s => ({ ...s, Cargando: true }))

        try {
            // Hacemos la consulta al servicio web
            const Datos = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/GetPermisosEspUsuario`, GenerarCabeceraOIDC(props.oidc))).data

            // Definimos el estado
            setState(e => ({ ...e, Cargando: false, Datos }))
        }
        catch (error) {
            // Definimos el estado
            setState(e => ({ ...e, Cargando: false, Datos: [], Error: true }))
        }
    }

    // Eliminamos un rol (Confirmar)
    const FNEliminar = async (pantalla: DBConfia_Sistema.IPantallas_VW) => {

        // Generamos el gestor de alertas
        const MySwal = withReactContent(Swal)

        // Mostramos el dialogo de confirmación
        MySwal.fire({
            html:
                <div className='text-center my-2'>
                    <p className='is-size-5'>¿Desea continuar eliminando la pantalla <strong>{pantalla.PantallaNombre}</strong>?</p>
                    <p className='is-size-7'>Esta accion eliminara la pantalla y al igual que todos los permisos que hagan referencia a la misma, así como los accesos en los roles</p>
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
                    let respuesta = await axios.delete(`${GetServerUrl()}Sistema/Pantallas/${pantalla.PantallaID}`, GenerarCabeceraOIDC(props.oidc))
                    return respuesta.data
                }
                catch {
                    MySwal.showValidationMessage('Ocurrio un error al eliminar la pantalla')
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
        { name: 'Id', selector: 'UsuarioID', sortable: true },
        { name: 'Nombre', selector: 'NombreCompleto', sortable: true },
        { name: 'Pantalla', selector: 'Usuario', sortable: true },
        {
            name: 'Acciones', sortable: false,
            cell: (cprops: DBConfia_Seguridad.IUsuariosPermisosVW) =>
                <React.Fragment>
                    <button className="asstext mx-1" type={"button"} onClick={() => {
                        console.log("props", props)
                        let nuevo = {

                        }
                        setState(s => ({
                            ...s,
                            Item2: cprops,
                            MostrarForm: true
                        }))
                    }}>
                        <FaPencilAlt />
                    </button>
                    {/*  <button className="asstext mx-1" style={{ color: 'darkred' }} type={"button"} onClick={() => {
                        FNEliminar(cprops)
                    }}>
                        <FaTrash />
                    </button> */}
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
    const cbAgregar = (item: DBConfia_Sistema.IPantallas_VW) =>
        setState({ ...state, Datos: [...state.Datos, item], MostrarForm: false })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: DBConfia_Sistema.IPantallas_VW) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.PantallaID === item.PantallaID ? item : Dato), MostrarForm: false })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, MostrarForm: false, Item: undefined })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="PERMISOS ESPECIALES">
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
                                                        <input type="text" className="form-control" placeholder="Buscar usuario" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                    <ModalWin open={state.MostrarForm}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Item2 ? "Agregar/Eliminar permisos especiales" : "Agregar Permiso"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                key={"frm__" + state.Item2?.UsuarioID ?? 0}
                                                oidc={props.oidc}
                                                Permiso={state.Item2}
                                                datosPermiso={state.DetallePermisos}
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

export default connect(mapStateToProps, mapDispatchToProps)(PermisosEspeciales)