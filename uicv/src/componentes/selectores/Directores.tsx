import React from 'react'
import { CustomSelect, CustomSelect2, ActionMultipleSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'
import { IUsuarioOidc } from '../../interfaces/oidc/IUsuarioOidc'

type DirectorTipo = {
    name?: string,
    unaLinea?: boolean,
    isSingle?: boolean,
    disabled?: boolean,
    DirectoresIds?: [],
    valor?: number,
    oidc: IOidc
}
const Directores = (props: DirectorTipo) => {

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
        axios.post(`${GetServerUrl()}General/Director/getByNameProd`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                if (respuesta == undefined) {
                    return
                }
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
        placeholder = "Seleccione un Director"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.DirectorID, label: e.NombreCompleto }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'DistribuidorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Director'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor} />
        )

    if (props.isSingle === true)
        return (
            <CustomSelect name={props.name ?? 'DistribuidorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Director'} options={opciones} isMulti={false} />
        )

    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Directores"
            name="DirectoresIds"
            placeholder="Seleccione los Directores"
            options={opciones}
            addDefault={false}
            valor={props.DirectoresIds}
        />
    )
}

export default Directores


