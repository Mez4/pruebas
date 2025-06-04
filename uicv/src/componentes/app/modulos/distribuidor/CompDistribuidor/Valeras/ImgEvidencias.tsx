import React, { useState } from 'react';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc';
import { Card, ModalWin, Spinner } from '../../../../../global';
import VerDoc from './VerDoc';
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin';
import EvidenciasImages from './EvidenciasImages';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { FiltrarDatos } from '../../../../../../global/functions';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as Funciones from './Funciones'
import { IEstado } from '../../../../../../interfaces/redux/IEstado';
import { connect } from 'react-redux';

type CatalogosType = {
    oidc: IOidc,
    ValeraID: number
}

const defaultImgSrc = "/noimage.png"

const imgValues = {
    imageName: '',
    imageSrc: defaultImgSrc,
    file: null,
    imageFile: null
}

const ImgEvidencias = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)
    const [values, setValues] = useState(imgValues)
    const DatosDefecto = { TipoDocumentoID: 0, 
        NombreDocumento: '', 
        Clave: '', 
        Descripcion: '',
        DocumentoID: 0,
        Orden: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0}
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const ProspectoIDP: number = props.ValeraID
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined || 0,
            VerDoc: false,
        }
    })

    const FNGetLocal = () => {
        
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetImgsByValeraID(props.oidc, {ValeraID: props.ValeraID})
            .then((respuesta: any) => {
                respuesta.sort((a,b) => a.IdCatalogoImagen - b.IdCatalogoImagen)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const showPreview = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues(s => ({
                    ...s,
                    imageName: e.target.files[0].name,
                    imageFile,
                    file: e.target.files[0],
                    imageSrc: x.target?.result! as string
                }))
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues(s => ({
                ...s,
                imageName: '',
                imageFile: null,
                imageSrc: defaultImgSrc
            }))
        }
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Documento',
                    width: '210px',
                    style: { textAlign: 'left' },
                    selector: 'ValeraID',
                    cell: (props, index) => 
                    <>
                        <p style={{width: '100%', textAlign: 'left', fontSize: '12px', paddingLeft: '0px'}}>
                        { props.ValeraID ? <i className={"fas fa-check-circle"} style={{color: 'green', paddingRight: '3px'}}></i>:<i className={"fas fa fa-times-circle"} style={{color: 'red', paddingRight: '3px'}}></i> } 
                            {props.NombreImagen}
                        </p>
                    </>
                },
                {
                    name: 'Ver',
                    width: '60px',
                    sortable: false,
                    cell: (props) =>
                    
                    <button style={{padding: '0px', textAlign: 'center', width: '100%', textDecoration:'none', border:'none', backgroundColor: 'transparent'}} onClick={() => { setState(s => ({ ...s, Form: { ...s.Form, VerDoc: true, Datos: props } })) }}>
                        <FaEye style={{cursor: 'pointer', fontSize: '15px' }} />
                    </button>
                },
                {
                    name: 'subir',
                    width: '60px',
                    sortable: false,
                    cell: (props) => 
                    <div style={{paddingRight: '0px', textAlign: 'center', width: '100%', paddingTop: '3px'}}>  
                        <label htmlFor={props.IdCatalogoImagen} style={{cursor: 'pointer'}}><i className={"fas fa-upload"}></i></label>
                        <input
                            id={props.IdCatalogoImagen }
                            name={props.IdCatalogoImagen}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(event) => {
                                if (event.target.files) {
                                    state.Form.Mostrar = true
                                    state.Form.Id = props.IdCatalogoImagen
                                    showPreview(event)                       
                                }
                               
                            }}
                        />
                    </div>
                    
                        // <input style={{ padding:'0px 10px', cursor: 'pointer', width:"350px", backgroundColor: 'transparent'}}  type='file' />
                        // <i className="fas fa-upload"></i>
                    
                }
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
    }, [])


    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
   

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TipoDocumentoID === item.TipoDocumentoID ? item : Dato), Form: { ...state.Form, Mostrar: false, VerDoc: false, Datos: { TipoDocumentoID: 0, 
            NombreDocumento: '', 
            Clave: '', 
            Descripcion: '',
            DocumentoID: 0,
            Orden: 0,
            PersonaID: 0,
            TipoPersonaID: 0,
            Ruta: '',
            Autorizado: false,
            rn: 0 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    <label className="form-label mb-0">Documentos Evidencia Entrega</label>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        noDataComponent={<div style={{ margin: '4em' }}>NO HAY DOCUMENTOS DE EVIDENCIA SUBIDOS</div>}
                                        data={state.DatosMostrar}
                                        striped
                                        //pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"TipoDocumentoID"}
                                        defaultSortField={"Orden"}
                                        columns={Columns}
                                    />

                                    {
                                        state.Form.Mostrar && <ModalWin open={state.Form.Mostrar} center large>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                                <button type="button" className="delete" onClick={() => {
                                                    fnCancelar()
                                                }} />
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                <EvidenciasImages
                                                    disabled={false}
                                                    label="Evidencia de Entrega Doc"
                                                    name="file"
                                                    imageSrc={values.imageSrc} oidc={props.oidc} valeraID={props.ValeraID} doc={values.file} IdCatalogoImagen={state.Form.Id} 
                                                    close={ fnCancelar } 
                                                    mostrar = {FNGetLocal}                                             
                                                />
                                                {/* <CForm_UEvidencia Id={state.Form.Id} oidc={props.oidc} close={()=>{}} /> */}
                                            </ModalWin.Body>
                                        </ModalWin>
                                    }

                                    {state.Form.VerDoc &&<ModalWin open={state.Form.VerDoc} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <VerDoc DocumentoID={state.Form.Datos.DocumentoID} src={state.Form.Datos.Ruta} fnCancelar={fnCancelar}/>
                                        </ModalWin.Body>
                                    </ModalWin>}
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
};

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ImgEvidencias);