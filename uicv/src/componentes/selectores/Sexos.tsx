import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type SexosTipo = {
    Catalogos: ICatalogos,
    SexosTipos(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const Sexos = (props: SexosTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.Sexos.Datos === undefined && props.Catalogos.Sexos.Cargando === false) {
            props.SexosTipos()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.Sexos.Error)
        placeholder = "Error!"
    else if (props.Catalogos.Sexos.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Sexo"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "SexoID"}
            options={
                props.Catalogos.Sexos.Datos === undefined
                    ? []
                    : props.Catalogos.Sexos.Datos?.map(o => ({ value: o.SexoID, label: o.Sexo.toString() }))
            }
            funcionActualizacion={props.SexosTipos}
            mostrarBoton={!props.Catalogos.Sexos.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    SexosTipos: () => dispatch(tFunciones.Sexos({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Sexos)