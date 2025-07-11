import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'

type CatalogosType = {
    oidc: IOidc,
    DocumentoPath: string,
    fnCancelar(): any,
}

const VerDoc = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DocumentoID: string = props.DocumentoPath
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: '',
            res: 0
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByDocumentoPath(props.oidc, props.DocumentoPath)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("###", respuesta);
                    console.log("###", respuesta.src);
                    setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src, res: respuesta.res } }))
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
                                <>
                                    {state.Form.res == 2 && <div style={{}}>
                                        {/* <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={150} />
                                        <label>*Da click en la imagen poder para ampliar.</label> */}
                                        <object
                                            data={`data:application/pdf;base64,${state.Form.src}`}
                                            width="100%"
                                            height="400px">
                                            <br />
                                            <a href={state.Form.src} id="linkDownload" download="Documento.pdf">
                                                Tu dispositivo no puede visualizar los archivos PDF, da click aquí para descargarlo
                                            </a>
                                        </object>
                                    </div>}
                                    {state.Form.res == 1 && <div style={{ width: '100%', height: '150px', backgroundColor: 'white', textAlign: 'center' }}>
                                        <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={150} />
                                        <label>*Da click en la imagen poder para ampliar.</label>
                                    </div>}
                                </>
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