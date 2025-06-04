import React from 'react'
import { CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'


import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

/**
 * Componente selector de zonas, de momento no esta planeado integrarlo en
 * redux, pero se puede integrar como los selectores de catalogs
 * @returns Componente de REACT
 */
type SucursalesOrigenTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    oidc: IOidc
}
const SucursalesOrigen = (props: SucursalesOrigenTipo) => {

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
        axios.post(`${GetServerUrl()}General/Sucursal/getSucursalOrigen`, {}, {
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
    }, [])

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
        placeholder = "Seleccione uns Sucursal Origen"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.SucursalOrigenID, label: 'SucursalID: ' + e.id_sucursal + ' - OrigenID: ' +e.id_origen + ' - Sistema: ' + e.sistema }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'SucursalOrigenID'}  disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Sucursal Origen'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'SucursalOrigenID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Sucursal Origen'} options={opciones} isMulti={false} />
    )
}

export default SucursalesOrigen