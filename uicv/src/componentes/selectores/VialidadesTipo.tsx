import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'

type VialidadesTipoTipo = {
    Catalogos: ICatalogos,
    VialidadesTipo(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const VialidadesTipo = (props: VialidadesTipoTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.VialidadesTipo.Datos === undefined && props.Catalogos.VialidadesTipo.Cargando === false) {
            props.VialidadesTipo()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.VialidadesTipo.Error)
        placeholder = "Error!"
    else if (props.Catalogos.VialidadesTipo.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "T.Vialidad"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "vialidadTipoId"}
            options={
                props.Catalogos.VialidadesTipo.Datos === undefined
                    ? []
                    : props.Catalogos.VialidadesTipo.Datos?.map(o => ({ value: o.vialidadTipoId, label: o.vialidadTipo.toString() }))
            }
            funcionActualizacion={props.VialidadesTipo}
            mostrarBoton={!props.Catalogos.VialidadesTipo.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    VialidadesTipo: () => dispatch(tFunciones.VialidadesTipo({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(VialidadesTipo)