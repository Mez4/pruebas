import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type EmpresasExperienciaTipo = {
    Catalogos: ICatalogos,
    EmpresasExperienciaTipos(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const EmpresasExperiencia = (props: EmpresasExperienciaTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.EmpresasExperiencia.Datos === undefined && props.Catalogos.EmpresasExperiencia.Cargando === false) {
            props.EmpresasExperienciaTipos()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.EmpresasExperiencia.Error)
        placeholder = "Error!"
    else if (props.Catalogos.EmpresasExperiencia.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Empresas Experiencia"

    // Rendereamos nuestro componente
    return (
        <CustomSelect2
            label={props.label}
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "EmpresaExperienciaID"}
            options={
                props.Catalogos.EmpresasExperiencia.Datos === undefined
                    ? []
                    : props.Catalogos.EmpresasExperiencia.Datos?.map(o => ({ value: `${o.EmpresaExperienciaID},${o.Descripcion}`, label: o.Descripcion.toString() }))
            }
            funcionActualizacion={props.EmpresasExperienciaTipos}
            mostrarBoton={!props.Catalogos.EmpresasExperiencia.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    EmpresasExperienciaTipos: () => dispatch(tFunciones.EmpresasExperiencia({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmpresasExperiencia)