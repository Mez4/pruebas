import { useEffect, useMemo, useRef, useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
// Custom components
import { Card, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { toast } from 'react-toastify'

type CustomFieldType = {
    oidc: any,
    name: string,
    label: string,
    disabled: boolean,
    imageSrc: string | null,
    valeraID: number,
    // doc: string | null,
    doc : any,
    IdCatalogoImagen: number | null,
    close: () => void,
    mostrar: () => void,
}


const EvidenciasImages = (props: CustomFieldType) => { 
    const initialValues = {
        Imagen: props,
    };

    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    <label className="form-label mb-0 mt-1 ">Evidencia Entrega de Imagenes</label>
                    <Card.Body>
                        <Card.Body.Content>
                            <div style={{textAlign: 'center'}}>
                                <ImgViewer imgSrc={props.imageSrc??''} noToolbar={false} zIndex={1500} maxWidth={250} maxHeight={200} />
                            </div>
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
                <Formik initialValues={initialValues} onSubmit={(values : any) => {
                    const formData = new FormData()
                    console.log('valor',values);
                    console.log('img', props.doc.size);
                    
                    const filesize = props.doc.size / 1024 / 1024; // in MB
                    console.log('filesize',filesize);
                    
                    if (filesize > 2) {
                        toast.error("El tamaño del archivo no debe ser mayor a 2MB");
                        return;
                    }else{
                        formData.append('ValeraID', `${values.Imagen.valeraID}`);
                        formData.append('doc', props.doc??'');
                        formData.append('IdCatalogoImagen', `${props.IdCatalogoImagen}`);

                        Funciones.FNSubirExpedienteEvidenciaImg(props.oidc, formData)
                            .then((respuesta: any) => {
                                toast.success("Subida de Documento realizada correctamente");
                                props.close();
                                props.mostrar();
                            })
                            .catch((error: any) => {
                                console.log(error);
                                
                                if (error.response)
                                    toast.info(`Response Error: ${error}`);
                                else if (error.request)
                                    toast.error(`Request ${error}`);
                                else
                                    toast.error(`${error}`);
                                //setLoading(false)
                    })
                    }
                    
                }}>
                    {({ values }) => (
                        <Form>
                            <div style={{textAlign: 'right'}}>
                                <button className='btn btn-success mx-2' type="submit">Guardar</button>
                                <button className='btn btn-danger' type='button' onClick={props.close}>Cancelar</button>   
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default EvidenciasImages
