import React from 'react'
import { CustomSelect, CustomSelect2, ActionMultipleSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../global/variables'
import axios from 'axios'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { iUI } from '../../interfaces/ui/iUI'
import { DBConfia_Sistema } from '../../interfaces_db/DBConfia/Sistema'

type PantallaTipo = {
    name?: string,
    unaLinea?: boolean,
    isSingle?: boolean,
    disabled?: boolean,
    oidc: IOidc,
    valor?: any
}
const Pantallas = (props: PantallaTipo) => {

    // Checamos que el componente este montado
    let isMounted = React.useRef(true)

    // Declaramos el estado del componente
    const [Estado, definirEstado] = React.useState({
        Datos: [] as DBConfia_Sistema.IPantallas_VW[]
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
            const Pantallas: DBConfia_Sistema.IPantallas_VW[] = (await axios.get(`${GetServerUrl()}Sistema/Pantallas`, GenerarCabeceraOIDC(props.oidc))).data
            if (isMounted.current === true)
                definirEstado(e => ({ Cargando: false, Error: false, Datos: Pantallas }))
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
    const opciones = Estado.Datos.map(e => ({ value: e.PantallaID, label: e.PantallaNombre, group: e.ModuloNombre }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'PantallaID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Pantalla'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor} />
        )

    if (props.isSingle === true)
        return (
            <CustomSelect name={props.name ?? 'PantallaID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Pantalla'} options={opciones} isMulti={false} />
        )

    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Pantallas"
            name="PantallasIds"
            placeholder="Seleccione los Pantallas"
            options={opciones}
            addDefault={false}
            valor={Estado.Datos.map(p => p.PantallaID)}
        />
    )
}

export default Pantallas

