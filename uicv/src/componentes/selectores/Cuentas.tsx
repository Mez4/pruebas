import React from 'react'
import { CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as FnCuenta from '../app/modulos/bancos/CompBancos/BancoCuenta/Funciones'

/**
 * Componente selector de zonas, de momento no esta planeado integrarlo en
 * redux, pero se puede integrar como los selectores de catalogs
 * @returns Componente de REACT
 */
type CuentasTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    ProductoID?: number,
    SucursalId?: number,
    oidc: IOidc
}
const Cuentas = (props: CuentasTipo) => {

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

        FnCuenta.FNGet(props.oidc, props.ProductoID, props.SucursalId)
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
    }, [props.ProductoID, props.SucursalId])

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
        placeholder = "Seleccione una Cuenta"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.CuentaBancoID, label: e.NumeroCuenta }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'CuentaId'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Cuenta'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'CuentaId'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Cuenta'} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default Cuentas //connect(mapStateToProps, mapDispatchToProps)(Cuentas)

// export default Sucursales