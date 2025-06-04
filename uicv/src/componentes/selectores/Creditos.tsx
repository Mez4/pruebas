import axios from 'axios'
import React from 'react'
import { GetServerUrl } from '../../global/variables'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { ActionAsyncCreatableSelect } from '../global'

let source: any
const datosDefecto: any[] = []
const optCreditos: any[] = []

type CreditosTipo = {
    name: string,
    disabled: boolean,
    oidc: IOidc,
    cargar: boolean
    valor: number,
    accion?(val: any): any,
    Datos: {
        CreditoID: number,
        ProductoID: number,
        ClienteID: number,
        SucursalID: number,
        CajaID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        CoordinadorID: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date
    }
    // DistribuidorID?: number,
    // ClienteID?: number,
}
type EstadoTipo = {
    Datos: any[]
    , Cargando: boolean
    , Error: boolean
    , optCreditos
}
class Creditos extends React.Component<CreditosTipo, EstadoTipo> {
    constructor(props: CreditosTipo) {
        super(props)
        this.state = {
            Datos: datosDefecto
            , Cargando: false
            , Error: false
            , optCreditos: []
        }
        source = axios.CancelToken.source()
    }

    FNGet = (oidc: IOidc, Credito: string) =>
        new Promise((Resolver: any, Denegar: any) => {
            // console.log('Datos: ', this.props.Datos)
            // console.log('Credito: ', Credito)

            axios.post(`${GetServerUrl()}creditos/credito_vw/getbyfiltros`, { ...this.props.Datos, Credito, top: true }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            })
                .then(respuesta => {
                    console.log('res: ', respuesta.data)
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

                var creditos = respuesta.map((v: any) => {
                    var obj = { value: v.CreditoID, label: v.CreditoID };
                    return obj
                });

                this.setState(s => ({ ...s, optCreditos: creditos }))

            })
                .catch(() => {

                    this.setState(s => ({ ...s, optCreditos: [] }))

                })

    }

    // Will the component unmount
    componentWillUnmount() {
        if (source)
            source.cancel("Componente fue desmontado")
    }

    loadOptionsCreditos = (inputText: string, callback: any) => {
        // console.log('inputText: ', inputText)
        this.FNGet(this.props.oidc, inputText).then((respuesta: any) => {

            var creditos = respuesta.map((v: any) => {
                var obj = { value: v.CreditoID, label: v.CreditoID };
                return obj
            });

            this.setState(s => ({ ...s, optCreditos: creditos }))

            callback(creditos)

        })
            .catch(() => {

                this.setState(s => ({ ...s, optCreditos: [] }))

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
            placeholder = "Seleccione o Capture el Número de Crédito"

        // Opciones
        // let opciones = this.state.Datos.filter(o => o.Estatus === 'A').map(e => ({ value: e.Folio, label: e.Folio }))

        return (
            <ActionAsyncCreatableSelect
                loadOptions={this.loadOptionsCreditos}
                disabled={this.props.disabled}
                label="Crédito"
                name={this.props.name}
                placeholder={placeholder}
                options={this.state.optCreditos}
                addDefault={false}
                valor={this.props.valor}
                accion={this.props.accion}
                noOptionsMessage={placeholder}
                dscText="Buscar Crédito"
            // ref={refCliente}
            />
        )
    }

}

export default Creditos