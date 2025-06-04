import React from 'react'
import { connect } from 'react-redux'
import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as tFunciones from '../../redux/catalogos/functionesThunk'
import { CustomSelect2 } from '../global'

type PagareEstatusTipo = {
    Catalogos: ICatalogos,
    PagareEstatus(): any,
    disabled: boolean,
    name?: string
}

const PagareEstatus = (props: PagareEstatusTipo) => {

    // Utilizamos un efecto de react para obtener los tipos de identificacion (utilizando redux)
    React.useEffect(() => {

        // Validamos el estado de la aplicaicon
        if (props.Catalogos.PagareEstatus.Datos === undefined && props.Catalogos.PagareEstatus.Cargando === false) {
            props.PagareEstatus()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Generamos el placeholder
    let placeholder: string
    if (props.Catalogos.PagareEstatus.Error)
        placeholder = "Error!"
    else if (props.Catalogos.PagareEstatus.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Estatus Pagare"

    // Rendereamos nuestro componentes
    return (
        <CustomSelect2
            disabled={props.disabled}
            placeholder={placeholder}
            addDefault={true}
            name={props.name ?? "PagareEstatusId"}
            options={props.Catalogos.PagareEstatus.Datos === undefined ? [] : props.Catalogos.PagareEstatus.Datos?.map(o => ({ value: o.pagareEstatusId, label: o.pagareEstatusDesc.toString() }))}
            funcionActualizacion={props.PagareEstatus}
            mostrarBoton={!props.Catalogos.PagareEstatus.Cargando}
        />
    )
}

const mapStateToProps = (state: IEstado) => ({
    Catalogos: state.Catalogos
})

const mapDispatchToProps = (dispatch: any) => ({
    PagareEstatus: () => dispatch(tFunciones.PagareEstatus({}))
})

// Exportamos nuestro componente conectado a redux
export default connect(mapStateToProps, mapDispatchToProps)(PagareEstatus)