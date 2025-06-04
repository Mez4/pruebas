import React from 'react'

// Estado redux
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'

// Componentes personalizadpos
import { Card, Spinner, Tabs } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'

// Sub-Componentes
import { PerfilDistribuidor, PerfilCliente, AgregarEmpleo, AgregarDireccion, EditarPersona } from '.'
import * as Funciones from './Funciones'

// Router
import { useParams } from 'react-router'

// Iconos
import { FaDollarSign, FaUser } from 'react-icons/fa'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { FiRefreshCcw } from 'react-icons/fi'

// Interfaces de base de datos
import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'


// Importamos los componentes de presentación
import { PerfilPersona } from '../../../../../presentacion'

// Componente de cliente
type ClienteTipo = {
    oidc: IOidc,
    ui: iUI,
}

// Componente de cliente
export const Cliente = (props: ClienteTipo) => {

    // Ontenemos el ID de la persona
    type paramType = { id: string }
    let { id } = useParams<paramType>()
    let id_int: number = parseInt(id as string)

    // Controlamos el estado del control
    let isMounted = React.useRef(true)

    // Definimos el estado del componente
    type EstadoDefectoTipo = {
        Datos: {
            Persona?: DBConfia_General.IPersonas_VW,
            Direcciones: DBConfia_General.IDirecciones_VW[],
            Empleos: DBConfia_General.IEmpleos_VW[]
            DireccionesMigradas: DBConfia_General.IDireccionesMigradas[]
        },
        Cargando: boolean,
        Error: boolean
    }
    let EstadoDefecto: EstadoDefectoTipo = {
        Datos: { Persona: undefined, Direcciones: [], Empleos: [], DireccionesMigradas: [] },
        Cargando: true,
        Error: false
    }
    let [Estado, DefinirEstado] = React.useState(EstadoDefecto)

    // Defninimos nuestro proceso para la carga inicial de datos
    React.useEffect(() => {

        let ConsultarDatos = async () => {

            try {

                // Cacheamos el estado
                DefinirEstado(e => ({ ...e, Datos: { Persona: undefined, Direcciones: [], Empleos: [], Creditos: [], DireccionesMigradas: [] }, Cargando: true, Error: false }))

                // Obtenemos la persona
                let resultado = await Funciones.FNObtenerPersona(props.oidc, id_int)

                // Si nuestro componente esta montado
                if (isMounted)

                    // Definimos el estado
                    DefinirEstado(e => ({
                        ...e,
                        Datos: {
                            Persona: resultado.persona,
                            Direcciones: resultado.direcciones,
                            Empleos: resultado.empleos,
                            Creditos: [],
                            DireccionesMigradas: []
                        },
                        Cargando: false,
                        Error: false
                    }))
            }
            catch (e) {
                if (isMounted)
                    DefinirEstado(e => ({ ...e, Datos: { Persona: undefined, Direcciones: [], Empleos: [], Creditos: [], DireccionesMigradas: [] }, Cargando: false, Error: true }))
            }
        }
        ConsultarDatos()
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [id_int])

    return (
        <div className="row">
            <div className="col-md-12 col-lg-4">
                {Estado.Cargando &&
                    <div className="text-center">
                        <Spinner />
                        <span>Cargando Datos</span>
                    </div>
                }
                {!Estado.Cargando && Estado.Error &&
                    <div className="text-center">
                        <button className="btn btn-confia btn-sm"><FiRefreshCcw /></button>
                        <span>Error al consultar la persona</span>
                    </div>
                }
                {!Estado.Cargando && !Estado.Error && Estado.Datos.Persona !== undefined &&
                    <PerfilPersona Editar={true} Persona={Estado.Datos.Persona} Direcciones={Estado.Datos.Direcciones} Empleos={Estado.Datos.Empleos} oidc={props.oidc} ui={props.ui} DireccionesMigradas={Estado.Datos.DireccionesMigradas} />
                }
            </div>
            <div className="col-md-12 col-lg-8">

            </div>
        </div>
    )
}
