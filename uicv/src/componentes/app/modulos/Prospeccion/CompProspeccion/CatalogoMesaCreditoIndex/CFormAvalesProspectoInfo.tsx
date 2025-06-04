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
import { FaPlus, FaSearch, FaHouseUser, FaUser, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import { AdvertenciaAval } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/AdvertenciaAval'
import * as FuncionesDoc from '../DocsProspecto/Funciones'
import { toast } from 'react-toastify'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnVerInfAval(item: any, nombre: any, avales: any): any,
    IdAval: number,
    NombreAval: string,
    flag: boolean,
    VerificaAval: number,
    Filtro: number,
    fnCerrarInfoAval(): any,
    fnCerrarAdvertenciaAvales(): any,
    FNGetLocal(): any,
    initialValues: { Nota: string },
    Datos: any[],
    aval?: DBConfia_Prospeccion.IAvales_VW


}

export const CFormAvalesProspectoInfo = (props: FormaNotasTipo) => {

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
        AvalID: 0,
        AdvertenciaAval: false,
        CFormAvalesProspectoInfo: false,
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

    const fnCancelaAdvertencia = () => setState(s => ({ ...s, AdvertenciaAval: false }))
    const fnRechazaAval = (AvalID: any) => setState(s => ({ ...s, CFormAvalesProspectoInfo: false, AdvertenciaAval: true, AvalID, Filtro: 2 }))

    const fnValidaAval = (AvalID: any) => setState(s => ({ ...s, CFormAvalesProspectoInfo: false, AdvertenciaAval: true, AvalID, Filtro: 1 }))

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
                    INFORMACIÓN DEL AVAL<br />
                    AVAL :&nbsp;{props.IdAval}&nbsp;{props.NombreAval}
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
                                {props.aval?.Validado !== true && <div className="p-0">  <button onClick={() => fnValidaAval(props.IdAval)} type="submit"
                                    className="ms-2 btn btn-success waves-effect waves-light">VALIDAR AVAL</button></div>}
                                {props.aval?.Validado !== true && <div className="p-0">   <button onClick={() => fnRechazaAval(props.IdAval)} type="submit"
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
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha Nacimiento:</td>
                                                                            <td>{moment(props.aval?.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                                                            <td>{props.aval?.Sexo}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                                            <td>{props.aval?.CURP}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO. CIVIL: </td>
                                                                            <td>{props.aval?.EstadoCivil}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                                            <td>{props.aval?.TelefonoMovil}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                                                            <td>{props.aval?.CorreoElectronico}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar Nacimiento:</td>
                                                                            <td>{props.aval?.LugarNacimiento}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                            <td>{props.aval?.DireccionAval}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Telefono Fijo:</td>
                                                                            <td>{props.aval?.TelefonoDomicilio}</td>
                                                                        </tr>

                                                                    </tbody>
                                                                </table>
                                                                <hr />

                                                                <div className="text-start">
                                                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                        <thead><strong>DATOS LABORALES</strong></thead>
                                                                        {!props.aval?.TieneEmpleo && <tbody>
                                                                            <tr>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene Empleo</td>
                                                                                <td></td>
                                                                            </tr>
                                                                        </tbody>}
                                                                        {Boolean(props.aval?.TieneEmpleo) && <tbody>
                                                                            <tr>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                                                <td>{props.aval?.Empresa}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                                                <td>{props.aval?.Ocupacion}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                                <td>{FormateoDinero.format(props.aval?.Sueldo ?? 0)}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                                                <td>{props.aval?.Antiguedad}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                                <td>{props.aval?.DireccionEmpresaAval}</td>
                                                                            </tr>
                                                                        </tbody>}
                                                                    </table>
                                                                </div>


                                                                <hr />



                                                            </div>


                                                        </div>

                                                    </div>
                                                    <div className="text-start">
                                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                            <thead><strong>DATOS CONYUGE</strong></thead>
                                                            {!props.aval?.TieneConyuge && <tbody>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene conyuge</td>
                                                                    <td></td>
                                                                </tr>
                                                            </tbody>}
                                                            {Boolean(props.aval?.TieneConyuge) && <tbody>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre:</td>
                                                                    <td>{props.aval?.NombreConyuge}</td>
                                                                </tr>
                                                            </tbody>}
                                                        </table>

                                                    </div>
                                                    {Boolean(props.aval?.TieneConyuge && props.aval?.TieneEmpleoConyuge) && <div className="text-start">
                                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                            <thead><strong>DATOS LABORALES CONYUGE</strong></thead>
                                                            {<tbody>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                                    <td>{props.aval?.EmpresaConyuge}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                                    <td>{props.aval?.OcupacionConyuge}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                    <td>{FormateoDinero.format(props.aval?.SueldoConyuge ?? 0)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                                    <td>{props.aval?.AntiguedadConyuge}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                    <td>{props.aval?.DireccionEmpresaConyugeAval}</td>
                                                                </tr>
                                                            </tbody>}
                                                        </table>


                                                    </div>}

                                                </div>

                                                {state.AdvertenciaAval && <AdvertenciaAval
                                                    oidc={props.oidc}
                                                    mostrar={state.AdvertenciaAval}
                                                    AvalID={state.AvalID}
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
                            {props.aval?.Validado !== true && <div style={{ width: '100%', textAlign: 'center' }}>
                                {props.aval?.Observacion != null && <FaTimesCircle color='red' size={30} />}
                                {props.aval?.Observacion != null && <p style={{ fontSize: '15px' }}>NOTA: {props.aval?.Observacion}</p>}
                            </div>}
                            {props.aval?.Validado == true && props.aval?.Observacion == null && <FaCheckCircle color='green' size={30} />}
                        </div>
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>

    )
}
