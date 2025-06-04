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
type MunicipioTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    Cascada?: boolean,
    EstadoId: number,
    oidc: IOidc
}
const Municipios = (props: MunicipioTipo) => {

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
        axios.post(`${GetServerUrl()}Catalogos/Municipio/get`, {EstadoId: props.EstadoId}, {
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
        if(props.Cascada && props.EstadoId > 0){
            FNGetLocal()
        }
        // eslint-disable-next-line
    }, [props.EstadoId])

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
        placeholder = "Seleccione un Municipio"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.id_municipio, label: e.Municipio }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'MunicipioId'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Municipio'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'MunicipioId'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Municipio'} options={opciones} isMulti={false} />
    )
}

export default Municipios