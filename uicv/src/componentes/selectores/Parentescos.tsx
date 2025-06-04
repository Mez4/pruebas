import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type ParentescosTipo = {
    Catalogos: ICatalogos,
    ParentescosTipos(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const Parentescos = (props: ParentescosTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.Parentescos.Datos === undefined && props.Catalogos.Parentescos.Cargando === false) {
            props.ParentescosTipos()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.Parentescos.Error)
        placeholder = "Error!"
    else if (props.Catalogos.Parentescos.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Parentesco"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "ParentescoID"}
            options={
                props.Catalogos.Parentescos.Datos === undefined
                    ? []
                    : props.Catalogos.Parentescos.Datos?.map(o => ({ value: o.Parentesco.toString(), label: o.Parentesco.toString() }))
            }
            funcionActualizacion={props.ParentescosTipos}
            mostrarBoton={!props.Catalogos.Parentescos.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    ParentescosTipos: () => dispatch(tFunciones.Parentesco({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Parentescos)