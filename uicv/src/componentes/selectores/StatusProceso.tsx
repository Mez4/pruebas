import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type StatusProcesoTipo = {
    Catalogos: ICatalogos,
    StatusProcesosTipos(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const StatusProceso = (props: StatusProcesoTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.StatusProcesos.Datos === undefined && props.Catalogos.StatusProcesos.Cargando === false) {
            props.StatusProcesosTipos()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.StatusProcesos.Error)
        placeholder = "Error!"
    else if (props.Catalogos.StatusProcesos.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Estatus Proceso"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "StatusProcesosID"}
            options={
                props.Catalogos.StatusProcesos.Datos === undefined
                    ? []
                    : props.Catalogos.StatusProcesos.Datos?.map(o => ({ value: o.StatusProcesoID, label: o.Descripcion.toString() }))
            }
            funcionActualizacion={props.StatusProcesosTipos}
            mostrarBoton={!props.Catalogos.StatusProcesos.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    StatusProcesosTipos: () => dispatch(tFunciones.StatusProceso({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(StatusProceso)