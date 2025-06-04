import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type EstadosPaisTipo = {
    Catalogos: ICatalogos,
    EstadosPais(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const EstadosPais = (props: EstadosPaisTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.EstadosPais.Datos === undefined && props.Catalogos.EstadosPais.Cargando === false) {
            props.EstadosPais()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.EstadosPais.Error)
        placeholder = "Error!"
    else if (props.Catalogos.EstadosPais.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Estados"

    // Rendereamos nuestro componentes
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "EstadoPaisID"}
            options={props.Catalogos.EstadosPais.Datos === undefined ? [] : props.Catalogos.EstadosPais.Datos?.map(o => ({ value: o.estadoPaisNombre.toString(), label: o.estadoPaisNombre.toString() }))}
            funcionActualizacion={props.EstadosPais}
            mostrarBoton={!props.Catalogos.EstadosPais.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    EstadosPais: () => dispatch(tFunciones.EstadosPais({}))
})

// Exportamos nuestro componente conectado a redux
export default connect(mapStateToProps, mapDispatchToProps)(EstadosPais)