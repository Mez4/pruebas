import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type EstadoCivilTipo = {
    Catalogos: ICatalogos,
    EstadosCiviles(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const EstadoCivil = (props: EstadoCivilTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.EstadosCiviles.Datos === undefined && props.Catalogos.EstadosCiviles.Cargando === false) {
            props.EstadosCiviles()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.EstadosCiviles.Error)
        placeholder = "Error!"
    else if (props.Catalogos.EstadosCiviles.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Estado Civil"

    // Rendereamos nuestro componentes
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "EstadoCivilID"}
            options={
                props.Catalogos.EstadosCiviles.Datos === undefined 
                ? [] : 
                props.Catalogos.EstadosCiviles.Datos?.map(o => ({ value: o.EstadoCivilID, label: o.EstadoCivil.toString() }))}
            funcionActualizacion={props.EstadosCiviles}
            mostrarBoton={!props.Catalogos.EstadosCiviles.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    EstadosCiviles: () => dispatch(tFunciones.EstadosCiviles({}))
})

// Exportamos nuestro componente conectado a redux
export default connect(mapStateToProps, mapDispatchToProps)(EstadoCivil)