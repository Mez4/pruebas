import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type EscolaridadTipo = {
    Catalogos: ICatalogos,
    Ocupaciones(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const Escolaridad = (props: EscolaridadTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.Ocupaciones.Datos === undefined && props.Catalogos.Ocupaciones.Cargando === false) {
            props.Ocupaciones()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.Ocupaciones.Error)
        placeholder = "Error!"
    else if (props.Catalogos.Ocupaciones.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Ocupaciones"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "OcupacionID"}
            options={
                props.Catalogos.Ocupaciones.Datos === undefined
                    ? []
                    : props.Catalogos.Ocupaciones.Datos?.map(o => ({ value: o.Id, label: o.Ocupacion.toString() }))
            }
            funcionActualizacion={props.Ocupaciones}
            mostrarBoton={!props.Catalogos.Ocupaciones.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    Ocupaciones: () => dispatch(tFunciones.Ocupaciones({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Escolaridad)