import React from 'react'
import { CustomSelect2, ActionMultipleSelect, ActionSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as FnTiposDesmbolso from '../app/modulos/tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

/**
 * Componente selector de zonas, de momento no esta planeado integrarlo en
 * redux, pero se puede integrar como los selectores de catalogs
 * @returns Componente de REACT
 */
type TipoDesembolsoTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    TipoDesembolsoIds?: [],
    label?: string,
    isSingle?: boolean,
    SucursalID?: number,
    valor?: any,
    cbAccion?(val: any): any,
    cbDatos?(Datos: any, Id: number): any,
    oidc: IOidc
}
const TiposDesembolsos = (props: TipoDesembolsoTipo) => {

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
        axios.post(`${GetServerUrl()}Bancos/TipoDesembolso/get`, {}, {
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

    const FNGetBySucursal = () => {
        FnTiposDesmbolso.FNGetSucursalProducto(props.oidc, props.SucursalID as number, 0)
            .then((respuesta: any) => {

                // var tiposDesembolso = respuesta.map((valor: any) => {
                //     var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
                //     return obj
                // });

                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(() => {
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })

    }

    // On use effect
    React.useEffect(() => {
        if(props.SucursalID)
            FNGetBySucursal()
        // eslint-disable-next-line
    }, [])

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
        placeholder = "Seleccione un Tipo de Desembolso"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.TipoDesembolsoID, label: e.TipoDesembolso }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'TipoDesembolsoID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Tipo Desembolso'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    if(props.isSingle === true)
        return (
            <ActionSelect
                disabled={props.disabled ?? false}
                label={props.label ?? 'Tipo de Desembolso'}
                name={props.name ?? 'TipoDesembolsoID'}
                placeholder={placeholder}
                options={opciones}
                addDefault={true}
                valor={props.valor}
                accion={props.cbAccion}
            // blur={fnGetCondicionesDetalle} 
            // ref={refDistribuidor}
            />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionMultipleSelect
            disabled={props.disabled ?? false}
            label="Tipo de Desembolso"
            name={props.name ?? "TipoDesembolsoIds"}
            placeholder="Seleccione los Tipos de Desembolsos"
            options={opciones}
            addDefault={false}
            valor={props.TipoDesembolsoIds}
        />
    )
}
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

// export default connect(mapStateToProps, mapDispatchToProps)(TiposDesembolsos)

export default TiposDesembolsos

