import React from 'react'
import { CustomSelect2, ActionSelect, ActionAsyncSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as Funciones from '../app/modulos/distribuidor/CompDistribuidor/Distribuidor/Funciones'

type DistribuidoresTipo = {
    name?: string,
    label?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    SucursalID?: number,
    GrupoID?: number,
    RequiereSuc?: boolean,
    SinGrupo?: boolean,
    WithProducto?: boolean,
    valor?: any,
    buscar?: any,
    EsZonal?: boolean,
    cbAccion?(val: any): any,
    oidc: IOidc
}

const Distribuidores = (props: DistribuidoresTipo) => {
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
        if (props.EsZonal) {
            Funciones.FNGetbyZona(props.oidc, props.SucursalID!)
                .then((respuesta: any) => {
                    if (isMounted)
                        definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                })
                .catch(() => {
                    if (isMounted)
                        definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                })
        } else {
            if (props.WithProducto) {
                Funciones.FNGetBySucursalProd(props.oidc, props.SucursalID, props.GrupoID)
                    .then((respuesta: any) => {
                        if (isMounted)
                            definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                    })
                    .catch(() => {
                        if (isMounted)
                            definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                    })
            } else {
                if (props.SinGrupo)
                    Funciones.FNGetSinGrupo(props.oidc)
                        .then((respuesta: any) => {
                            if (isMounted)
                                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                        })
                        .catch(() => {
                            if (isMounted)
                                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                        })
                else
                    if (props.SucursalID || props.GrupoID)
                        Funciones.FNGetBySucursalProd(props.oidc, props.SucursalID, props.GrupoID)
                            .then((respuesta: any) => {
                                if (isMounted)
                                    definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                            })
                            .catch(() => {
                                if (isMounted)
                                    definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                            })
                    else
                        if (!props.RequiereSuc)
                            Funciones.FNGet(props.oidc)
                                .then((respuesta: any) => {
                                    console.log('respuesta: ', respuesta)
                                    if (isMounted)
                                        definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                                })
                                .catch(() => {
                                    if (isMounted)
                                        definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
                                })
                        else
                            definirEstado(e => ({ Cargando: false, Error: false, Datos: [] }))
            }
        }
    } 

    const loadOptionsDistribuidores = (Nombre: string, callback: any) => {

        // let DistribuidorID = props.DistribuidorID

        Funciones.FNGetDistSucursal(props.oidc, Nombre )
            .then((respuesta: any) => {

                var distribuidores = respuesta.map(e => ({ value: e.DistribuidorID, label: e.Distribuidor }));
                // clientes = { value: 0, label: 'Todos', ...clientes }
                definirEstado(s => ({ ...s, Datos: distribuidores }))

                callback(distribuidores)

            })
            .catch(() => {

                definirEstado(s => ({ ...s, Datos: [] }))

                callback([])
            })
    }

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
        // eslint-disable-next-line
    }, [props.SucursalID, props.GrupoID])

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
        placeholder = `Seleccione una ${props.label ?? 'Socia'}`

    // Opciones del control
    let opciones = (props.buscar) ? Estado.Datos.map(e => ({ value: e.DistribuidorID, label: e.Distribuidor, group: e.Sucursal_Nombre })) : Estado.Datos.map(e => ({ value: e.DistribuidorID, label: e.DistribuidorID + ' - ' + e.PersonaNombre, group: e.Sucursal_Nombre }))

    if (props.buscar)
        return (
            <ActionAsyncSelect
                loadOptions={loadOptionsDistribuidores}
                disabled={props.disabled ?? false}
                label="Socia"
                name={props.name ? props.name : "DistribuidorID"}
                placeholder="Buscar Socia"
                options={Estado.Datos}
                addDefault={false}
                valor={props.valor}
                accion={props.cbAccion}
                noOptionsMessage={'Escriba el nombre de la socia'}
            // ref={refCliente}
            />
        )

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'DistribuidorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={props.label ?? 'Socia'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionSelect
            disabled={props.disabled ?? false}
            label={props.label ?? 'Socia'}
            name={props.name ?? 'DistribuidorID'}
            placeholder={placeholder}
            options={opciones}
            addDefault={true}
            valor={props.valor}
            accion={props.cbAccion}
        // blur={fnGetCondicionesDetalle} 
        // ref={refDistribuidor}
        />
        // <CustomSelect name={props.name ?? 'DistribuidorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Distribuidor'} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Distribuidores)