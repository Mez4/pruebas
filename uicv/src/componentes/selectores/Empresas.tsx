import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'


type EmpresasTipo = {
    Catalogos: ICatalogos,
    Empresas(): any,
    disabled: boolean,
    name?: string,
    label?: string,
    accion?(val: any): any,
    valor?: any,
}
const Empresas = (props: EmpresasTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.Empresas.Datos === undefined && props.Catalogos.EmpresasExperiencia.Cargando === false) {
            props.Empresas()
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
            name={props.name ?? "empresaId"}
            options={
                props.Catalogos.Empresas.Datos === undefined
                    ? []
                    : props.Catalogos.Empresas.Datos?.map(o => ({ value: o.empresaId, label: `${o.empresaNombre.toString()} | ${o.empresaRazonSocial}` }))
            }
            funcionActualizacion={props.Empresas}
            mostrarBoton={!props.Catalogos.Empresas.Cargando}
            accion={props.accion}
            valor={props.valor}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    Empresas: () => dispatch(tFunciones.Empresas({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(Empresas)