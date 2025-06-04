import React from 'react'
import axios from 'axios'
import { FaExclamationCircle, FaShare } from 'react-icons/fa'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../../global/variables'
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc'


// ························································
// Interfaces
// ························································
import { DBConfia_Creditos } from '../../../../../../../interfaces_db/DBConfia/Creditos'
import { DBConfia_Seguridad } from '../../../../../../../interfaces_db/DBConfia/Seguridad'
import { Spinner } from '../../../../../../global'
import { BsTag } from 'react-icons/bs'
import { PermisoGeneral } from '.'

/**
 * Componente para los permisos generales
 * @returns {React.ReactElement}
 */
const PermisoProducto = ({ usuario, oidc, roles }: { usuario: DBConfia_Seguridad.IUsuariosVW, roles: DBConfia_Seguridad.IRoles[], oidc: IOidc }): React.ReactElement => {

    // Definimos el tipo de nuestro estado
    type tEstadoCarga = {
        cargando: boolean
        productos: DBConfia_Creditos.IProductosVW[]
        producto: DBConfia_Creditos.IProductosVW | null
    }

    // Definimos el estado
    const [estado, definirEstado] = React.useState<tEstadoCarga>({
        cargando: true,
        productos: [],
        producto: null
    })

    //#region Declare the FNGet   
    const FNGetLocal = async () => {

        try {

            //  Obtenemos los datos del servidor
            const productos = await axios.get(`${GetServerUrl()}Sistema/Usuarios/Productos`, GenerarCabeceraOIDC(oidc))

            // Cambiamos el estado de nuestro componente
            definirEstado(es => ({ ...es, cargando: false, productos: productos.data }))

        }
        catch {

            // Limpiamos nuestro estado
            definirEstado({ cargando: false, productos: [], producto: null })
        }
    }

    // Get our local data
    React.useEffect(() => {
        if (estado.cargando && estado.productos.length <= 0)
            FNGetLocal()
    }, [])

    return (
        <div>

            {estado.cargando &&
                <div className="text-center">
                    <h4>Obteniendo los productos</h4>
                    <Spinner />
                    <p className="mt-2">Espere...</p>
                </div>
            }

            {!estado.cargando && estado.productos.length > 0 &&
                <>
                    <span> <BsTag size={16} />&nbsp;<strong>Productos</strong></span>
                    <hr className="mb-3 mt-0" />

                    <select
                        onChange={((v) => {
                            definirEstado(e => ({ ...e, producto: v.target.value === 'null' ? null : estado.productos.find(p => p.ProductoID === parseInt(v.target.value)) as DBConfia_Creditos.IProductosVW }))
                        })
                        }
                        value={estado.producto === null ? 'null' : `${estado.producto.ProductoID}`}
                        className="form-select my-2"

                    >
                        <option value={'null'}>Seleccionar</option>
                        {estado.productos.map(p =>
                            <option value={`${p.ProductoID}`} key={p.ProductoID}>{p.EmpresaNombre}, {p.Producto}</option>
                        )}

                    </select>
                    {estado.producto !== null &&
                        <PermisoGeneral oidc={oidc} roles={roles} usuario={usuario} key={`prd__${estado.producto?.ProductoID}`} ProductoID={estado.producto.ProductoID} />
                    }
                </>
            }
        </div>
    )
}
export default PermisoProducto