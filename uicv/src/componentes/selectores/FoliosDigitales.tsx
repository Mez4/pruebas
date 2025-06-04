import axios from 'axios'
import React from 'react'
import { GetServerUrl } from '../../global/variables'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { ActionAsyncCreatableSelect } from '../global'


let source: any
const datosDefecto: any[] = []
const optClientes: any[] = []

type FoliosDigitalesTipo = {
    name: string,
    disabled: boolean,
    oidc: IOidc,
    cargar: boolean
    valor: number,
    accion?(val: any): any,
}
type EstadoTipo = {
    Datos: any[]
    , Cargando: boolean
    , Error: boolean
    , optClientes
}
class FoliosDigitales extends React.Component<FoliosDigitalesTipo, EstadoTipo> {
    constructor(props: FoliosDigitalesTipo) {
        super(props)
        this.state = {
            Datos: datosDefecto
            , Cargando: true
            , Error: false
            , optClientes: []
        }
        source = axios.CancelToken.source()
    }

    FNGet = (oidc: IOidc, Folio: string) =>
        new Promise((Resolver: any, Denegar: any) => {

            axios.post(`${GetServerUrl()}AppVale/AppDistribuidores/getFoliosDigitales`, { Folio }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            })
                .then(respuesta => {
                    Resolver(respuesta.data)
                })
                .catch(error => {
                    Denegar(error)
                })
        })

    // Is the component mounted
    componentDidMount() {
        if (this.props.cargar)
            this.FNGet(this.props.oidc, '').then((respuesta: any) => {

                var clientes = respuesta.map((v: any) => {
                    var obj = { value: v.Folio, label: v.Folio };
                    return obj
                });

                this.setState(s => ({ ...s, optClientes: clientes }))

            })
                .catch(() => {

                    this.setState(s => ({ ...s, optClientes: [] }))

                })

    }

    // Will the component unmount
    componentWillUnmount() {
        if (source)
            source.cancel("Componente fue desmontado")
    }

    loadOptionsClientes = (inputText: string, callback: any) => {
        this.FNGet(this.props.oidc, inputText).then((respuesta: any) => {

            var clientes = respuesta.map((v: any) => {
                var obj = { value: v.Folio, label: v.Folio };
                return obj
            });

            this.setState(s => ({ ...s, optClientes: clientes }))

            callback(clientes)

        })
            .catch(() => {

                this.setState(s => ({ ...s, optClientes: [] }))

                callback([])

            })
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
            placeholder = "Seleccione o Capture el Folio Digital"

        // Opciones
        // let opciones = this.state.Datos.filter(o => o.Estatus === 'A').map(e => ({ value: e.Folio, label: e.Folio }))

        return (
            <ActionAsyncCreatableSelect
                loadOptions={this.loadOptionsClientes}
                disabled={this.props.disabled}
                label="Folio Digital"
                name={this.props.name}
                placeholder={placeholder}
                options={this.state.optClientes}
                addDefault={false}
                valor={this.props.valor}
                accion={this.props.accion}
                noOptionsMessage={placeholder}
            // ref={refCliente}
            />
        )
    }

}

export default FoliosDigitales