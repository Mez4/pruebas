import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { Card, CustomFieldText, Spinner, Acordion, Tabs, ImgViewer, ActionSelect } from '../../../../../global'
import { FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaBan } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import ReactTooltip from 'react-tooltip';
import { CFormInfoTitular } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormInfoTitular'
import { AdvertenciaVerificaRefTitular } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/AdvertenciaVerificaRefTitular'
import { toast } from 'react-toastify'



type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCancelarListaRefTirulares(): any,
    cbActualizar(item: any): any,
    ProspectoID: number,
    nombreP: string,
    flag: boolean,
    RevisionRefTitular: number,
    ObservacionRevisionRefTitular: string

    ,
    referencia?: DBConfia_Prospeccion.IReferencias
}

type EstadoTipo = {

    Datos: {
        referencias: DBConfia_Prospeccion.IReferencias[]
        referencia?: DBConfia_Prospeccion.IReferencias
    },
    ReferenciaID: number,
    NombreRef: string,
    Validado: boolean,
    CFormInfoTitular: boolean,
    Cargando: boolean,
    Error: boolean,
    Filtros: string

}
export const CFormListaTitulares = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const DatosDefecto = { Nota: '' }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: 0,
        Filtros: '',
        Cargando: true,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        Form:
        {
            Mostrar: false,
            Id: undefined,
            Nota: '',
        },
        ReferenciaID: 0,
        ProspectoID: 0,
        NombreRef: '',
        Validado: false,
        CFormInfoTitular: false,
        CFormListaTitulares: false,
        AdvertenciaVerificaRefTitular: false,
        Nota: '',
        optNotas: [],
        MostrarCancelar: false,
    })

    const [estado, DefinirEstado] = React.useState<EstadoTipo>({
        Datos: {
            referencias: [],
            referencia: undefined
        },
        ReferenciaID: 0,
        NombreRef: '',
        Validado: false,
        CFormInfoTitular: false,
        Cargando: false,
        Error: false,
        Filtros: ''
    })

    console.log(props.nombreP, 'NOM prosp 2')

    const [mensajeID, setMensajeID] = React.useState(0)

    let validationShapeM = {
        Mensaje: Yup.string().required("Campo Obligatorio")
    }

    const fnAgregarNotaC = () => setState(s=> ({...s, Form: {...s.Form}, MostrarCancelar: true}))
    const fnCancelarC = () => setState(s=> ({...s, Form: {...s.Form}, MostrarCancelar: false}))
    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const GetMensajesFijos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMensajesFijos(props.oidc, {StatusProcesoID: 12, TipoDocumentoID: 0 })
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
                props.fnCancelarListaRefTirulares()
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

    const fnCerrarInfoRefTitular = () => DefinirEstado(s => ({ ...s, CFormInfoTitular: false }))
    const fnCerrarAdvertenciaRefs = () => { setState(s => ({ ...s, AdvertenciaVerificaRefTitular: false })) }
    const FNGetLocal = () => {

        DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, referencias: [] } })) //antes de hacer la funcion limpia el estado

        Funciones.FNGetByTitularRef(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {

                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, /*Datos: respuesta */ }))
                    DefinirEstado(s => ({
                        ...s, Datos: {
                            ...s.Datos, referencias: respuesta.referencias
                        }
                        , Cargando: false, Error: false,

                    })) //antes de hacer la funcion limpia el estado
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {

                    DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, referencias: [] } })) //antes de hacer la funcion limpia el estado
                }
            })
    }

    const fnVerInfRef = (ReferenciaID: any, NombreRef: any, referencias: DBConfia_Prospeccion.IReferencias) => {
        setState(s => ({ ...s, Filtro: 1, Datos }))
        DefinirEstado(e => (
            {
                ...e,
                Datos: {
                    ...e.Datos,
                    referencia: referencias
                },
                CFormInfoTitular: true,
                ReferenciaID,
                NombreRef
            }
        ))
    }

    const fnRechazaReferenciasTitular = (ReferenciaID: any) => setState(s => ({ ...s, AdvertenciaVerificaRefTitular: true, ReferenciaID, Filtro: 2 }))

    const fnVerificaReferenciasTitular = (ReferenciaID: any) => setState(s => ({ ...s, AdvertenciaVerificaRefTitular: true, ReferenciaID, Filtro: 1 }))


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'ReferenciaID',
                    sortable: true,
                    width: '7%',
                    cell: (props) =>
                        <span className="text-center">
                            {props.ReferenciaID}
                        </span>
                },
                {
                    name: 'Nombre Referencia',
                    selector: 'nombre',
                    sortable: true,
                    width: '30%',
                    cell: (props) =>
                        <span className="text-center">
                            {props.nombre + ' ' + props.primerApellido + ' ' + props.segundoApellido}
                        </span>
                },
                {
                    name: 'Parentesco',
                    selector: 'parentesco',
                    sortable: true,
                    width: '25%',
                    cell: (props) =>
                        <span className="text-center">
                            {props.parentesco}
                        </span>
                },
                {
                    name: 'Acción',
                    selector: '',
                    sortable: true,
                    width: '24%',
                    cell: (props) =>
                        <><button data-tip data-for={`btnVD_${props.ReferenciaID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-outline-primary" type={"button"}
                            onClick={() => fnVerInfRef(props.ReferenciaID, state.NombreRef, props)}
                        >
                            VER INFORMACIÓN
                        </button></>
                },
                {
                    name: 'Validado',
                    selector: 'Validado',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {props.Validado == true && <FaCheckCircle color='green' size={20} />}
                            {props.Validado == false && <FaTimesCircle color='red' size={20} />}
                            {props.Validado == null && <FaClock color='gray' size={20} />}
                        </div>
                },


            ]
        return colRet
    }, [])


    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtros) }))
        // DefinirEstado
        if (state.Cargando && props.Item) {
            FNGetLocal()
            GetMensajesFijos()
        }



        // eslint-disable-next-line
    }, [state.Datos, state.Filtros, props])

    return (
        <>
        <ModalWin open={props.mostrar} large center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    VERFICAR REFERENCIAS TITULAR<br />
                    PROSPECTO :&nbsp;{props.ProspectoID}&nbsp;{props.nombreP}
                </h5>
                <button type="button" className="delete" onClick={props.fnCancelarListaRefTirulares}></button>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ Nota: '' }}
                    onSubmit={(values, actions) => {
                    }}>
                    <Form >
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
                                                                        {/* <input type="text" className="form-control" placeholder="Buscar" value={estado.Filtros} onChange={e => DefinirEstado(s => ({ ...s, Filtros: e.target.value }))} />
                                                                        <span className="input-group-text"><FaSearch /> </span> */}
                                                                        {[3,2].includes(props.RevisionRefTitular) && <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => fnAgregarNotaC()}>CANCELAR PROSPECTO</button>}
                                                                        {[3,2].includes(props.RevisionRefTitular) && <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => fnVerificaReferenciasTitular(props.ProspectoID)}>VALIDAR REVISION DE REFERENCIAS DE TITULAR</button>}
                                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        data={estado.Datos.referencias}
                                                        striped
                                                        pagination
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"ReferenciaID"}
                                                        defaultSortField={"ReferenciaID"}
                                                        columns={Columns}
                                                    />
                                                </div>
                                            }
                                        </Card.Body.Content>
                                    </Card.Body>
                                </Card>
                            </div>
                        }
                        <div className="row text-center">
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                {props.RevisionRefTitular == 1 && <FaCheckCircle color='green' size={30} />}
                                {props.RevisionRefTitular == 0 && <FaTimesCircle color='red' size={30} />}
                                {props.RevisionRefTitular == 0 && <p>{props.ObservacionRevisionRefTitular}</p>}


                            </div>
                        </div>
                    </Form>
                </Formik>

            </ModalWin.Body>
            <div>

                {estado.CFormInfoTitular && <CFormInfoTitular
                    oidc={props.oidc}
                    mostrar={estado.CFormInfoTitular}
                    ReferenciaID={estado.ReferenciaID}
                    Filtro={state.Filtro}
                    fnCerrarInfoRefTitular={fnCerrarInfoRefTitular}
                    fnCerrarAdvertenciaValidaRefTitulares={fnCerrarAdvertenciaRefs}
                    FNGetLocal={FNGetLocal}
                    initialValues={state.Form}
                    Item={state.Item}
                    Datos={state.Datos}
                    NombreRef={estado.NombreRef}
                    flag={false} VerificaAval={0}
                    fnVerInfRef={fnVerInfRef}
                    referencia={estado.Datos.referencia}
                    Id={props.ProspectoID}
                />}

                {state.AdvertenciaVerificaRefTitular && <AdvertenciaVerificaRefTitular
                    oidc={props.oidc}
                    mostrar={state.AdvertenciaVerificaRefTitular}
                    ProspectoID={props.ProspectoID}
                    Filtro={state.Filtro}
                    fnCerrarAdvertenciaRefs={fnCerrarAdvertenciaRefs}
                    fnCancelarListaRefTirulares={props.fnCancelarListaRefTirulares}
                    cbActualizar={props.cbActualizar}
                    initialValues={state.Form}
                />}


            </div>

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

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CFormListaTitulares);
