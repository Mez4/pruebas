import React from 'react'
import { CustomSelect, CustomSelect2 } from '../global'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import * as FnConvenios from '../app/modulos/cobranza/CompCobranza/Convenios/Funciones'

type ConveniosPlazosTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    DiasAtraso: number,
    valor?: any,
    Saldo: number,
    oidc: IOidc
}
const ConveniosPlazos = (props: ConveniosPlazosTipo) => {
    // console.log('props conv plazos: ', props)

    // Checamos que el componente este montado
    // let isMounted = React.useRef(true)

    // Declaramos el estado del componente
    const datosDefecto: any[] = []
    const [Estado, definirEstado] = React.useState({
        Datos: datosDefecto
        , Cargando: false
        , Error: false
    })

    // Declare the FNGet
    const FNGetLocal = () => {
        definirEstado(e => ({ ...e, Cargando: true, Error: false, Datos: [] }))

        FnConvenios.GetPlazos(props.oidc, { DiasAtraso: props.DiasAtraso, Saldo: props.Saldo })
            .then((respuesta: any) => {
                definirEstado(e => ({ Cargando: false, Error: false, Datos: respuesta.data }))
            })
            .catch(() => {
                definirEstado(e => ({ Cargando: false, Error: true, Datos: [] }))
            })
    }

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
        // eslint-disable-next-line
    }, [])

    // <<
    // Effectos de la forma
    // #################################################

    // Generamos el placeholder
    let placeholder: string
    if (Estado.Error)
        placeholder = "Error!"
    else if (Estado.Cargando)
        placeholder = "Cargando..."
    else
        placeholder = "Seleccione el Plazo"

    // Opciones del control
    let opciones = Estado.Datos.map(e => ({ value: e.plazo, label: e.plazo }))

    // Si queremos un control de una sola linea...
    if (props.unaLinea === true)
        return (
            <CustomSelect2 name={props.name ?? 'Plazos'} valor={props.valor} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Plazos'} options={opciones} isMulti={false} mostrarBoton={true} />
        )

    // Si queremos el control con etiqueta
    return (
        <CustomSelect name={props.name ?? 'Plazos'} disabled={props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Plazos'} options={opciones} isMulti={false} />
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default ConveniosPlazos 