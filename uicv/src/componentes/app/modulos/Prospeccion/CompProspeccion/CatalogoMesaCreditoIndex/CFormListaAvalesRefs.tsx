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
import { CFormAvalesProspectoInfo } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormAvalesProspectoInfo'
import { AdvertenciaVerificaRefsAvales } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/AdvertenciaVerificaRefsAvales'
import { CFormListaRefsAval } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormListaRefsAval'
import { toast } from 'react-toastify'



type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCerrarListaAvalesRefs(): any,
    cbActualizar(item: any): any,
    //fnVerificarAval(ProspectoID: any, NombreProspecto: any, ObservacionRevisionRefAval: any): any,
    ProspectoID: number,
    nombreP: string,
    flag: boolean,
    aval?: DBConfia_Prospeccion.IAvales_VW,
    RevisionRefAval: number,
    ObservacionRevisionRefAval: string,
}

type EstadoTipo = {

    Datos: {
        avales: DBConfia_Prospeccion.IAvales_VW[]
        aval?: DBConfia_Prospeccion.IAvales_VW
    },
    idAval: number,
    NombreAval: string,
    Validado: boolean,
    CFormAvalesProspectoInfo: boolean,
    Cargando: boolean,
    Error: boolean,
    Filtros: string

}
export const CFormListaAvalesRefs = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const DatosDefecto = { Nota: '' }
    let isMounted = React.useRef(true)
    const Datos:/*undefined*/  any[] = []
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
        idAval: 0,
        ProspectoID: 0,
        NombreAval: '',
        Validado: false,
        CFormAvalesProspectoInfo: false,
        CFormListaAvalesRefs: false,
        AdvertenciaVerificaRefsAvales: false,
        CFormListaRefsAval: false,
        AvalID: 0,
        Nota: '',
        optNotas: [],
        MostrarCancelar: false,
    })

    const [estado, DefinirEstado] = React.useState<EstadoTipo>({
        Datos: {
            avales: [],
            aval: undefined,
        },
        idAval: 0,
        NombreAval: '',
        Validado: false,
        CFormAvalesProspectoInfo: false,

        Cargando: false,
        Error: false,
        Filtros: ''
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
        Funciones.FnGetMensajesFijos(props.oidc, {StatusProcesoID: 13, TipoDocumentoID: 0 })
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
                props.fnCerrarListaAvalesRefs()
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

    const fnCancelarListaRefAvales = () => setState(s => ({ ...s, CFormListaRefsAval: false }))
    const fnCerrarAdvertenciarefsAvales = () => { setState(s => ({ ...s, AdvertenciaVerificaRefsAvales: false })) }

    const FNGetLocal = () => {

        DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, avales: [] } })) //antes de hacer la funcion limpia el estado

        Funciones.FNGetAvalesByProspectoID(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, /*Datos: respuesta */ }))
                    DefinirEstado(s => ({
                        ...s, Datos: {
                            ...s.Datos, avales: respuesta.avales
                        }
                        , Cargando: false, Error: false,

                    })) //antes de hacer la funcion limpia el estado
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {

                    DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, avales: [] } })) //antes de hacer la funcion limpia el estado
                }
            })
    }
    const fnVerificarRefAval = (AvalID: any, NombreAval: any) => {
        setState(s => ({ ...s, AvalID: AvalID, NombreAval: NombreAval, CFormListaRefsAval: true, Item: AvalID }))
    }

    const fnRechazaAvales = (AvalID: any) => setState(s => ({ ...s, AdvertenciaVerificaRefsAvales: true, AvalID, Filtro: 2 }))

    const fnVerificaAvales = (AvalID: any) => setState(s => ({ ...s, AdvertenciaVerificaRefsAvales: true, AvalID, Filtro: 1 }))


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'AvalID',
                    sortable: true,
                    width: '25%',
                    cell: (props) =>
                        <span className="text-center">
                            {props.AvalID}
                        </span>
                },
                {
                    name: 'Nombre',
                    selector: 'NombreCompleto',
                    sortable: true,

                    cell: (props) =>
                        <span className="text-center">
                            {props.NombreCompleto}
                        </span>
                },
                {
                    name: 'Accion',
                    selector: 'NombreCompleto',
                    sortable: true,
                    width: '25%',
                    cell: (props) =>
                        <><button data-tip data-for={`btnVD_${props.AvalID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-outline-primary" type={"button"}
                            onClick=
                            {
                                () => fnVerificarRefAval(props.AvalID, props.NombreCompleto)}
                        >
                            VER REFERENCIAS
                        </button></>
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
                    LISTA AVALES <br />
                    PROSPECTO :&nbsp;{props.ProspectoID}&nbsp;{props.nombreP}
                </h5>
                <button type="button" className="delete" onClick={props.fnCerrarListaAvalesRefs}></button>
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
                                                                        {[2,3].includes(props.RevisionRefAval) && <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => fnAgregarNotaC() }>CANCELAR PROSPECTO</button>}
                                                                        {[2,3].includes(props.RevisionRefAval) && <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => fnVerificaAvales(props.ProspectoID)}>VALIDAR REVISION DE REFERENCIAS DE AVALES</button>}
                                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        data={estado.Datos.avales}
                                                        striped
                                                        pagination
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"AvalID"}
                                                        defaultSortField={"AvalID"}
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
                                {props.RevisionRefAval == 1 && <FaCheckCircle color='green' size={30} />}
                                {props.RevisionRefAval == 0 && <p> <FaTimesCircle color='red' size={30} /> {props.ObservacionRevisionRefAval}</p>}
                            </div>
                        </div>
                    </Form>
                </Formik>

            </ModalWin.Body>
            <div>

                {state.CFormListaRefsAval && <CFormListaRefsAval
                    oidc={props.oidc}
                    Id={props.ProspectoID}
                    Item={state.Item}
                    mostrar={state.CFormListaRefsAval}
                    fnCancelarListaRefAvales={fnCancelarListaRefAvales}
                    AvalID={state.AvalID}
                    NombreAval={state.NombreAval}
                />}

                {state.AdvertenciaVerificaRefsAvales && <AdvertenciaVerificaRefsAvales
                    oidc={props.oidc}
                    mostrar={state.AdvertenciaVerificaRefsAvales}
                    ProspectoID={props.ProspectoID}
                    Filtro={state.Filtro}
                    fnCerrarAdvertenciaRefs={fnCerrarAdvertenciarefsAvales}
                    fnCerrarListaAvalesRefs={props.fnCerrarListaAvalesRefs}
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
export default connect(mapStateToProps, mapDispatchToProps)(CFormListaAvalesRefs);
