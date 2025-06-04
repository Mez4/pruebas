import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type TipoIdentificacionTipo = {
    Catalogos: ICatalogos,
    IndeitifacionesTipos(): any,
    disabled: boolean,
    label: string,
    placeholder?: string,
    name?: string,
    accion?(val: any): any,
    valor?: any,
}
const TipoIdentificacion = (props: TipoIdentificacionTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.IdentificacionesTipos.Datos === undefined && props.Catalogos.IdentificacionesTipos.Cargando === false) {
            props.IndeitifacionesTipos()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.IdentificacionesTipos.Error)
        placeholder = "Error!"
    else if (props.Catalogos.IdentificacionesTipos.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Tipo de identificación"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "identificacionTipoId"}
            options={
                props.Catalogos.IdentificacionesTipos.Datos === undefined
                    ? []
                    : props.Catalogos.IdentificacionesTipos.Datos?.filter(o => o.activo).map(o => ({ value: o.identificacionTipoId, label: o.identificacionDesc.toString() }))
            }
            funcionActualizacion={props.IndeitifacionesTipos}
            mostrarBoton={!props.Catalogos.IdentificacionesTipos.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    IndeitifacionesTipos: () => dispatch(tFunciones.IndeitifacionesTipos({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(TipoIdentificacion)