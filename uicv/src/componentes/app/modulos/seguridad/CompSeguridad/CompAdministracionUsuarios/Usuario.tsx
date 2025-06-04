import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

// Icons
import { FaKey, FaLock, FaShare, FaShieldAlt, FaUser } from 'react-icons/fa'

// Axios
import axios from 'axios'

// Local
import { Card, Spinner, Tabs } from '../../../../../global'
import { DBConfia_Seguridad } from '../../../../../../interfaces_db/DBConfia/Seguridad'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'

// Interfaces
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { PermisoGeneral, PermisoProducto } from './CompUsuario'
import { DBConfia_Sistema } from '../../../../../../interfaces_db/DBConfia/Sistema'

const PantallaMembresias = ({ oidc }: { oidc: IOidc }) => {

    // Get our data
    const { usuarioId } = useParams<{ usuarioId: string | undefined }>()

    // Definimos el tipo del estado
    type TEstado = {
        Cargando: boolean,
        Usuario?: DBConfia_Seguridad.IUsuariosVW,
        Roles?: DBConfia_Seguridad.IRoles[]
        Roless?: DBConfia_Seguridad.IUsuariosPermisosVW[]
        Rolesss?: DBConfia_Seguridad.IUsuariosPermisosVW[]
        Rolessss?: DBConfia_Sistema.IModulos[]
    }

    // Definimos nuestro estado
    const [estado, definirEstado] = React.useState<TEstado>({ Cargando: true })

    //#region Funciones del componente
    const FNGetLocal = async () => {

        try {

            //  Obtenemos los datos del servidor
            const Usuario: DBConfia_Seguridad.IUsuariosVW = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/${usuarioId ?? 0}`, GenerarCabeceraOIDC(oidc))).data
            const Roles: DBConfia_Seguridad.IRoles[] = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/roles`, GenerarCabeceraOIDC(oidc))).data
            const Rolessss: DBConfia_Sistema.IModulos[] = (await axios.get(`${GetServerUrl()}Sistema/Usuarios/GetModulo`, GenerarCabeceraOIDC(oidc))).data
            // Cambiamos el estado de nuestro componente
            definirEstado(es => ({ ...es, Cargando: false, Usuario, Roles }))
        }
        catch {

            // Limpiamos nuestro estado
            definirEstado({
                Cargando: false,
                Usuario: undefined,
                Roles: undefined,
                Rolessss: undefined
            })
        }
    }

    //#endregion

    React.useEffect(() => {
        if (estado.Usuario === undefined && estado.Cargando)
            FNGetLocal()
    }, [])

    // Render de componente
    return (
        <React.Fragment>
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
                        !estado.Cargando && estado.Usuario === undefined &&
                        <div className="text-center">
                            <h4>Ocurrio un error al obtener el detalle del usuario</h4>
                            <Spinner />
                            <p className="mt-2">Espere...</p>
                        </div>
                    }

                    { // Pudimos obtener toda la info
                        !estado.Cargando && estado.Usuario !== undefined &&
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <Card Title={<span style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }} className='is-size-6'><FaUser className="mr-2" /> Usuario</span>}>
                                    <Card.Body>
                                        <div className="text-center mt-3">
                                            <FaUser className="avatar-sm rounded-circle" />
                                            <p className="mt-3 mb-0 is-size-5">{estado.Usuario?.Nombre}</p>
                                            <p className="my-0 has-text-link is-size-6">{estado.Usuario?.Correo}</p>
                                            {estado.Usuario?.Bloqueado &&
                                                <p className="my-0 is-size-7">
                                                    <FaLock className="mr-1" />
                                                    <span>Bloqueado</span>
                                                </p>
                                            }
                                            {estado.Usuario?.MasterUser && !estado.Usuario?.Bloqueado &&
                                                <p className="my-0 is-size-7" style={{ display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                                                    <FaShieldAlt className="mr-1" />
                                                    <span>Usuario Maestro</span>
                                                </p>
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-9">
                                <Card Title={<span style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }} className='is-size-6'><FaKey className="mr-2" /> Accesos</span>}>
                                    <Card.Body>
                                        <Tabs TabSelecionado="Admin" Kind={Tabs.TabsKind.DEFAULT} Justified={false}>
                                            <Tabs.Tab Titulo={<span>Accesos Administrativos</span>} Identificador={"Admin"}>

                                                {/** Gestor de  permisos generales  */}
                                                <PermisoGeneral usuario={estado.Usuario} roles={(estado.Roles ?? []).filter(f => !f.RequiereProducto)} oidc={oidc} />

                                            </Tabs.Tab>
                                            <Tabs.Tab Titulo={<span>Acceso Productos</span>} Identificador={"Productos"}>
                                                <PermisoProducto usuario={estado.Usuario} roles={(estado.Roles ?? []).filter(f => f.RequiereProducto)} oidc={oidc} />
                                            </Tabs.Tab>

                                        </Tabs>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    }
                </div>
            </div >
        </React.Fragment>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

export default connect(mapStateToProps)(PantallaMembresias)