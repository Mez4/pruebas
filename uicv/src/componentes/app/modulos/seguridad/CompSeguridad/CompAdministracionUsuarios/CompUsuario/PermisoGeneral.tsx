import axios from 'axios'
import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FaExclamationCircle, FaKey, FaPlus, FaSave, FaSearch, FaTrashAlt, FaUsers } from 'react-icons/fa'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../../global/variables'
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc'

// ························································
// Interfaces
// ························································
import { DBConfia_Seguridad } from '../../../../../../../interfaces_db/DBConfia/Seguridad'
import { DBConfia_Sistema } from '../../../../../../../interfaces_db/DBConfia/Sistema'
import { ModalWin, Spinner } from '../../../../../../global'
import { MdDone, MdOutlineClose } from 'react-icons/md'
import moment from 'moment'


const DialogoPermiso = (props: {
    UsuarioID: number,
    ProductoID?: number,
    oidc: IOidc,
    open?: boolean,
    close(): void,
    closeAsync(usuario_permisos: DBConfia_Seguridad.IUsuariosPermisosVW[]): void
}) => {

    // Generamos un estado
    const [estado, definirEstado] = React.useState<{
        Cargando: boolean,
        Permisos?: DBConfia_Sistema.IPermisos_VW[],
        PermisosUsuario?: DBConfia_Seguridad.IUsuariosPermisosVW[],
        PermisosSeleccionados: DBConfia_Sistema.IPermisos_VW[]
    }>({
        Cargando: false,
        PermisosSeleccionados: []
    })

    // Usamos useEffect para obtener
    React.useEffect(() => {

        let queryData = async () => {

            try {

                // Query
                definirEstado(e => ({ ...e, Cargando: true }))

                // Obtenemos los permisos del usuario
                const usuario_permisos: DBConfia_Seguridad.IUsuariosPermisosVW[] = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/permisos/${props.UsuarioID}${props.ProductoID !== undefined ? `/${props.ProductoID}` : ''}`, GenerarCabeceraOIDC(props.oidc))).data

                // Obtenemos los roles
                let datos = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/permisos/especiales/${props.UsuarioID}${props.ProductoID !== undefined ? `/${props.ProductoID}` : ''}`, GenerarCabeceraOIDC(props.oidc))).data

                // Cambiamos nuestro estado
                definirEstado(e => ({ ...e, Cargando: false, Permisos: datos, PermisosUsuario: usuario_permisos }))

            }
            catch (exception) {

                console.log("Error al obtener los permisos", exception)

                // Query
                definirEstado(e => ({ ...e, Cargando: false, Permisos: [] }))
            }
        }

        // Validamos si estamos cargando
        if (!estado.Cargando && estado.Permisos === undefined && props.open === true) {
            queryData();
        }
    }, [estado.Cargando, estado.Permisos, props.open])

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'ModuloID',
                sortable: false,
                center: true,
            },
            {
                name: 'ID PERMISO',
                selector: 'PantallaID',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.PantallaID}</span>

            },
            {
                name: 'Fecha Solicitud',
                selector: 'PermisoID',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.PermisoID}</span>
            },
        ]
    // Funcion para cargar los roles al servidor
    const ActualizarPermisosEspeciales = async () => {

        // Definimos el estado como cargando
        definirEstado(e => ({ ...e, Cargando: true }))

        // Mandamos los IDs de los permisos especiales al servidor
        let DatosEnvio = {
            ProductoID: null,
            PermisosIDs: estado.PermisosSeleccionados.map(p => p.PermisoID)
        }

        try {

            definirEstado(e => ({ ...e, Cargando: true }))

            // Obtenemos los roles
            let datos: DBConfia_Seguridad.IUsuariosPermisosVW[] = (await axios.put(`${GetServerUrl()}Sistema/Usuarios/permisos/especiales/${props.UsuarioID}`, DatosEnvio, GenerarCabeceraOIDC(props.oidc))).data

            definirEstado(e => ({ ...e, Cargando: false }))

            props.closeAsync(datos)

        }
        catch (Exception) {

            console.log("Error al obtener los permisos", Exception)

            // Query
            definirEstado(e => ({ ...e, Cargando: false, Permisos: [] }))

        }
    }

    // Render
    return (


        <ModalWin xlarge open={props.open} center scrollable>
            <ModalWin.Header>
                <span>
                    <FaKey /> <strong>Permisos Especiales</strong>
                </span>
                <button onClick={props.close} className='btn btn-outline-danger'>X</button>
            </ModalWin.Header>
            <ModalWin.Body>
                <div className='p-2'>

                    {estado.Cargando &&
                        <div className='mt-2 has-text-centered'>
                            <Spinner />
                            <p className='mt-1'>Obteniendo los permisos especiales</p>
                        </div>
                    }
                    {!estado.Cargando && (estado.Permisos !== undefined && estado.Permisos.length <= 0) &&
                        <div>
                            <div className='mt-2 has-text-centered'>
                                <p className='mt-1'>No se tienen permisos especiales disponibles u ocurrio un error al obtenerlos, intente de nuevo</p>
                            </div>
                        </div>
                    }
                    {!estado.Cargando && (estado.Permisos === undefined || estado.Permisos?.length >= 0) &&

                        <div>
                            <DataTable
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Resultados por página:'
                                    , rangeSeparatorText: 'of',
                                    noRowsPerPage: false,
                                    selectAllRowsItem: false,
                                    selectAllRowsItemText: 'Todos'
                                }}
                                subHeader
                                noDataComponent={
                                    <div className="text-center">
                                        Sin registros
                                    </div>
                                }
                                subHeaderComponent={
                                    <div className="row">
                                        <div className="col-sm-12">




                                        </div>
                                    </div>

                                }
                                data={estado.PermisosSeleccionados}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"SolicitudGastoID"}
                                defaultSortField={"SolicitudGastoID"}
                                columns={Columns}
                            />
                        </div>
                    }
                </div>
            </ModalWin.Body>
            {!estado.Cargando && (estado.Permisos !== undefined && estado.Permisos.length >= 0) &&
                <ModalWin.Footer>
                    <button type="button" className="btn btn-primary" onClick={ActualizarPermisosEspeciales}><MdDone /> Guardar</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={props.close}><MdOutlineClose /> Cancelar</button>
                </ModalWin.Footer>
            }
        </ModalWin>

    )
}


/**
 * Componente para los 
 * @returns 
 */
const PermisoGeneral = ({ usuario, roles, oidc, ProductoID }: { usuario: DBConfia_Seguridad.IUsuariosVW, oidc: IOidc, roles: DBConfia_Seguridad.IRoles[], ProductoID?: number }) => {

    // Definimos el tipo de nuestro estado
    type tEstadoCarga = {
        cargando: boolean
        usuario_roles?: number[]
        rol_agregar: number
        texto_busqueda: string
        modal?: boolean
    }

    // Definimos el estado
    const [estado, definirEstado] = React.useState<tEstadoCarga>({ cargando: true, rol_agregar: 0, texto_busqueda: '' })

    const FNConsultaLocal = async () => {

        try {

            //  Obtenemos los datos del servidor
            const usuario_roles = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/roles/${usuario.UsuarioID}${ProductoID !== undefined ? `/${ProductoID}` : ''}`, GenerarCabeceraOIDC(oidc))).data

            // Cambiamos el estado de nuestro componente
            definirEstado(es => ({ ...es, cargando: false, usuario_roles }))

        }
        catch {

            // Limpiamos nuestro estado
            definirEstado(e => ({ ...e, cargando: false, usuario_roles: [], rol_agregar: 0 }))

        }
    }

    // Agrega un rol a un usuario
    const FNAgregarRol = async (RolID: number) => {

        if (RolID <= 0)
            return

        try {

            // Actualizamos nuestro estado
            definirEstado(e => ({ ...e, cargando: true, rol_agregar: 0 }))

            // Envuiamos la consulta al servidor
            let respuestaServidor = await axios.put(`${GetServerUrl()}Sistema/Usuarios/roles/${usuario.UsuarioID}`, { RolID, ProductoID }, GenerarCabeceraOIDC(oidc))

            // Consultamos de nuevo
            FNConsultaLocal()
        }
        catch (Exception) {

            // Details
            console.log("Error al agregar el Rol" + JSON.stringify(Exception, null, 2))
            alert("Error al agregar el Rol" + JSON.stringify(Exception, null, 2))

            // Actualizamos nuestro estado
            definirEstado(e => ({ ...e, cargando: false }))
        }
    }

    // Elimina un rol a un usuario
    const FNEliminarRol = async (RolID: number) => {

        try {

            // Actualizamos nuestro estado
            definirEstado(e => ({ ...e, cargando: true, rol_agregar: 0 }))

            // Envuiamos la consulta al servidor
            await axios.delete(`${GetServerUrl()}Sistema/Usuarios/roles/${usuario.UsuarioID}/${RolID}${ProductoID !== undefined ? `/${ProductoID}` : ''}`, { ...GenerarCabeceraOIDC(oidc), })

            // Consultamos de nuevo
            FNConsultaLocal()
        }
        catch (Exception) {
            console.log("Error al agregar el Rol" + JSON.stringify(Exception, null, 2))
            alert("Error al agregar el Rol" + JSON.stringify(Exception, null, 2))

            // Actualizamos nuestro estado
            definirEstado(e => ({ ...e, cargando: false }))
        }
    }

    // Get our local data
    React.useEffect(() => {
        if (estado.cargando === true && estado.usuario_roles === undefined)
            FNConsultaLocal()
    }, [])

    console.log("USUARIO_ROLES", estado.usuario_roles)
    console.log("ROLES", roles)

    // Filtramos las datos
    const datosTabla = roles.filter(f =>

        // Solo roles del cual el usuario es miembro
        ((estado.usuario_roles ?? []).indexOf(f.RolID) >= 0) && (
            (f.Nombre ?? "").toUpperCase().includes(estado.texto_busqueda.toUpperCase()) ||
            (f.Descripcion ?? "").toUpperCase().includes(estado.texto_busqueda.toUpperCase())
        )
    )

    // Render del componente
    return (
        <div>

            {estado.cargando &&
                <div className="text-center">
                    <h4>Obteniendo los accesos administrativos</h4>
                    <Spinner />
                    <p className="mt-2">Espere...</p>
                </div>
            }

            {!estado.cargando && estado.usuario_roles !== undefined &&
                <div>
                    <div className='mt-0'>
                        <DialogoPermiso
                            key={'dp__' + (estado.usuario_roles ?? []).length}
                            UsuarioID={usuario.UsuarioID}
                            oidc={oidc}
                            ProductoID={ProductoID}
                            open={estado.modal}
                            close={() => definirEstado(e => ({ ...e, modal: undefined }))}
                            closeAsync={(usuario_permisos: DBConfia_Seguridad.IUsuariosPermisosVW[]) => definirEstado(e => ({ ...e, modal: undefined, usuario_permisos: usuario_permisos }))}
                        />
                        <DataTable
                            className='is-size-7'
                            subHeader
                            subHeaderComponent=
                            {
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-group mb-3">
                                            <select className='form-select form-select-sm' value={estado.rol_agregar} style={{ minWidth: '160px' }} onChange={e => { definirEstado(fnestado => ({ ...fnestado, rol_agregar: parseInt(e.target.value) })) }}>
                                                <option value={0}>Seleccionar</option>
                                                {roles.filter(f => (estado.usuario_roles ?? []).indexOf(f.RolID) < 0).map((r, rId) => <option value={r.RolID} key={`r${rId}`} title={r.Descripcion}>{r.Nombre}</option>)}
                                            </select>
                                            <button className='btn btn-primary btn-sm' onClick={() => FNAgregarRol(estado.rol_agregar)}>
                                                <FaPlus />
                                            </button>
                                            <input className='form-control form-control-sm' style={{ minWidth: '80px' }} onChange={(inpt) => { definirEstado(e => ({ ...e, texto_busqueda: inpt.target.value })) }} />
                                            <span className="input-group-text"><FaSearch /> </span>
                                            {/*  <button className='btn btn-danger btn-sm' title='Permisos especiales' onClick={() => definirEstado(e => ({ ...e, modal: true }))}>
                                                <FaExclamationCircle />
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            }
                            data={datosTabla}
                            striped
                            pagination
                            dense
                            noHeader
                            responsive
                            keyField='PermisoID'
                            columns={[
                                {
                                    name: 'Rol', selector: 'Nombre', sortable: true, cell: (cprops) =>
                                        <span>
                                            <i className={`${cprops.Icono}`} style={{ width: "20px" }} />
                                            <span>{cprops.Nombre}</span>
                                        </span>
                                },
                                { name: 'Descripcion', selector: 'Descripcion', sortable: true, cell: (cprops) => <span title={cprops.Descripcion}>{cprops.Descripcion}</span> },
                                {
                                    name: 'Acciones', sortable: false, cell: (cprops) =>
                                        <React.Fragment>
                                            <FaTrashAlt className='mr-2 has-text-danger has-text-weight-semibold' title='Eliminar permiso' style={{ cursor: 'pointer' }} onClick={() => FNEliminarRol(cprops.RolID)} />
                                        </React.Fragment>
                                },
                            ]}
                        />
                    </div>
                </div>
            }
        </div>
    )
}
export default PermisoGeneral