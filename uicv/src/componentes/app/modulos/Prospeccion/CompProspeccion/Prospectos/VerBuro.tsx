import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../../global'
import * as FuncionesProspecto from '../Prospectos/Funciones'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc,
    DocumentoID: number,
    fnCancelar(): any,
}

const VerBuro = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DocumentoID: number = props.DocumentoID
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        },
        srcBC: '',
        resultDesc: '',
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        FuncionesProspecto.FNObtenerBC(props.oidc, props.DocumentoID)
            .then((resultado: any) => {
                if (isMounted)
                    setState(e => ({
                        ...e,
                        srcBC: resultado.src,
                        resultDesc: resultado.result.ResultDesc,
                        Cargando: false,
                    }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                if (isMounted)
                    setState(e => ({ ...e, Cargando: false, ErrorPerfil: true }))
            })
    }

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div style={{ width: '100%', height: '500px' }}>
                                    <iframe title={""} src={`data:application/pdf;base64,${state.srcBC}`} style={{ width: '100%', height: '100%' }} />
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(VerBuro);