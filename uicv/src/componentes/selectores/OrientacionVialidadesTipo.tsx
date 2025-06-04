import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'

type OrientacionVialidadesTipoTipo = {
    Catalogos: ICatalogos,
    OrientacionVialidadesTipo(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const OrientacionVialidadesTipo = (props: OrientacionVialidadesTipoTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.OrientacionVialidadTipo.Datos === undefined && props.Catalogos.OrientacionVialidadTipo.Cargando === false) {
            props.OrientacionVialidadesTipo()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.OrientacionVialidadTipo.Error)
        placeholder = "Error!"
    else if (props.Catalogos.OrientacionVialidadTipo.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Orientacion"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "orientacionVialidadTipoId"}
            options={
                props.Catalogos.OrientacionVialidadTipo.Datos === undefined
                    ? []
                    : props.Catalogos.OrientacionVialidadTipo.Datos?.map(o => ({ value: o.orientacionVialidadTipoId, label: o.orientacionVialidadTipo.toString() }))
            }
            funcionActualizacion={props.OrientacionVialidadesTipo}
            mostrarBoton={!props.Catalogos.OrientacionVialidadTipo.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    OrientacionVialidadesTipo: () => dispatch(tFunciones.OrientacionVialidadesTipo({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrientacionVialidadesTipo)