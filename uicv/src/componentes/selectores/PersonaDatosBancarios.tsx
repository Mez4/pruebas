import React from 'react'
import { CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

type PersonaDatosBancariosType = {
    personaID: number,
    datoTipoID: number,
    cveBancoRef: number,
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    oidc: IOidc
}

const PersonaDatosBancarios = (props: PersonaDatosBancariosType) => {

    // Checamos que el componente este montado
    let isMounted = React.useRef(true)

    // Declaramos el estado del componente
    const datosDefecto: any[] = []
    const [Estado, definirEstado] = React.useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
        , DatoBancario: ''
    })

    // #################################################
    // Effectos de la forma
    // >>

    // Declare the FNGet
    const FNGetLocal = () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))
        axios.post(`${GetServerUrl()}General/PersonaDatosBancarios/getbyprod`, { personaID: props.personaID, datoTipoID: props.datoTipoID, cveBancoRef: props.cveBancoRef }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                if (isMounted) {
                    // console.log('respuesta: ', respuesta)
                    let opciones = respuesta.data.map(e => ({ value: e.personasDatosBancariosID, label: e.datoBancario }))
                    definirEstado(e => ({ ...e, Cargando: false, Error: false, Datos: opciones }))
                }
            })
            .catch(() => {
                if (isMounted)
                    definirEstado(e => ({ ...e, Cargando: false, Error: true, Datos: [] }))
            })
    }

    React.useEffect(() => {
        // console.log('props: ', props)
        // if(props.personaID > 0 && props.datoTipoID > 0 && props.cveBancoRef > 0)
        // {
        // FNGetLocal()
        // }
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
        placeholder = "Seleccione el Dato Bancario"

    // Opciones del control
    // let opciones = Estado.Datos.map(e => ({ value: e.datoBancario, label: e.datoBancario }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'personasDatosBancariosID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Dato Bancario'} options={Estado.Datos} isMulti={false} funcionActualizacion={FNGetLocal} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'personasDatosBancariosID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Dato Bancario'} options={Estado.Datos} isMulti={false} />
    )
}

export default PersonaDatosBancarios