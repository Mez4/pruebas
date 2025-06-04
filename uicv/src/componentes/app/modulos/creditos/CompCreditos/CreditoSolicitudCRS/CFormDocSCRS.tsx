import { useEffect, useState } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from './FuncionesSCRS';
/* import { Card } from "@mui/material"; */
import { Card, ImgViewer, Spinner } from "../../../../../global";
import { toast } from "react-toastify";
type GenericType = {
    oidc: IOidc
    DocumentoID: number
    fn_abrir_cerrar(): any
}

const CFormDocSCRS = (props: GenericType) => {


    console.log("ENTREEEE A DOCUMENTOS", props);
    const DocumentoID: number = props.DocumentoID
    const [state, setState] = useState({
        Cargando: true,
        Error: false,
        Src: ''
    });

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.VerDocumento(props.oidc, props.DocumentoID)
            .then((respuesta: any) => {
                console.log(respuesta);

                setState(s => ({ ...s, Cargando: false, Error: false, Src: respuesta.Ruta }))

            })
            .catch((error) => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                toast.error("Error al obtener el documento", { position: "top-right" });

            });
    }
    useEffect(() => {
        FNGetLocal();
    }, []);

    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    {state.Cargando && <Spinner />}
                    {!state.Cargando &&
                        <div style={{ width: '100%', height: '150px', backgroundColor: 'white', textAlign: 'center' }}>
                            <ImgViewer imgSrc={state.Src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={150} />
                        </div>}
                </Card>
            </div>
        </div>
    );
}
export default CFormDocSCRS;