import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import { iUI } from '../../interfaces/ui/iUI'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'

type VialidadesTipoTipo = {
    Catalogos: ICatalogos,
    UI: iUI,
    ViviendasTipo(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const ViviendasTipo = (props: VialidadesTipoTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.ViviendasTipo.Datos === undefined &&
            props.Catalogos.ViviendasTipo.Cargando === false //&&
            //props.UI.Producto !== undefined
        ) {
            props.ViviendasTipo()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.ViviendasTipo.Error)
        placeholder = "Error!"
    else if (props.Catalogos.ViviendasTipo.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Tipo de vivienda"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "viviendaTipoId"}
            options={
                props.Catalogos.ViviendasTipo.Datos === undefined
                    ? []
                    : props.Catalogos.ViviendasTipo.Datos?.filter(o => o.Activa).map(o => ({ value: o.ViviendaTipoId, label: o.ViviendaTipo.toString() }))
            }
            funcionActualizacion={props.ViviendasTipo}
            mostrarBoton={!props.Catalogos.ViviendasTipo.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos,
    UI: state.UI
})

const mapDispatchToProps = (dispatch: any) => ({
    ViviendasTipo: () => dispatch(tFunciones.ViviendasTipo({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(ViviendasTipo)