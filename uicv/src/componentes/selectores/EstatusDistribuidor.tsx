import React from 'react'
import { CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'

import { GetServerUrl } from '../../global/variables'
import axios from 'axios'
// import { iUI } from '../../interfaces/ui/iUI'

type EstatusDistribuidorTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    valor: string,
    oidc: IOidc,
    // iUI: iUI
}
const EstatusDistribuidor = (props: EstatusDistribuidorTipo) => {

    // Declaramos el estado del componente
    const datosDefecto: any[] = []
    const [Estado, definirEstado] = React.useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
    })

    // Declare the FNGet
    const FNGetLocal = () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))
        axios.post(`${GetServerUrl()}distribuidores/estatus/get`, { Id: 0 }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta.data }))
            })
            .catch(() => {
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    }

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
        // eslint-disable-next-line
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (Estado.Error)
        placeholder = "Error!"
    else if (Estado.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Seleccione un Estatus"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.DistribuidoresEstatusID, label: e.DistribuidoresEstatus }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'DistribuidoresEstatusID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Estatus'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'DistribuidoresEstatusID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Estatus'} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
    // iUI: state.UI
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EstatusDistribuidor)