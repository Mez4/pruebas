import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

// Icons
import { FaKey, FaLock, FaShare, FaShieldAlt, FaUser } from 'react-icons/fa'

// Axios
import axios from 'axios'

// Local
import { Card, Spinner, Tabs } from '../../../../global'
import { DBConfia_Seguridad } from '../../../../../interfaces_db/DBConfia/Seguridad'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../global/variables'

// Interfaces
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { PermisoGeneral, PermisoProducto } from '../../../modulos/seguridad/CompSeguridad/CompAdministracionUsuarios/CompUsuario'
import { DBConfia_Sistema } from '../../../../../interfaces_db/DBConfia/Sistema'
import { FaUsers } from 'react-icons/fa6'
import AsignarZonales from './AsignarUsuarios/AsignarZonales'
import AsignarGestores from './AsignarUsuarios/AsignarGestores'

const AsignacionRol = ({ oidc }: { oidc: IOidc }) => {

    // Get our data
    const { usuarioId } = useParams<{ usuarioId: string | undefined }>()
    const modalStyle = { overflowY: 'unset' };
    
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
                           
                            <div className="col-12">
                                <Card Title={<span style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }} className='is-size-6'><FaUsers className="mr-2" /> Asignaciones</span>}>
                                    <Card.Body>
                                        <Tabs TabSelecionado="Admin" Kind={Tabs.TabsKind.DEFAULT} Justified={false}>
                                            
                                            <Tabs.Tab Titulo={<span>Asignar Zonales</span>} Identificador={"Admin"}>
                                            <AsignarZonales oidc={oidc} />
                                               

                                            </Tabs.Tab>
                                            <Tabs.Tab Titulo={<span>Asignar Gestores</span>} Identificador={"Productos"}>
                                            <AsignarGestores oidc={oidc} />
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

export default connect(mapStateToProps)(AsignacionRol)