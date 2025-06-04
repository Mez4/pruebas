import axios from 'axios'
import React from 'react'
import { GetServerUrl } from '../../global/variables'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { CustomSelect, CustomSelect2 } from '../global'

let source: any
const datosDefecto: any[] = []

type ClasificadorGruposTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    oidc: IOidc,
    cargar: boolean
}
type EstadoTipo = {
    Datos: any[]
    , Cargando: boolean
    , Error: boolean
}
class ClasificadorGrupos extends React.Component<ClasificadorGruposTipo, EstadoTipo> {
    constructor(props: ClasificadorGruposTipo) {
        super(props)
        this.state = {
            Datos: datosDefecto
            , Cargando: true
            , Error: false
        }
        source = axios.CancelToken.source()
    }

    // Is the component mounted
    componentDidMount() {
        if (this.props.cargar)
            axios.post(`${GetServerUrl()}creditos/ClasificadorGrupo/get`, {}, {
                cancelToken: source.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.props.oidc.user.access_token}`
                }
            })
                .then(respuesta => {
                    this.setState({ Cargando: false, Error: false, Datos: respuesta.data })
                })
                .catch(error => {
                    this.setState({ Cargando: false, Error: false, Datos: [] })
                })
    }

    // Will the component unmount
    componentWillUnmount() {
        if (source) {
            source.cancel("Componente fue desmontado")
        }
    }

    // Rendereamos el componente
    render() {

        // Generamos el placeholder
        let placeholder: string
        if (this.state.Error)
            placeholder = "Error!"
        else if (this.state.Cargando)
            placeholder = "Cargando..."
        else
            placeholder = "Seleccione el Clasificador de Grupo"

        // Opciones
        let opciones = this.state.Datos.map(e => ({ value: e.ClasificadorGrupoID, label: e.Descripcion })) 

        // Si queremos un control de una sola linea...
        if (this.props.unaLinea === true)
            return (
                <CustomSelect2 name={this.props.name ?? 'ClasificadorGrupoID'} disabled={this.props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Clasificador de Grupo'} options={opciones} isMulti={false} mostrarBoton={true} />
            )

        // Si queremos el control con etiqueta
        return (
            <CustomSelect name={this.props.name ?? 'ClasificadorGrupoID'} disabled={this.props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Clasificador de Grupo'} options={opciones} isMulti={false} />
        )
    }

}

export default ClasificadorGrupos