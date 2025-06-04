import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

// Icons
import { FaEye, FaGlobe, FaKey, FaPlus, FaSearch, FaTrash, FaUsers } from 'react-icons/fa'

// Axios
import axios from 'axios'

// Local
import { Card, Spinner, Tabs } from '../../../../../global'
import { DBConfia_Seguridad } from '../../../../../../interfaces_db/DBConfia/Seguridad'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'

// Interfaces
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { DBConfia_Sistema } from '../../../../../../interfaces_db/DBConfia/Sistema'
import DataTable from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { FormaAgregar } from './CompRol/FormaAgregar'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

const PantallaMembresias = ({ oidc }: { oidc: IOidc }) => {

    // Get our data
    const { rolId } = useParams<{ rolId: string | undefined }>()

    // Definimos el tipo del estado
    type TEstado = {
        Cargando: boolean,
        Rol?: DBConfia_Seguridad.IRoles,
        Permisos?: DBConfia_Sistema.IPermisos_VW[],
        PermisosRol?: DBConfia_Sistema.IPermisos_VW[],
        Filtro: string,
        Agregar?: boolean
    }

    // Definimos nuestro estado
    const [estado, definirEstado] = React.useState<TEstado>({ Cargando: true, Filtro: '' })

    //#region Funciones del componente

    const FNGetLocal = async () => {

        try {

            //  Obtenemos los datos del servidor
            const Rol: DBConfia_Seguridad.IRoles = (await axios.get(`${GetServerUrl()}sistema/Roles/${rolId ?? 0}`, GenerarCabeceraOIDC(oidc))).data
            const PermisosRol: DBConfia_Sistema.IPermisos_VW[] = (await axios.get(`${GetServerUrl()}sistema/Permisos/permisos_rol/${rolId ?? 0}`, GenerarCabeceraOIDC(oidc))).data
            const Permisos: DBConfia_Sistema.IPermisos_VW[] = (await axios.get(`${GetServerUrl()}sistema/Permisos`, GenerarCabeceraOIDC(oidc))).data

            console.log("PERMISOS", Permisos)
            console.log("ROL_PERMISOS", PermisosRol)

            // Cambiamos el estado de nuestro componente
            definirEstado(es => ({ ...es, Cargando: false, Rol, Permisos, PermisosRol }))
        }
        catch {

            // Limpiamos nuestro estado
            definirEstado({ Cargando: false, Filtro: '' })
        }
    }

    const FNAgregar = () => definirEstado(e => ({ ...e, Agregar: true }))

    const FNEliminar = async (Permiso: DBConfia_Sistema.IPermisos_VW) => {

        // Generamos el gestor de alertas
        const MySwal = withReactContent(Swal)

        // Mostramos el dialogo de confirmación
        MySwal.fire({
            html:
                <div className='text-center my-2'>
                    <p className='is-size-5'>¿Desea continuar eliminando el Permiso <strong>{Permiso.PermisoNombre}</strong>?</p>
                    <p className='is-size-7'>Esta accion eliminara el acceso a la ruta: {Permiso.PermisoRestMetodo}|{Permiso.PermisoRestUrl}</p>
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

                    // Intentamos hacer el request con axios
                    await axios.post(`${GetServerUrl()}sistema/Roles/asignar_permiso/${rolId}`, { PermisoID: Permiso.PermisoID }, GenerarCabeceraOIDC(oidc))

                    //  Obtenemos los datos del servidor
                    const Rol: DBConfia_Seguridad.IRoles = (await axios.get(`${GetServerUrl()}sistema/Roles/${rolId ?? 0}`, GenerarCabeceraOIDC(oidc))).data
                    const PermisosRol: DBConfia_Sistema.IPermisos_VW[] = (await axios.get(`${GetServerUrl()}sistema/Permisos/permisos_rol/${rolId ?? 0}`, GenerarCabeceraOIDC(oidc))).data
                    const Permisos: DBConfia_Sistema.IPermisos_VW[] = (await axios.get(`${GetServerUrl()}sistema/Permisos`, GenerarCabeceraOIDC(oidc))).data

                    console.log("PERMISOS", Permisos)
                    console.log("ROL_PERMISOS", PermisosRol)

                    // Cambiamos el estado de nuestro componente
                    definirEstado(es => ({ ...es, Cargando: false, Rol, Permisos, PermisosRol }))
                }
                catch {
                    MySwal.showValidationMessage('Ocurrio un error al eliminar el rol')
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

    //#endregion

    React.useEffect(() => {
        if (estado.Rol === undefined && estado.Cargando)
            FNGetLocal()
    }, [])

    // Render de componente
    return (
        <div className="row">
            <div className="col-12">


                {   // Carga inicial de nuestro componente
                    estado.Cargando &&
                    <div className="text-center">
                        <h4>Obteniendo el detalle del usuario</h4>
                        <Spinner />
                        <p className="mt-2">Espere...</p>
                    </div>
                }

                {   // Error al obtener los datos del servidor
                    !estado.Cargando && estado.Rol === undefined &&
                    <div className="text-center">
                        <h4>Ocurrio un error al obtener el detalle del usuario</h4>
                        <Spinner />
                        <p className="mt-2">Espere...</p>
                    </div>
                }

                { // Pudimos obtener toda la info
                    !estado.Cargando && estado.Rol !== undefined &&
                    <div className="row">
                        <div className="col-sm-12 col-md-6 col-lg-3">
                            <Card Title={<span style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }} className='is-size-6'><FaUsers className="mr-2" /> Rol</span>}>
                                <Card.Body>
                                    <div className="text-center mt-3">
                                        <FaUsers className="avatar-sm rounded-circle" />
                                        <p className="mt-3 mb-0 is-size-5">{estado.Rol?.Nombre}</p>
                                        <p className="my-0 has-text-link is-size-6">{estado.Rol?.Descripcion}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-9">
                            <Card Title={<span style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }} className='is-size-6'><FaKey className="mr-2" /> Permisos en el rol</span>}>
                                <Card.Body>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Busqueda de roles" value={estado.Filtro} onChange={e => definirEstado(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button title={'Agregar rol'} className="btn btn-outline-secondary" type="button" onClick={FNAgregar}><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={FNGetLocal}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={
                                            (estado.Permisos ?? []).filter(
                                                f => (estado.PermisosRol ?? []).map(f => f.PermisoID).indexOf(f.PermisoID) >= 0 && (
                                                    (
                                                        f.ModuloNombre.toUpperCase().indexOf(estado.Filtro.toUpperCase()) >= 0
                                                        || f.PantallaNombre.toUpperCase().indexOf(estado.Filtro.toUpperCase()) >= 0
                                                        || f.PermisoNombre.toUpperCase().indexOf(estado.Filtro.toUpperCase()) >= 0
                                                    )
                                                    ||
                                                    estado.Filtro.trim() === ''
                                                ))
                                        }
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"ViviendaTipoId"}
                                        defaultSortField={"ViviendaTipo"}
                                        columns={[
                                            { name: 'Id', selector: 'PermisoID', sortable: false, grow: 0 },
                                            { name: 'Ubicación', selector: 'ModuloNombre', sortable: false, cell: (cprops) => <span>{cprops.ModuloNombre}.{cprops.PantallaNombre}</span> },
                                            { name: 'Nombre', selector: 'PermisoNombre', sortable: false, grow: 1 },
                                            { name: 'Descripcion', selector: 'PermisoDescripcion', sortable: false, grow: 1 },
                                            {
                                                name: 'Acciones', sortable: false, grow: 0, cell: (cprops) =>
                                                    <span>
                                                        <FaGlobe title={`Ruta: ${cprops.PermisoRestMetodo}|${cprops.PermisoRestUrl}`} className='mx-1' style={{ cursor: 'pointer', color: 'darkgray' }} />
                                                        <FaTrash title='Eliminar Rol' className='mx-1' style={{ cursor: 'pointer', color: 'darkred' }} onClick={() => FNEliminar(cprops)} />
                                                    </span>
                                            }
                                        ]}
                                    />
                                </Card.Body>
                            </Card>
                            <FormaAgregar
                                Permisos={(estado.Permisos ?? []).filter(f => (estado.PermisosRol ?? []).map(f => f.PermisoID).indexOf(f.PermisoID) < 0)}
                                cbGuardar={(i: DBConfia_Sistema.IPermisos_VW) => definirEstado(e => ({ ...e, Agregar: false, PermisosRol: [...(e.PermisosRol ?? []), i] }))}
                                fnCancelar={() => definirEstado(e => ({ ...e, Agregar: false }))}
                                mostrar={estado.Agregar === true}
                                oidc={oidc}
                                RolID={rolId}
                            />
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

export default connect(mapStateToProps)(PantallaMembresias)