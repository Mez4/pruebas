import React from 'react'
import { ActionAsyncSelect, ActionSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as Funciones from '../app/modulos/distribuidor/CompDistribuidor/Cliente/Funciones'

type ClientesTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled: boolean,
    DistribuidorID: number,
    ClienteId?: number,
    oidc: IOidc,
    cbCliente?(val: any): any,
    noAsync?: boolean,
    noDist?: boolean,
    SucursalID?: number
}
const Clientes = (props: ClientesTipo) => {
    // Checamos que el componente este montado
    // let isMounted = React.useRef(true)

    // Declaramos el estado del componente
    const datosDefecto: any[] = [] //[{ value: 0, label: 'Todos' }]
    const [Estado, definirEstado] = React.useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
    })



    // #################################################
    // Effectos de la forma
    // >>

    const FNGetLocal = () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))

        Funciones.FNGetbyDist(props.oidc, { DistribuidorID: props.DistribuidorID, ProductoID: 0 })
            .then((respuesta: any) => {
                // if (isMounted)
                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(() => {
                // if (isMounted)
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    }

    // Declare the FNGet
    const loadOptionsClientes = (Nombre: string, callback: any) => {

        if (props.noDist && props.SucursalID) {
            Funciones.FNGetClienteZona(props.oidc, { SucursalID: props.SucursalID!, Nombre })
                .then((res: any) => {

                    var clientes = res.map(e => ({ value: e.PersonaID, label: e.PersonaID + ' - ' + e.NombreCompleto }));
                    // clientes = { value: 0, label: 'Todos', ...clientes }
                    definirEstado(s => ({ ...s, Datos: clientes }))

                    callback(clientes)

                })
                .catch(() => {

                    definirEstado(s => ({ ...s, Datos: [] }))

                    callback([])

                })

        }
        else {

            let DistribuidorID = props.DistribuidorID

            Funciones.FNGet(props.oidc, { DistribuidorID, Nombre })
                .then((respuesta: any) => {

                    var clientes = respuesta.map(e => ({ value: e.PersonaID, label: e.PersonaID + ' - ' + e.NombreCompleto }));
                    // clientes = { value: 0, label: 'Todos', ...clientes }
                    definirEstado(s => ({ ...s, Datos: clientes }))

                    callback(clientes)

                })
                .catch(() => {

                    definirEstado(s => ({ ...s, Datos: [] }))

                    callback([])
                })
        }
    }

    React.useEffect(() => {
        // console.log('ClienteId: ', props.ClienteId)
        FNGetLocal()
        // eslint-disable-next-line
    }, [props.DistribuidorID])

    // <<
    // Effectos de la forma
    // #################################################

    // Generamos el placeholder
    // let placeholder: string
    // if (Estado.Error)
    //     placeholder = "Error!"
    // else if (Estado.Cargando)
    //     placeholder = "Cargando..."
    // else
    //     placeholder = "Buscar Cliente"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.ClienteID, label: e.ClienteID + ' - ' + e.NombreCompleto }))

    // Si queremos un control de una sola linea...
    // if (props.unaLinea === true)
    //     return (
    //         <CustomSelect2 name={props.name ?? 'ClienteId'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Coordinador'} options={opciones} isMulti={false} mostrarBoton={true} />
    //     )

    if (props.noAsync)
        return (
            <ActionSelect
                disabled={props.disabled ?? false}
                label="Cliente"
                name={props.name ?? 'DistribuidorID'}
                placeholder={"Seleccione el cliente"}
                options={opciones}
                addDefault={true}
                valor={props.ClienteId}
                accion={props.cbCliente}
            // blur={fnGetCondicionesDetalle} 
            // ref={refDistribuidor}
            />
            // <CustomSelect name={props.name ?? 'DistribuidorID'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Distribuidor'} options={opciones} isMulti={false} />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionAsyncSelect
            loadOptions={loadOptionsClientes}
            disabled={props.disabled}
            label="Cliente"
            name={props.name ? props.name : "ClienteId"}
            placeholder="Buscar cliente"
            options={Estado.Datos}
            addDefault={false}
            valor={props.ClienteId}
            accion={props.cbCliente}
            ref={undefined}
            noOptionsMessage={'Escriba el nombre del cliente'}
        // ref={refCliente}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Clientes)