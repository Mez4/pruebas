import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Funciones from './FuncionesSCRS';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc';
import Swal from "sweetalert2"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ModalWin, Spinner } from '../../../../../global';
import React from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { FaCheckCircle, FaClock } from 'react-icons/fa';
import CFormSCRSCArchivo from './CFormSCRSArchivo';
import { log } from 'console';
import ReactTooltip from 'react-tooltip';
import CFormDocSCRS from './CFormDocSCRS';
import CFormSCRSCArchivoEdit from './CFormSCRSArchivoEdit';

export const MODAL_TITLE_CLASS = "modal-title mt-0"

type CFormType = {
    iodc: IOidc
    DistribuidorID: number,
    SolicitudRCID: number,
    Estatus?: string,
    Accion: number
    IdSolicitud: number,
    fnAbrir_Cerrar(): any
    disabled?: boolean
}

export const CFormSCRSDocEdit = (props: CFormType) => {
    console.log(props);
    const DatosDefecto = {
        DocumentoID: 0,
        TipoDocumentoID: 0,
        NombreDocumento: "",
        Accion: props.Accion,
        Ruta: "",
        Status: "",
        Autorizado: false,
    }
    const Datos: any[] = []
    const DatosDistribuidor: any[] = [];
    const [state, setState] = useState({
        showDocumento: true,
        MostrarSubirDocumentos: false,
        DatosDistribuidor,
        Datos,
        Form: {
            Mostrar: false,
            VerDoc: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        Cargando: true,
        Error: false
    });

    // const MostrarDocumentos = () => {
    //     Funciones.GetDocumentos(props.iodc, props.DistribuidorID).then((res: any) => {
    //         console.log(res);
    //         setState({
    //             ...state,
    //             DatosDistribuidor: res,
    //             Cargando: false
    //         });
    //     }).catch((error: any) => {
    //         setState({
    //             ...state,
    //             DatosDistribuidor: [],
    //             Cargando: false
    //         });
    //         toast.error("Error al obtener los documentos");
    //     });
    // }

    const ObtenerCatalogoDocumentos = () => {
        Funciones.GetDocs(props.iodc)
            .then((resDoc: any) => {
                // console.log(res);

                Funciones.GetDocumentos(props.iodc, props.IdSolicitud).then((res: any) => {
                    // console.log(res);
                    //UNIR LOS DOS ARREGLOS
                    resDoc.forEach((item: any) => {
                        const itemEncontrado = res.find((item2: any) => item2.TipoDocumentoID === item.TipoDocumentoID);
                        if (itemEncontrado) {
                            item.DocumentoID = itemEncontrado.DocumentoID;
                            item.DocumentoID = itemEncontrado.DocumentoID;
                            item.Ruta = itemEncontrado.Ruta;
                            item.Autorizado = itemEncontrado.Autorizado;
                            item.ProductoID = itemEncontrado.ProductoID;
                            item.Opcional = itemEncontrado.Opcional;
                            item.NombreDocumento = itemEncontrado.NombreDocumento;
                        }
                    });
                    console.log(resDoc);
                    setState({
                        ...state,
                        Datos: resDoc,
                        Cargando: false
                    });
                }).catch((error: any) => {
                    setState({
                        ...state,
                        Datos: [],
                        Cargando: false
                    });
                    toast.error("Error al obtener los documentos");
                });
                // setState(s => ({ ...s, Datos: resDoc, Cargando: false }));
            }).catch((error: any) => {
                setState(s => ({ ...s, Datos: [], Cargando: false }));
                toast.error("Error al obtener los documentos");
            });
    }

    useEffect(() => {
        // MostrarDocumentos();
        ObtenerCatalogoDocumentos();
    }, []);

    const fn_abrir_cerrar = () => {
        // setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false } })
        // setState(s => ({ ...s, MostrarSubirDocumentos: false }))
    }
    // ACTUALIZAR EL DOCUMENTO CON DATOS INSERTADOS
    const cbActualizar = (item: any) => {
        console.log(item);
        setState({
            ...state, Datos: state.Datos.map((data: any) => data.TipoDocumentoID === item.TipoDocumentoID ? item : data),
            Form: { ...state.Form, Mostrar: false }
        })

    }
    const cbAgregar = (item: any) => {
        console.log(item);

    }

    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Nombre Documento',
                    selector: 'NombreDocumento',
                    sortable: true,
                    center: true,
                    width: '40%',
                    cell: (row: any) => <span className="text-center fs-6">{`${row.NombreDocumento} ${row.Opcional ? '(Opcional)' : ''}`}</span>
                },
                {
                    name: "Subir Documento",
                    selector: 'TipoDocumentoID',
                    sortable: false,
                    center: true,
                    width: '25%',
                    cell: (row) =>
                        <>

                            <button disabled={props.disabled} className="button is-link py-2 fs-6 text-center " style={{ width: '100%', textAlign: 'center' }} onClick={() => {
                                setState(s => ({
                                    ...s, MostrarSubirDocumentos: true,
                                    Form:
                                    {
                                        ...state.Form,
                                        Mostrar: true,
                                        Datos: {
                                            DocumentoID: row.DocumentoID,
                                            TipoDocumentoID: row.TipoDocumentoID,
                                            NombreDocumento: row.NombreDocumento,
                                            DistribuidorID: props.DistribuidorID,
                                            Accion: props.Accion,
                                            SolicitudRCID: props.IdSolicitud ?? 0,
                                            Ruta: row.Ruta ?? "NO RUTA",
                                            Status: "ACTIVO",
                                            Autorizado: row.Autorizado ?? false,

                                        },
                                        Id: row.DocumentoID
                                    }
                                }))
                            }}>Subir
                            </button>
                        </>
                },
                {
                    name: "Ver Documento",
                    selector: 'TipoDocumentoID',
                    sortable: false,
                    center: true,
                    width: '25%',
                    cell: (row) =>
                        row.DocumentoID > 0 ?
                            <>
                                <button disabled={!row.Autorizado}
                                    data-tip
                                    data-for={`btnCV_${row.TipoDocumentoID}`}
                                    className="button is-dark py-2 fs-6 text-center "
                                    style={{ width: '100%', textAlign: 'center' }}
                                    onClick={() => {
                                        if (row.Autorizado == true)
                                            setState(s => ({
                                                ...s,
                                                Form: {
                                                    ...state.Form,
                                                    Mostrar: false,
                                                    VerDoc: true,
                                                    Datos: {
                                                        DocumentoID: row.DocumentoID,
                                                        TipoDocumentoID: row.TipoDocumentoID,
                                                        NombreDocumento: row.NombreDocumento,
                                                        DistribuidorID: props.DistribuidorID,
                                                        Accion: props.Accion,
                                                        SolicitudRCID: props.IdSolicitud ?? 0,
                                                        Ruta: row.Ruta ?? "NO RUTA",
                                                        Status: "ACTIVO",
                                                        Autorizado: row.Autorizado ?? false,
                                                    },
                                                    Id: row.DocumentoID
                                                }
                                            }))
                                    }}>Ver

                                </button>
                                <ReactTooltip id={`btnCV_${row.DocumentoID}`} type="info" effect="solid">
                                    VER DOCUMENTO {row.NombreDocumento}
                                </ReactTooltip>
                            </> :
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <span>
                                    Pendiente
                                </span>
                            </div>


                },
                {
                    name: 'Subido',
                    selector: 'DocumentoID',
                    sortable: false,
                    width: "10%",
                    cell: (row) =>
                        <>
                            {/* {(row.Autorizado === false) &&
                                <div className='text-center'>
                                    <FaCheckCircle color='red' size={25} />
                                </div>
                            } */}
                            {/* {(row.Autorizado || row.Autorizado === null) && */}
                            <div className='text-center'>
                                {row.DocumentoID > 0 ? <FaCheckCircle color='green' size={20} /> : <FaClock color='gray' size={20} />}
                            </div>

                            {/* } */}
                        </>
                }

            ]
        return colRet
    }, [])


    return (
        <>
            <div className={`modal ${state.showDocumento ? 'is-active' : ''}  `}>
                {/* FONDO NEGRO QUE AL DAR CLICK SE SALE DEL MODAL */}
                <div className="modal-background" onClick={props.fnAbrir_Cerrar}></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className='modal-card-title fs-4 fw semibold text-center'>SUBIR DOCUMENTOS</p>
                        {/* AL DAR CLICK EN EL BOTON SE SALDRA DEL MODAL */}
                        <button className="delete" aria-label="close" onClick={() => props.fnAbrir_Cerrar()}></button>
                    </header>
                    <section className='modal-card-body'>
                        <div className="container">
                            {state.Cargando &&
                                <div className='has-text-centered is-size-5'>
                                    <div className='mb-2'>{`Cargando informacion...`}</div>
                                    <Spinner />
                                </div>
                            }
                            {!state.Cargando &&
                                <>
                                    <DataTable
                                        // subHeader
                                        data={state.Datos}
                                        columns={Columns}
                                        noHeader
                                        responsive />
                                </>
                            }
                        </div>

                    </section>
                    <footer className="modal-card-foot d-flex justify-content-end">
                        <button className="button is-danger" onClick={() => props.fnAbrir_Cerrar()}>Cerrar</button>
                    </footer>
                </div>
            </div>

            <>
                {state.Form.VerDoc &&
                    <ModalWin open={state.Form.VerDoc} center large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                            <button type="button" className="delete" onClick={() => {
                                // fnCancelar()
                                setState(s => ({ ...s, Form: { ...state.Form, VerDoc: false } }))
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CFormDocSCRS
                                oidc={props.iodc}
                                DocumentoID={state.Form.Datos.DocumentoID}
                                fn_abrir_cerrar={fn_abrir_cerrar}

                            />
                        </ModalWin.Body>
                    </ModalWin>
                }
                {state.Form.Mostrar &&

                    <ModalWin open={state.Form.Mostrar} center large>
                        <ModalWin.Header>
                            {/* <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5> */}

                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                            <button type="button" className="delete" onClick={() => {
                                // fnCancelar()
                                setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false } }))
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <>
                                <CFormSCRSCArchivoEdit
                                    oidc={props.iodc}
                                    idSolicitud={props.IdSolicitud}
                                    initialValues={state.Form.Datos}
                                    DistribuidorID={props.DistribuidorID}
                                    SolicitudRCID={props.SolicitudRCID}
                                    cbActualizar={cbActualizar}
                                    cbGuardar={cbAgregar}
                                    fnCancelar={() => fn_abrir_cerrar()}

                                />


                            </>
                        </ModalWin.Body>
                    </ModalWin>
                }

            </>


        </>
    )
}

export default CFormSCRSDocEdit;

