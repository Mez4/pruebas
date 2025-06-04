import React from 'react'
import { CustomSelect2, ActionMultipleSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

/**
 * Componente selector de zonas, de momento no esta planeado integrarlo en
 * redux, pero se puede integrar como los selectores de catalogs
 * @returns Componente de REACT
 */
type TipoCodigoAutType = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    AutorizacionTipoIds?: [],
    oidc: IOidc
}
const TipoCodigoAut = (props: TipoCodigoAutType) => {

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
        axios.post(`${GetServerUrl()}Pagos/AutorizacionesTipos/get`, {}, {
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
        placeholder = "Seleccione un Tipo de Código"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.AutorizacionTipoID, label: e.AutorizacionTipo }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'AutorizacionTipoID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Tipo de Código'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Tipos de Códigos"
            name={props.name ?? "AutorizacionTipoIds"}
            placeholder="Seleccione los Tipos de Códigos"
            options={opciones}
            addDefault={false}
            valor={props.AutorizacionTipoIds}
        />
    )
}

export default TipoCodigoAut

