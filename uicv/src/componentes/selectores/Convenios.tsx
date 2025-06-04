import React from 'react'
import { CustomSelect2, ActionMultipleSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'


import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

type ConvenioTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    ProductoID?: number,
    ConveniosIds?: [],
    oidc: IOidc
}
const Convenios = (props: ConvenioTipo) => {

    // Checamos que el componente este montado
    // let isMounted = React.useRef(true)

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
        axios.post(`${GetServerUrl()}Bancos/CatalogoConvenios/get`, { ProductoID: props.ProductoID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta)
                // if (isMounted)
                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta.data }))
            })
            .catch(() => {
                // if (isMounted)
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    }

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
        // eslint-disable-next-line
    }, [props.ProductoID])

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
        placeholder = "Seleccione un Convenio"

    // Opciones del control
    let opciones = Estado.Datos.length > 0 ? Estado.Datos.map(e => ({ value: e.ConvenioID, label: e.convenio, group: e.nombreComercialEmpresa })) : []


    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'ConvenioID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Convenio'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Convenio"
            name="ConvenioID"
            placeholder="Seleccione los Convenios"
            options={opciones}
            addDefault={false}
            valor={props.ConveniosIds}
        />
    )
}

export default Convenios

