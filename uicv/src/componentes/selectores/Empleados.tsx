import React from 'react'
import { CustomSelect2, ActionSelect, ActionAsyncSelect } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as Funciones from '../app/modulos/general/CompGeneral/Empleado/Funciones'

type DistribuidoresTipo = {
    name?: string,
    label?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    SucursalID?: number,
    // RequiereSuc?: boolean,
    // WithProducto?: boolean,
    valor?: any,
    buscar?: any,
    cbAccion?(val: any): any,
    cbDatos?(Datos: any, Id: number): any
    oidc: IOidc
}

const Empleados = (props: DistribuidoresTipo) => {
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
        let Datos = {SucursalID: props.SucursalID as number}
        Funciones.FNGetBySucursal(props.oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted)
                {
                    definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta }))
                    // let Estatus = respuesta[0].Est_cod
                    // let productoID = respuesta[0].ProductoID
                    // let DatosEmpleado = { Estatus, productoID } 
                    if(props.cbDatos)
                        props.cbDatos(respuesta, props.valor)

                }
            })
            .catch(() => {
                if (isMounted)
                    definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })       
    }

    const loadOptionsDistribuidores = (Nombre: string, callback: any) => {

        // let DistribuidorID = props.DistribuidorID

        let Datos = {SucursalID: props.SucursalID as number, Nombre}

        Funciones.FNGetBySucursal(props.oidc, Datos )
            .then((respuesta: any) => {

                var empleados = respuesta.map(e => ({ value: e.PersonaID, label: e.PersonaID + ' - ' + e.NombreCompleto }));
                // clientes = { value: 0, label: 'Todos', ...clientes }
                definirEstado(s => ({ ...s, Datos: empleados }))

                callback(empleados)

            })
            .catch(() => {

                definirEstado(s => ({ ...s, Datos: [] }))

                callback([])
            })
    }

    // On use effect
    React.useEffect(() => {
        if(props.SucursalID! > 0)
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
        placeholder = `Seleccione un ${props.label ?? 'Empleado'}`

    // Opciones del control
    let opciones = (props.buscar) ? Estado.Datos.map(e => ({ value: e.PersonaID, label: e.PersonaID + ' - ' + e.NombreCompleto })) : Estado.Datos.map(e => ({ value: e.PersonaID, label: e.PersonaID + ' - ' + e.NombreCompleto }))

    if (props.buscar)
        return (
            <ActionAsyncSelect
                loadOptions={loadOptionsDistribuidores}
                disabled={props.disabled ?? false}
                label="Empleado"
                name={props.name ? props.name : "EmpleadoId"}
                placeholder="Buscar Empleado"
                options={Estado.Datos}
                addDefault={false}
                valor={props.valor}
                accion={props.cbAccion}
                noOptionsMessage={'Escriba el nombre del Empleado'}
            // ref={refCliente}
            />
        )

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'EmpleadoId'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={props.label ?? 'Empleado'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <ActionSelect
            disabled={props.disabled ?? false}
            label={props.label ?? 'Empleado'}
            name={props.name ?? 'EmpleadoId'}
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

export default connect(mapStateToProps, mapDispatchToProps)(Empleados)