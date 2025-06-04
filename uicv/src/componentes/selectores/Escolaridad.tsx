import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type EscolaridadTipo = {
    Catalogos: ICatalogos,
    Escolaridades(): any,
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
        if (props.Catalogos.Escolaridades.Datos === undefined && props.Catalogos.Escolaridades.Cargando === false) {
            props.Escolaridades()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.Escolaridades.Error)
        placeholder = "Error!"
    else if (props.Catalogos.Escolaridades.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Escolaridad"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "EscolaridadID"}
            options={
                props.Catalogos.Escolaridades.Datos === undefined
                    ? []
                    : props.Catalogos.Escolaridades.Datos?.map(o => ({ value: o.EscolaridadID, label: o.Escolaridad.toString() }))
            }
            funcionActualizacion={props.Escolaridades}
            mostrarBoton={!props.Catalogos.Escolaridades.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    Escolaridades: () => dispatch(tFunciones.Escolaridades({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Escolaridad)