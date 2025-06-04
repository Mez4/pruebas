import axios from 'axios'
import React from 'react'
import { GetServerUrl } from '../../global/variables'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { CustomSelect, CustomSelect2, ActionSelect } from '../global'

let source: any
const datosDefecto: any[] = []

type GruposTipo = {
    name?: string,
    label?: string,
    unaLinea?: boolean,
    disabled?: boolean,
    oidc: IOidc,
    cargar: boolean,
    Accion?: boolean,
    GrupoID?: number,
    SucursalID?: number,
    ProductoID?: number,
    Permiso?: boolean,
    cbAccion?(val: any): any,
    //productoid
    //permiso id

}
type EstadoTipo = {
    Datos: any[]
    , Cargando: boolean
    , Error: boolean
}
class Grupos extends React.Component<GruposTipo, EstadoTipo> {
    constructor(props: GruposTipo) {
        super(props)
        this.state = {
            Datos: datosDefecto
            , Cargando: true
            , Error: false
        }
        source = axios.CancelToken.source()
    }

    //modificar grupocontroller get
    //agregar campo PermisoID bool
    //sacar en user logeado
    // if permiso es true rertur gruposusuarios vw    where usuario = usuario 

    FNGetLocal() {
        axios.post(`${GetServerUrl()}creditos/Grupo/get`, { ProductoID: this.props.ProductoID, SucursalID: this.props.SucursalID, Permiso: this.props.Permiso }, {
            cancelToken: source.token,

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta, 'respuestaaxos')
                // console.log(this.props.ProductoID, this.props.SucursalID, this.props.Permiso)
                this.setState({ Cargando: false, Error: false, Datos: respuesta.data.map(e => ({ value: e.GrupoID, label: `${e.Descripcion} - ID : ${e.GrupoID} - ${e.NombreCompleto}` })) })
            })
            .catch(error => {
                this.setState({ Cargando: false, Error: false, Datos: [] })
            })
    }

    // Is the component mounted
    componentDidMount() {
        this.FNGetLocal()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.SucursalID !== this.props.SucursalID) {
            this.FNGetLocal()
        }
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
            placeholder = "Seleccione el Grupo"

        // Opciones
        // let opciones = this.state.Datos.map(e => ({ value: e.GrupoID, label: (e.ClasificadorGrupoID == 1) ? e.Descripcion + ' ' + e.GrupoID : e.GrupoID, group: e.Sucursal })) 

        if (this.props.Accion)
            return (
                <ActionSelect
                    disabled={this.props.disabled ?? false}
                    label={this.props.label ?? 'Grupo'}
                    name={this.props.name ?? 'GrupoID'}
                    placeholder="Seleccione el Grupo"
                    options={this.state.Datos}
                    addDefault={false}
                    valor={this.props.GrupoID}
                    accion={this.props.cbAccion}
                />
            )
        // console.log(this.state.Datos, 'DATOS')
        // Si queremos un control de una sola linea...
        if (this.props.unaLinea === true)
            return (
                <CustomSelect2 name={this.props.name ?? 'GrupoID'} disabled={this.props.disabled ?? false} addDefault={true} placeholder={placeholder} label={this.props.label ?? 'Grupo'} options={this.state.Datos} isMulti={false} mostrarBoton={true} />
            )

        // Si queremos el control con etiqueta
        return (
            <CustomSelect name={this.props.name ?? 'GrupoID'} disabled={this.props.disabled ?? false} addDefault={true} placeholder={placeholder} label={this.props.label ?? 'Grupo'} options={this.state.Datos} isMulti={false} />
        )
    }

}

export default Grupos