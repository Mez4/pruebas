import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type DistribuidorTipo = {
    Catalogos: ICatalogos,
    TiposDistribuidores(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const TipoDistribuidor = (props: DistribuidorTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.TipoDistribuidor.Datos === undefined && props.Catalogos.TipoDistribuidor.Cargando === false) {
            props.TiposDistribuidores()
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
        placeholder = "Tipo Socia"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "DistribuidorTiposID"}
            options={
                props.Catalogos.TipoDistribuidor.Datos === undefined
                    ? []
                    : props.Catalogos.TipoDistribuidor.Datos?.map(o => ({ value: o.DistribuidorTiposID, label: o.DistribuidorTipos.toString() }))
            }
            funcionActualizacion={props.TiposDistribuidores}
            mostrarBoton={!props.Catalogos.TipoDistribuidor.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    TiposDistribuidores: () => dispatch(tFunciones.TiposDistribuidores({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(TipoDistribuidor)