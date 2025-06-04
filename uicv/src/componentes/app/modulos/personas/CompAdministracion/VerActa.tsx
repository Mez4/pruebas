import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { Card, ImgViewer, Spinner } from '../../../../global'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { FnGetEvidencia } from '../../mesaDeAclaraciones/CompMesaDeAclaraciones/CatalogoAclaracion/Funciones';

type CatalogosType = {
    oidc: IOidc,
    DistribuidorID: number,
    Ruta: string,
    fnCancelar(): any,
}


const VerActa= (props: CatalogosType ) => {
    let isMounted = React.useRef(true)
    const DocumentoID: number = props.DistribuidorID
    const Ruta: string = props.Ruta
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: '',
            res: 0
        },
        srcBC: '',
        resultDesc: '',
    });
    var data = {
       
        DistribuidorID : DocumentoID,
        Ruta : Ruta
    }
 
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNObtenerEvidencia(props.oidc, props.Ruta)
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

    React.useEffect(() =>{
        FNGetLocal();
        return () => {
            isMounted.current = false
        }
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
    );
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(VerActa);
