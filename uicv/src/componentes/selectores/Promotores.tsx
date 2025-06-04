import React from 'react'
import { CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as Funciones from '../app/modulos/creditos/CompCreditos/CreditoPromotor/Funciones'

type PromotoresTipo = {    
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    SucursalID?: number,
    valor: number,
    oidc: IOidc,
    label?: string,
}

const Promotores = (props: PromotoresTipo) => { 
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
        if(props.SucursalID)
            Funciones.FNGetBySucursal(props.oidc, props.SucursalID)
                .then((respuesta: any) => {
                    if (isMounted)
                        definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                })
                .catch(() => {
                    if (isMounted)
                        definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                })
        else
            Funciones.FNGet(props.oidc)
                .then((respuesta: any) => {
                    if (isMounted)
                        definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
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
    }, [props.SucursalID])

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
        placeholder = "Seleccione un Promotor"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.creditoPromotorId, label: e.creditoPromotorId + ' - ' + e.creditoPromotorNombre, group: e.SucursalNombre}))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'PromotorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Promotor'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor}/>
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'PromotorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Promotor'} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Promotores)