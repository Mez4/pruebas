import React from 'react'
import { CustomSelect, CustomSelect2, ActionMultipleSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../global/variables'
import axios from 'axios'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { iUI } from '../../interfaces/ui/iUI'

type ProductoTipo = {
    name?: string,
    unaLinea?: boolean,
    isSingle?: boolean,
    disabled?: boolean,
    DirectorID?: number,
    ProductosIds?: [],
    valor: number,
    oidc: IOidc,
    ui?: iUI

}
const Productos = (props: ProductoTipo) => {
    const GenerarArregloProductos = (aPermisos: IPermiso[]): number[] => {

        // Generamos la variable de retorno
        let _ret: number[] = []

        // Agregamos un listado con modulos unicos
        aPermisos.forEach(p => {
            if (!_ret.find(f => f === p.ProductoID)) {
                if (p.ProductoID !== null && p.ProductoID !== undefined && p.ProductoID !== 0) {
                    _ret.push(p.ProductoID)
                }
            }
        })

        // Regresamos nuestro arreglo
        return _ret
    }

    // Checamos que el componente este montado
    let isMounted = React.useRef(true)

    // Declaramos el estado del componente
    const datosDefecto: any[] = []

    const [Estado, definirEstado] = React.useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
    })

    // #################################################
    // Effectos de la forma
    // >>

    // Declare the FNGet
    const FNGetLocal = () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))
        let AccesoProductos = GenerarArregloProductos((props.ui?.PermisosProductos ?? []))
        // console.log('ui: ', props.ui)
        // console.log('AccesoProductos: ', AccesoProductos)
        axios.post(`${GetServerUrl()}Creditos/productos/getbydirector`, { DirectorID: props.DirectorID, AccesoProductos: GenerarArregloProductos((props.ui?.PermisosProductos ?? [])) }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {

                if (isMounted)
                    definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta.data }))
            })
            .catch(() => {
                if (isMounted)
                    definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    }

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
        // eslint-disable-next-line
    }, [props.DirectorID])

    // <<
    // Effectos de la forma
    // #################################################

    // Generamos el placeholder
    let placeholder: string
    if (Estado.Error)
        placeholder = "Error!"
    else if (Estado.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Seleccione un Producto"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.ProductoID, label: `ID: ${e.ProductoID} - Empresa: ${ e.EmpresaNombre } - Producto: ${ e.Producto }` }))
    //let opciones = usuario.profile.AccesoProductos.map(e => ({ value: e.ProductoID, label: e.ProductoNombre, group: e.EmpresaNombre }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'ProductoID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Producto'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor} />
        )

    if (props.isSingle === true)
        return (
            <CustomSelect name={props.name ?? 'ProductoID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Producto'} options={opciones} isMulti={false} />
        )

    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Productos"
            name="ProductosIds"
            placeholder="Seleccione los Productos"
            options={opciones}
            addDefault={false}
            valor={props.ProductosIds}
        />
    )
}

export default Productos

