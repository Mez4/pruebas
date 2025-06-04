import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import PDFViewer from '../../../../../global/PDFViewer'

type CatalogosType = {
    oidc: IOidc,
    DocumentoID: number,
    fnCancelar(): any,
}

const VerDoc = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DocumentoID: number = props.DocumentoID
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByDocumentoID(props.oidc, props.DocumentoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("###", respuesta);
                    console.log("###", respuesta.src);
                    setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src } }))
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
        console.log("DOCUMENTO", props.DocumentoID)
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
                                <div style={{ width: '100%', height: '100%', backgroundColor: 'white', textAlign: 'center' }}>
                                    {state.Form.src.includes("pdf") ? <object data={state.Form.src} type='application/pdf' width={'100%'} height={'380px'} /> : <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1000} maxWidth={'100%'} maxHeight={330} />}
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
export default connect(mapStateToProps, mapDispatchToProps)(VerDoc);