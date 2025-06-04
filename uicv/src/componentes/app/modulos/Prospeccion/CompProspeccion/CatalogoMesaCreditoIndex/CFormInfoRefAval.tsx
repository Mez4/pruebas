import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { Card, CustomFieldText, Spinner, Acordion, Tabs, ImgViewer } from '../../../../../global'
import { FcDocument, FcHome, FcBusiness } from 'react-icons/fc'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaPlus, FaSearch, FaHouseUser, FaTimesCircle, FaCheckCircle, FaUser, } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import { AdvertenciaValidaRefAval } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/AdvertenciaValidaRefAval'
import * as FuncionesDoc from '../DocsProspecto/Funciones'
import { toast } from 'react-toastify'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnVerInfReferecia(item: any, nombre: any, referencias: any): any,
    ReferenciaID: number,
    NombreReferencia: string,
    flag: boolean,
    VerificaAval: number,
    Filtro: number,
    fnCerrarInfoAval(): any,
    fnCerrarAdvertenciaAvales(): any,
    FNGetLocal(): any,
    initialValues: { Nota: string },
    Datos: any[],
    refe?: DBConfia_Prospeccion.IReferencias


}

export const CFormInfoRefAval = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const DatosDefecto = { Nota: '' }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    let Docs: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: 0,
        Cargando: true,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            info: [],
            Nota: ''

        },
        ReferenciaID: 0,
        AdvertenciaValidaRefAval: false,
        CFormInfoRefAval: false,
        doc: '',
        docLabel: '',
        solicitud: '',
        Docs

    })

    const ConsultaDocs = async () =>{
        Docs = await FuncionesDoc.FNGetDocsByProspectoID(props.oidc, props.Id) as any[]
        console.log(Docs)
        setState(s => ({ ...s, Docs: Docs}))
        Docs.forEach(e => {
            if(['D003'].includes(e.Clave)){
                console.log(e.Clave)
                FuncionesDoc.FNGetDocsByDocumentoID(props.oidc, e.DocumentoID)
                    .then((respuesta: any) => {
                        if (isMounted.current === true) {
                            if(e.Clave === 'D003') setState(s => ({ ...s, solicitud: respuesta.src, doc: respuesta.src, docLabel: 'SOLICITUD DE CRÉDITO'}))
                        }
                    })
                    .catch((error) => {
                        if (isMounted.current === true) {
                            toast.error(`${e.Clave}- ${e.NombreDocumento} Error: ${error}`)
                            if(e.Clave === 'D003') setState(s => ({ ...s, solicitud: `Error: ${error}`}))
                        }
                    })
            }
        });
    }

    const fnCancelaAdvertencia = () => setState(s => ({ ...s, AdvertenciaValidaRefAval: false }))
    const fnRechazaAval = (ReferenciaID: any) => setState(s => ({ ...s, CFormInfoRefAval: false, AdvertenciaValidaRefAval: true, ReferenciaID, Filtro: 2 }))

    const fnValidaAval = (ReferenciaID: any) => setState(s => ({ ...s, CFormInfoRefAval: false, AdvertenciaValidaRefAval: true, ReferenciaID, Filtro: 1 }))

    // Use effect
    React.useEffect(() => {
        if (state.Cargando) {
            // FNGetLocal()
            ConsultaDocs()
        }

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro, state.Cargando, props])

    return (

        <ModalWin open={props.mostrar} xlarge center >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    INFORMACIÓN DE LA REFERENCIA <br />
                    {props.ReferenciaID}&nbsp;{props.NombreReferencia + ' ' + props.refe?.primerApellido + ' ' + props.refe?.segundoApellido}
                </h5>
                <button type="button" className="delete" onClick={props.fnCerrarInfoAval}></button>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ Nota: '' }}
                    onSubmit={(values, actions) => {
                    }}>
                    <Form >
                        {loading && <Spinner />}
                        {!loading &&
                            <>
                            <div className="d-flex flex-row-reverse" style={{marginBottom: '1em'}}>
                                {props.refe?.Validado !== true && <div className="p-0">  <button onClick={() => fnValidaAval(props.refe?.ReferenciaID)} type="submit"
                                    className="ms-2 btn btn-success waves-effect waves-light">VALIDAR REFERENCIA AVAL</button></div>}
                                {props.refe?.Validado !== true && <div className="p-0">   <button onClick={() => fnRechazaAval(props.ReferenciaID)} type="submit"
                                    className="ms-2 btn btn-warning waves-effect waves-light ">AGREGAR NOTA</button></div>}
                            </div>
                            <div className="row">                                
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <Acordion TabSelecionado="socio">
                                        <Acordion.Tab Identificador="socio" Titulo={<React.Fragment><FaHouseUser />&nbsp;DATOS GENERALES</React.Fragment>}>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-12 col-lg-12">
                                                    <div className="text-end">
                                                        <div className="text-center">

                                                            <div className="text-start">

                                                                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Numero Referencia:</td>
                                                                            <td>{props.refe?.numeroReferencia}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre Completo:</td>
                                                                            <td>{props.refe?.nombre + ' ' + props.refe?.primerApellido + ' ' + props.refe?.segundoApellido}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Edad:</td>
                                                                            <td>{props.refe?.edad}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Parentesco: </td>
                                                                            <td>{props.refe?.parentesco}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                                            <td>{props.refe?.celular}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Domicilio:</td>
                                                                            <td>{props.refe?.domicilio}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                            </div>


                                                        </div>

                                                    </div>


                                                </div>

                                                {state.AdvertenciaValidaRefAval && <AdvertenciaValidaRefAval
                                                    oidc={props.oidc}
                                                    mostrar={state.AdvertenciaValidaRefAval}
                                                    ReferenciaID={state.ReferenciaID}
                                                    Filtro={state.Filtro}
                                                    fnCancelaAdvertencia={fnCancelaAdvertencia}
                                                    fnCerrarInfoAval={props.fnCerrarInfoAval}
                                                    FNGetLocal={props.FNGetLocal}
                                                    initialValues={state.Form.Datos}
                                                />}
                                            </div>


                                        </Acordion.Tab>

                                    </Acordion>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <Acordion TabSelecionado="Documentos">    
                                        <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTOS</React.Fragment>}>
                                            <>
                                                <div>
                                                    <div className="row">
                                                        <div className="col-12 text-center" style={{marginBottom: '1em'}}>
                                                            <div className="lightbox" style={{ width: '100%', height: '450px', backgroundColor: 'white' }}>
                                                                <figure className="figure">
                                                                    <figcaption className="figure-caption">{state.docLabel}</figcaption>
                                                                    <ImgViewer imgSrc={state.doc} noToolbar={false} zIndex={1000} maxWidth={500} maxHeight={450} />
                                                                </figure>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        </Acordion.Tab>
                                    </Acordion>
                                </div>
                            </div>
                            </>
                        }
                        <div className="row text-center">
                            {props.refe?.Validado !== true && <div style={{ width: '100%', textAlign: 'center' }}>
                                {props.refe?.Observacion != null && <FaTimesCircle color='red' size={30} />}
                                {props.refe?.Observacion != null && <p style={{ fontSize: '15px' }}>NOTA: {props.refe?.Observacion}</p>}
                            </div>}
                            {props.refe?.Validado == true && props.refe?.Observacion == null && <FaCheckCircle color='green' size={30} />}
                        </div>
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>

    )
}
