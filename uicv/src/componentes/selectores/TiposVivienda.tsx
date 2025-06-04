import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type ViviendaTipo = {
    Catalogos: ICatalogos,
    TiposViviendas(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const TipoVivienda = (props: ViviendaTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.TipoVivienda.Datos === undefined && props.Catalogos.TipoVivienda.Cargando === false) {
            props.TiposViviendas()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.TipoVivienda.Error)
        placeholder = "Error!"
    else if (props.Catalogos.TipoVivienda.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Tipo Vivienda"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "TipoViviendaID"}
            options={
                props.Catalogos.TipoVivienda.Datos === undefined
                    ? []
                    : props.Catalogos.TipoVivienda.Datos?.map(o => ({ value: o.TipoViviendaID, label: o.Descripcion.toString() }))
            }
            funcionActualizacion={props.TiposViviendas}
            mostrarBoton={!props.Catalogos.TipoVivienda.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    TiposViviendas: () => dispatch(tFunciones.TiposViviendas({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(TipoVivienda)