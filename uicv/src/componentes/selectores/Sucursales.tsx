import React from 'react'
import { ActionSelect, CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as FnCajas from '../app/modulos/tesoreria/CompTesoreria/CajasUsuarios/Funciones'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'
import { toast } from 'react-toastify'
// import { iUI } from '../../interfaces/ui/iUI'
/**
 * Componente selector de zonas, de momento no esta planeado integrarlo en
 * redux, pero se puede integrar como los selectores de catalogs
 * @returns Componente de REACT
 */
type SucursalTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    ProductoID?: number,
    ZonaID?: number,
    Permiso?: boolean,
    IsAction?: boolean,
    DistribuidorID?: number,
    valor: number,
    oidc: IOidc,
    label?: string,
    onChange?: (val: any) => any
    // iUI: iUI
}
const Sucursales = (props: SucursalTipo) => {

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

        if (props.DistribuidorID) { //GetByEmpresaDistribuidor
            axios.post(`${GetServerUrl()}general/sucursal/GetByEmpresaDistribuidorProd`, { ProductoID: props.ProductoID, DistribuidorID: props.DistribuidorID }, {
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
        } else {
            if (props.Permiso) {
                FnCajas.FNGetSucursales(props.oidc)
                    .then((respuesta: any) => {
                        definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                    })
                    .catch(() => {
                        definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                    })
            } else {
                axios.post(`${GetServerUrl()}general/sucursal/getprod`, { ProductoID: props.ProductoID, ZonaID: props.ZonaID }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${props.oidc.user.access_token}`
                    }
                })
                    .then(respuesta => {
                        if (respuesta == undefined) {
                            // toast.error('error');
                            return;
                        }
                        definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta.data }))
                    })
                    .catch(() => {
                        definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                    })
            }
        }
    }

    // On use effect
    React.useEffect(() => {
        // console.log('ProductoID: ', props.ProductoID)
        FNGetLocal()
        // eslint-disable-next-line
    }, [props.ProductoID, props.ZonaID, props.DistribuidorID])

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
        placeholder = "Seleccione una Sucursal"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.SucursalID, label: e.Nombre, group: e.ZonaNombre }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'SucursalID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Sucursal'} options={opciones} isMulti={false} mostrarBoton={true} valor={props.valor} />
        )

    // Si queremos el control con etiqueta

    if (props.IsAction === true)
        return (
            <ActionSelect accion={props.onChange} name={props.name ?? 'SucursalID'} valor={props.valor} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={props.label ? props.label : "Sucursal"} options={opciones} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'SucursalID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={props.label ? props.label : "Sucursal"} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
    // iUI: state.UI
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Sucursales)

// export default Sucursales
