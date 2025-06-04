import React from 'react'
import { CustomSelect2, ActionMultipleSelect, ActionSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

type UsuariosType = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    UsuariosIds?: [],
    oidc: IOidc,
    IsAction?: boolean
}
const Usuarios = (props: UsuariosType) => {

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
        axios.post(`${GetServerUrl()}Sistema/Usuarios/ObtenerUsuarios`, {}, {
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
        placeholder = "Seleccione un Usuario"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.UsuarioID, label: e.Nombre }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'UsuarioID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Usuario'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta

    if (props.IsAction === true)
        return (
            <ActionSelect name={props.name ?? 'UsuarioID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Usuario'} options={opciones} />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Usuarios"
            name={props.name ?? "UsuarioIds"}
            placeholder="Seleccione los usuarios"
            options={opciones}
            addDefault={false}
            valor={props.UsuariosIds}
        />
    )
}

export default Usuarios

