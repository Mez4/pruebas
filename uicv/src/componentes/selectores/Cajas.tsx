import React from 'react'
import { ActionSelect, CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as FnCaja from '../app/modulos/tesoreria/CompTesoreria/CatalogoCaja/Funciones'
import * as FnCajaUsuario from '../app/modulos/tesoreria/CompTesoreria/CajasUsuarios/Funciones'

type CuentasTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    ProductoID?: number,
    SucursalId?: number,
    RecSuc?:  boolean,
    IsAction?: boolean,
    oidc: IOidc
}

const Cajas = (props: CuentasTipo) => {

    const datosDefecto: any[] = []
    const [Estado, definirEstado] = React.useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
    })

    const FNGetLocal = () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))

        
    if(props.SucursalId! > 0 || props.RecSuc)
        FnCajaUsuario.FNGetbySucursal(props.oidc, props.SucursalId!)
            .then((respuesta: any) => {
                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(() => {
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    else       
        FnCajaUsuario.FNGetCajas(props.oidc)
            .then((respuesta: any) => {
                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(() => {
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    }

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
        // eslint-disable-next-line
    }, [props.SucursalId])

    let placeholder: string
    if (Estado.Error)
        placeholder = "Error!"
    else if (Estado.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Seleccione una Caja"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.CajaID, label: e.Nombre }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'CajaID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Caja'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    if (props.IsAction === true)
        return (
            <ActionSelect name={props.name ?? 'CajaID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Caja'} options={opciones} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'CajaID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Caja'} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default Cajas//connect(mapStateToProps, mapDispatchToProps)(Cajas)
