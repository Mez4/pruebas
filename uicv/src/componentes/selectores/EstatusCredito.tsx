import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2, ActionSelect } from '../global'

type EstadoCivilTipo = {
    Catalogos: ICatalogos,
    EstatusCredito(): any,
    disabled: boolean,
    name?: string,
    valor?: any,
    cbEstatus?(val: any): any,
}
const EstatusCredito = (props: EstadoCivilTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.EstadosCiviles.Datos === undefined && props.Catalogos.EstadosCiviles.Cargando === false) {
            props.EstatusCredito()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.EstatusCredito.Error)
        placeholder = "Error!"
    else if (props.Catalogos.EstatusCredito.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Estado de credito"

    // Rendereamos nuestro componentes
    return (
        <ActionSelect
            disabled={props.disabled}
            label="Estatus"
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "EstatusID"}
            valor={props.valor}
            options={props.Catalogos.EstatusCredito.Datos === undefined ? [] : props.Catalogos.EstatusCredito.Datos?.map(o => ({ value: o.EstatusID, label: o.EstatusNombre as string }))}
            accion={props.cbEstatus}
            // funcionActualizacion={props.EstatusCredito}
            // mostrarBoton={!props.Catalogos.EstatusCredito.Cargando}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    EstatusCredito: () => dispatch(tFunciones.EstatusCredito({}))
})

export default connect(mapStateToProps, mapDispatchToProps)(EstatusCredito)