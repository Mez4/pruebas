import axios from 'axios'
import React from 'react'
import { GetServerUrl } from '../../global/variables'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { CustomSelect, CustomSelect2 } from '../global'


let source: any
const datosDefecto: any[] = []

/**
 * Componente selector de zonas, de momento no esta planeado integrarlo en
 * redux, pero se puede integrar como los selectores de catalogs
 * @returns Componente de REACT
 */
type ZonasTipo = {
    name?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    isProducto?: boolean,
    DirectorID?: number,
    oidc: IOidc,
    cargar: boolean
}
type EstadoTipo = {
    Datos: any[]
    , Cargando: boolean
    , Error: boolean
}
class Zonas extends React.Component<ZonasTipo, EstadoTipo> {
    constructor(props: ZonasTipo) {
        super(props)
        this.state = {
            Datos: datosDefecto
            , Cargando: true
            , Error: false
        }
        source = axios.CancelToken.source()
    }

    FNLocal = () => {
        if (this.props.cargar)
            if (this.props.isProducto)
                axios.post(`${GetServerUrl()}general/zona/GetbyProd`, { DirectorID: this.props.DirectorID }, {
                    cancelToken: source.token,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.props.oidc.user.access_token}`
                    }
                })
                    .then(respuesta => {
                        this.setState({ Cargando: false, Error: false, Datos: respuesta.data })
                    })
                    .catch(() => {
                        this.setState({ Cargando: false, Error: false, Datos: [] })
                    })
            else
                axios.post(`${GetServerUrl()}general/zona/get`, { ZonaID: 0 }, {
                    cancelToken: source.token,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.props.oidc.user.access_token}`
                    }
                })
                    .then(respuesta => {
                        this.setState({ Cargando: false, Error: false, Datos: respuesta.data })
                    })
                    .catch(() => {
                        this.setState({ Cargando: false, Error: false, Datos: [] })
                    })
    }

    // Is the component mounted
    componentDidMount() {
        this.FNLocal();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.DirectorID !== this.props.DirectorID) {
            this.FNLocal()
        }
    }

    // Will the component unmount
    componentWillUnmount() {
        if (source)
            source.cancel("Componente fue desmontado")
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
            placeholder = "Seleccione una Zona"

        // Opciones
        let opciones = this.state.Datos.filter(o => o.Activa === true).map(e => ({ value: e.ZonaID, label: e.Nombre }))

        // Si queremos un control de una sola linea...
        if (this.props.unaLinea === true)
            return (
                <CustomSelect2 name={this.props.name ?? 'ZonaID'} disabled={this.props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Zona'} options={opciones} isMulti={false} mostrarBoton={true} />
            )

        // Si queremos el control con etiqueta
        return (
            <CustomSelect name={this.props.name ?? 'ZonaID'} disabled={this.props.disabled ?? false} addDefault={true} placeholder={placeholder} label={'Zona'} options={opciones} isMulti={false} />
        )
    }

}

export default Zonas