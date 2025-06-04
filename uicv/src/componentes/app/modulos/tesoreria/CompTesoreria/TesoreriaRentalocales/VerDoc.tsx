import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'

type CatalogosType = {
    oidc: IOidc,
    ContratoID: number,
    fnCancelar(): any,
}

const VerDocRentaLocal = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DocumentoID: number = props.ContratoID
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByDocumentoID(props.oidc, props.ContratoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("###", respuesta);
                    console.log("###", respuesta.src);
                    setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src} }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
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
                                <div style={{ width: '100%', height: '150px', backgroundColor: 'white', textAlign: 'center' }}>
                                    <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={150} />
                                    
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
export default connect(mapStateToProps, mapDispatchToProps)(VerDocRentaLocal);