import React from 'react'
import { CustomSelect, CustomSelect2, ActionMultipleSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../global/variables'
import axios from 'axios'
import { DBConfia_Sistema } from '../../interfaces_db/DBConfia/Sistema'

type PantallaTipo = {
    name?: string,
    unaLinea?: boolean,
    isSingle?: boolean,
    disabled?: boolean,
    oidc: IOidc,
    valor?: any
}
const Modulos = (props: PantallaTipo) => {

    // Checamos que el componente este montado
    let isMounted = React.useRef(true)

    // Declaramos el estado del componente
    const [Estado, definirEstado] = React.useState({
        Datos: [] as DBConfia_Sistema.IModulos[]
        , Cargando: false
        , Error: false
    })

    // #################################################
    // Effectos de la forma
    // >>

    // Declare the FNGet
    const FNGetLocal = async () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))
        try {
            const Modulos: DBConfia_Sistema.IModulos[] = (await axios.get(`${GetServerUrl()}Sistema/Modulos`, GenerarCabeceraOIDC(props.oidc))).data
            if (isMounted.current === true)
                definirEstado(e => ({ Cargando: false, Error: false, Datos: Modulos }))
        }
        catch {
            if (isMounted)
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
        }
    }

    // On use effect
    // eslint-disable-next-line
    React.useEffect(() => { FNGetLocal() }, [])

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
        placeholder = "Seleccione un Pantalla"

    // Opciones del control
    const opciones = Estado.Datos.map(e => ({ value: e.ModuloID, label: e.Nombre }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'ModuloID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Modulo'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor} />
        )

    if (props.isSingle === true)
        return (
            <CustomSelect name={props.name ?? 'ModuloID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Modulo'} options={opciones} isMulti={false} />
        )

    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Modulos"
            name="ModulosIds"
            placeholder="Seleccione los Modulos"
            options={opciones}
            addDefault={false}
            valor={Estado.Datos.map(p => p.ModuloID)}
        />
    )
}

export default Modulos

