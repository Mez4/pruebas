import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { ActionSelect, Card, CustomFieldText, Spinner } from '../../../../../global'
import { FaPlus, FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaBan } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import ReactTooltip from 'react-tooltip';
import VerDocumento from './VerDocumento'
import CFormVerDocumentosAval from './CFormVerDocumentosAval'


type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCancelar(): any,
    ProspectoID: number,
    NombreProspecto: string,
    RevisionDocumentos: number,
    FNGetLocal: any
    cbActualizar(item: any): any,

}
export const CFormDocumentos = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const DatosDefecto = {
        TipoDocumentoID: 0,
        NombreDocumento: '',
        Clave: '',
        Descripcion: '',
        DocumentoID: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0
    }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            VerDocumento: false,
            Aval: false,
        },
        Estado: 0,
        RevisionDocumentos: 0,
        BotonCargando: false,
        Nota: '',
        optNotas: [],
        MostrarCancelar: false,
    })

    const [mensajeID, setMensajeID] = React.useState(0)

    let validationShapeM = {
        Mensaje: Yup.string().required("Campo Obligatorio")
    }

    const fnAgregarNotaC = () => setState(s=> ({...s, Form: {...s.Form}, MostrarCancelar: true}))
    const fnCancelarC = () => setState(s=> ({...s, Form: {...s.Form}, MostrarCancelar: false}))
    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const GetMensajesFijos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMensajesFijos(props.oidc, {StatusProcesoID: 0, TipoDocumentoID: 0 })
            .then((respuesta: any) => {
                var mensajes = respuesta.map((valor: any) => {
                    var obj = { value: valor.Mensaje, label: valor.Mensaje };
                    return obj
                });

                setState(s => ({ ...s, optNotas: mensajes }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNotas: [] }))
            })
    }

    const fnCancelarProspecto = (Nota: string) => {
        //setState(s => ({ ...s, Cargando: true }))
        Funciones.FNCancelarProspecto(props.oidc, { ProspectoID: props.ProspectoID, Nota, TipoMesa: 1, DesdeProceso: 1 })
            .then((resultado: any) => {
                setState(s => ({ ...s,Form: {...s.Form}, Cargando: false, MostrarCancelar: false }))
                props.cbActualizar(resultado)
                props.fnCancelar()
                toast.success('PROSPECTO CANCELADO')  
            })
            .catch((error: any) => {
                if (error.response) 
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(s => ({ ...s, Cargando: false, MostrarCancelar: false }))
            })
    }

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocumentos(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'TipoDocumentoID',
                    width: '10%',
                    cell: (props) =>
                    <div>
                        {props.TipoDocumentoID}
                    </div>
                },

                {
                    name: 'NombreDocumento',
                    selector: 'NombreDocumento',
                    width: '58%',
                    cell: (props) =>
                    <>
                        <div>
                            <table style={{width: '100%'}}>
                                <tbody>
                                <tr>
                                    <td style={{display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold'}}>
                                        {props.NombreDocumento}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic'}}>
                                        {props.NombrePersona} ({props.Aval ? 'AVAL' : 'TITULAR' })
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                },

                {
                    name: 'Ver Documento',
                    width: '20%',
                    sortable: false,
                    cell: (props) =>
                        props.DocumentoID > 0 ? <><button data-tip data-for={`btnCV_${props.NombreDocumento}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-secondary" type={"button"} onClick={() => {
                            FnEstado(props.Estado)
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: false, VerDocumento: true,
                                    Datos: {
                                        TipoDocumentoID: props.TipoDocumentoID,
                                        NombreDocumento: props.NombreDocumento,
                                        Clave: props.Clave,
                                        Descripcion: props.Descripcion,
                                        DocumentoID: props.DocumentoID,
                                        //Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn
                                    },
                                    Id: props.ProspectoID,
                                    Aval: props.Aval
                                }
                            }))
                        }}>
                            VER
                        </button>
                            <ReactTooltip id={`btnCV_${props.NombreDocumento}`} type="info" effect="solid">
                                VER DOCUMENTO {props.NombreDocumento}
                            </ReactTooltip></> : <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                Pendiente
                            </span>
                        </div>
                },

                {
                    name: 'Estatus',
                    selector: 'Estado',
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {props.Estado == 1 && <FaCheckCircle color='green' size={20} />}
                            {props.Estado == 2 && <FaTimesCircle color='red' size={20} />}
                            {props.Estado == 3 && <FaClock color='gray' size={20} />}
                        </div>
                },
            ]
        return colRet
    }, [])

    // Use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        if (state.Cargando && props.Item) {
            FNGetLocal()
            GetMensajesFijos()
        }

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro, props])

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDocumento: false } })

    const FnEstado = (Estado: number) => {
        setState(s => ({ ...s, Estado: Estado }))
        //console.log(state.Nota)
    }


    const FNupdateValidarDoc = (ProspectoID: number) => {
        setState(s => ({ ...s, BotonCargando: true  }))
        Funciones.FNupdateValidarDocumentos(props.oidc, ProspectoID)
            .then((respuesta: any) => {
                //console.log(respuesta)
                //fnPrueba(RevisionDocumentos)
                props.cbActualizar(respuesta)
                props.fnCancelar()
                //props.FNGetLocal()
                toast.success(respuesta.msj)

            })
            .catch((error: any) => {
                setState(s => ({ ...s, BotonCargando: false  }))
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE ')
            })
    }

    return (
        <>
        <ModalWin open={props.mostrar} center large >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    EXPEDIENTE<br /> PROSPECTO: &nbsp; {props.ProspectoID} &nbsp; {props.NombreProspecto}
                </h5>
                <button type="button" className="delete" onClick={props.fnCancelar}></button>
            </ModalWin.Header>
            <ModalWin.Body>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <Card>

                            <Card.Body>
                                <Card.Body.Content>
                                    {state.Cargando && <Spinner />}
                                    {state.Error && <span>Error al cargar los datos...</span>}
                                    {!state.Cargando && !state.Error &&
                                        <div>
                                            <DataTable
                                                subHeader
                                                subHeaderComponent=
                                                {
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="input-group mb-3">
                                                                {([2,3].includes(props.RevisionDocumentos) && !state.BotonCargando ) && <button type="submit" className="btn btn-danger waves-effect waves-light" onClick={() => fnAgregarNotaC()} >CANCELAR PROSPECTO</button>}
                                                                {([2,3].includes(props.RevisionDocumentos) && !state.BotonCargando ) && <button type="submit" className="btn btn-success waves-effect waves-light" onClick={() => FNupdateValidarDoc(props.ProspectoID)} >VALIDAR EXPEDIENTE</button>}
                                                                <input type="text" className="form-control" placeholder="Buscar Documento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                                <span className="input-group-text"><FaSearch /> </span>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                                {state.BotonCargando && <Spinner/>}
                                                                {/*props.RevisionDocumentos == 3 && <button type="submit" className="mr-0 btn btn-success waves-effect waves-light" onClick={() => FNupdateValidarDoc(props.ProspectoID)} >Validar Documentos</button>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                data={state.DatosMostrar}
                                                striped
                                                dense
                                                noHeader
                                                responsive
                                                keyField={""}
                                                defaultSortField={""}
                                                columns={Columns}
                                            />
                                            <div className="col-ms-12 d-flex justify-content-center">
                                                {props.RevisionDocumentos == 1 && <FaCheckCircle color='green' size={40} />}
                                            </div>

                                            {
                                                state.Form.VerDocumento && <ModalWin open={state.Form.VerDocumento} center xlarge>
                                                    <ModalWin.Header>
                                                        <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                                        <button type="button" className="delete" onClick={() => {
                                                            fnCancelar()
                                                        }} />
                                                    </ModalWin.Header>
                                                    <ModalWin.Body>
                                                        {!state.Form.Aval && <VerDocumento DocumentoID={state.Form.Datos.DocumentoID} fnCancelar={fnCancelar} Estado={state.Estado} FNGetLocal={FNGetLocal} Id={props.ProspectoID} NombreDocumento={state.Form.Datos.NombreDocumento}/>}
                                                        { state.Form.Aval && <CFormVerDocumentosAval DocumentoAvalID={state.Form.Datos.DocumentoID} fnCancelar={fnCancelar} Estado={state.Estado} FNGetLocal={FNGetLocal} Id={props.ProspectoID} AvalID={state.Form.Datos.PersonaID} NombreDocumento={state.Form.Datos.NombreDocumento}/>}
                                                    </ModalWin.Body>
                                                </ModalWin>
                                            }

                                        </div>
                                    }
                                </Card.Body.Content>
                            </Card.Body>
                        </Card>
                    </div>
                }

            </ModalWin.Body>
        </ModalWin>
        <ModalWin open={state.MostrarCancelar} center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>CANCELAR PROSPECTO</h5>
                <button type="button" className="delete" onClick={() => { fnCancelarC() }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <div>
                    <div className="row">
                        <div className="col-sm-12">
                            <Formik initialValues={{Mensaje: ''}}
                                enableReinitialize
                                validationSchema={Yup.object().shape(validationShapeM)}
                                onSubmit={(values: any) => {
    
                                    setState(e => ({ ...e, Cargando: true}))
                                    if(values.Mensaje === ''){ 
                                        toast.error(`ES NECESARIO SELECCIONAR UN MOTIVO`)
                                    }else{
                                        fnCancelarProspecto(`${values.Mensaje} ${state.Nota ? ' - '+state.Nota : ''}`)
                                    }
                                
                                }} >
                            <Form>
                            <ActionSelect
                                disabled={loading}
                                label="Nota"
                                name="Mensaje"
                                placeholder="Selecciona el motivo de la nota"
                                options={state.optNotas}
                                addDefault={true}
                                valor={mensajeID}
                                // accion={setMensajeID}
                            />
                            {/* <CustomFieldText disabled={loading} label="Mensaje (Opcional)" name="Anotacion" placeholder=""/>  */}
                            <label>Anotación</label>
                            <textarea  className="form-control" name='Anotacion' id='Anotacion' rows={5} placeholder="Escribe aquí un Mensaje para complementar la Nota a enviar (Opcional)" onChange={e => FnNota(e.target.value)} />
                            <div className="text-center">
                                <br />
                                {state.Cargando && <Spinner/>}
                                {!state.Cargando&& <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-danger waves-effect waves-light"><FaBan/> CANCELAR PROSPECTO</button>}
                            </div>
                            </Form>
                            </Formik>
                        </div>
                    </div>
                </div>

            </ModalWin.Body>
        </ModalWin>
        </>
    )
}
