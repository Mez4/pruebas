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
import { Card, CustomFieldText, Spinner, Acordion, Tabs, ImgViewer } from '../../../../../global'
import { FaSearch, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import ReactTooltip from 'react-tooltip';
import { CFormInfoRefAval } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormInfoRefAval'
import { AdvertenciaAvalTodos } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/AdvertenciaAvalTodos'



type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCancelarListaRefAvales(): any,
    AvalID: number,
    NombreAval: string,
    refe?: DBConfia_Prospeccion.IReferencias
}

type EstadoTipo = {

    Datos: {
        referencias: DBConfia_Prospeccion.IReferencias[]
        refe?: DBConfia_Prospeccion.IReferencias
    },
    idAval: number,
    NombreAval: string,
    Validado: boolean,
    CFormInfoRefAval: boolean,
    Cargando: boolean,
    Error: boolean,
    Filtros: string,
    ReferenciaID: number,
    NombreReferencia: string,
}
export const CFormListaRefsAval = (props: FormaNotasTipo) => {

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
        idAval: 0,
        ProspectoID: 0,
        NombreAval: '',
        //
        ReferenciaID: 0,
        //
        Validado: false,
        CFormInfoRefAval: false,
        CFormListaRefsAval: false,
        AdvertenciaAvalTodos: false,
        ///
    })

    const [estado, DefinirEstado] = React.useState<EstadoTipo>({
        Datos: {
            referencias: [],
            refe: undefined
        },
        idAval: 0,
        NombreAval: '',
        ReferenciaID: 0,
        NombreReferencia: '',
        Validado: false,
        CFormInfoRefAval: false,
        Cargando: false,
        Error: false,
        Filtros: '',

    })

    const fnCerrarInfoAval = () => DefinirEstado(s => ({ ...s, CFormInfoRefAval: false }))
    const fnCerrarAdvertenciaAvales = () => { setState(s => ({ ...s, AdvertenciaAvalTodos: false })) }

    const FNGetLocal = () => {
        DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, referencias: [] } })) //antes de hacer la funcion limpia el estado

        Funciones.FNGetByAvalReferencias(props.oidc, props.AvalID)
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

    const fnVerInfRef = (ReferenciaID: any, NombreReferencia: any, referencias: DBConfia_Prospeccion.IReferencias) => {
        setState(s => ({ ...s, Filtro: 1, Datos }))
        DefinirEstado(e => (
            {
                ...e,
                Datos: {
                    ...e.Datos,
                    refe: referencias
                },
                CFormInfoRefAval: true,
                ReferenciaID,
                NombreReferencia
            }
        ))

    }

    const fnRechazaAvales = (AvalID: any) => setState(s => ({ ...s, AdvertenciaAvalTodos: true, AvalID, Filtro: 2 }))

    const fnVerificaAvales = (AvalID: any) => setState(s => ({ ...s, AdvertenciaAvalTodos: true, AvalID, Filtro: 1 }))


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
                    name: 'Nombre',
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
                    name: 'Accion',
                    selector: 'NombreCompleto',
                    sortable: true,
                    width: '24%',
                    cell: (props) =>
                        <><button data-tip data-for={`btnVD_${props.ReferenciaID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-outline-primary" type={"button"}
                            onClick={() => fnVerInfRef(props.ReferenciaID, props.nombre, props)}
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
        }



        // eslint-disable-next-line
    }, [state.Datos, state.Filtros, state.Cargando, props])

    return (

        <ModalWin open={props.mostrar} large center>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    VERFICAR REFERENCIAS<br />
                    AVAL :&nbsp;{props.AvalID}&nbsp;{props.NombreAval}
                </h5>
                <button type="button" className="delete" onClick={props.fnCancelarListaRefAvales}></button>
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
                    </Form>
                </Formik>

            </ModalWin.Body>
            <div>

                {estado.CFormInfoRefAval && <CFormInfoRefAval
                    oidc={props.oidc}
                    mostrar={estado.CFormInfoRefAval}
                    ReferenciaID={estado.ReferenciaID}
                    Filtro={state.Filtro}
                    fnCerrarInfoAval={fnCerrarInfoAval}
                    fnCerrarAdvertenciaAvales={fnCerrarAdvertenciaAvales}
                    FNGetLocal={FNGetLocal}
                    initialValues={state.Form}
                    Item={state.Item}
                    Datos={state.Datos}
                    NombreReferencia={estado.NombreReferencia}
                    flag={false} VerificaAval={0}
                    fnVerInfReferecia={fnVerInfRef}
                    refe={estado.Datos.refe}
                    Id={props.Id}
                />}

            </div>

        </ModalWin>
    )

}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CFormListaRefsAval);
