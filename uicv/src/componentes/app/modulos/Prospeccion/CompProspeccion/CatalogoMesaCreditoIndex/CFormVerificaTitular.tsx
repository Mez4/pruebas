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
import { FaPlus, FaSearch, FaHouseUser, FaUser, FaClock, FaTimesCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import { AdvertenciaTitular } from '../../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/AdvertenciaTitular'
import * as FuncionesDoc from '../DocsProspecto/Funciones'
import { toast } from 'react-toastify'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCancelarVerifca(): any,
    fnCancelarVerificaModal(): any,
    cbActualizar(item: any): any,
    ProspectoID: number,
    nombreP: string,
    flag: boolean,
    VerificaTitular: number
}

type EstadoTipo = {

    Datos: {

        prospecto?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW
        socioeconomico?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW
        vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[]
        experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[]

    },

}
export const CFormVerificaTitular = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const DatosDefecto = { Nota: '' }
    let isMounted = React.useRef(true)
    const Datos = undefined // any[] = []
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
        ProspectoID: 0,
        AdvertenciaTitular: false,
        CFormVerificaTitular: false,
        doc: '',
        docLabel: '',
        solicitud: '',
        Docs,
        cancela: false,
    })

    const [estado, DefinirEstado] = React.useState<EstadoTipo>({
        Datos: {
            prospecto: undefined,
            socioeconomico: undefined,
            vehiculos: [],
            experiencia: []
        }
    })

    // console.log(props.nombreP, 'nombre p verificaT')
    const FNGetLocal = () => {

        DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, prospecto: undefined, socioeconomico: undefined, vehiculos: [], experiencia: [] } })) //antes de hacer la funcion limpia el estado

        Funciones.FNGetInfoTitular(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {

                if (isMounted.current === true) {
                    DefinirEstado(s => ({
                        ...s, Datos: {
                            ...s.Datos, prospecto: respuesta.prospecto, socioeconomico: respuesta.socioeconomico, vehiculos: respuesta.vehiculos,
                            experiencia: respuesta.experiencia
                        }
                    })) //antes de hacer la funcion limpia el estado
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {

                    DefinirEstado(s => ({ ...s, Datos: { ...s.Datos, prospecto: undefined, socioeconomico: undefined, vehiculos: [], experiencia: [] } })) //antes de hacer la funcion limpia el estado
                }
            })
    }

    const ConsultaDocs = async () => {
        Docs = await FuncionesDoc.FNGetDocsByProspectoID(props.oidc, props.ProspectoID) as any[]
        console.log(Docs)
        setState(s => ({ ...s, Docs: Docs }))
        Docs.forEach(e => {
            if (['D003'].includes(e.Clave)) {
                console.log(e.Clave)
                FuncionesDoc.FNGetDocsByDocumentoID(props.oidc, e.DocumentoID)
                    .then((respuesta: any) => {
                        if (isMounted.current === true) {
                            if (e.Clave === 'D003') setState(s => ({ ...s, solicitud: respuesta.src, doc: respuesta.src, docLabel: 'SOLICITUD DE CRÉDITO' }))
                        }
                    })
                    .catch((error) => {
                        if (isMounted.current === true) {
                            toast.error(`El documento ${e.Clave}- ${e.NombreDocumento} no se encontró, confirme que el promotor si subió el documento. Error: ${error}`)
                            if (e.Clave === 'D003') setState(s => ({ ...s, solicitud: `Error: ${error}` }))
                        }
                    })
            }
        });
    }

    const fnCancelarVerifca = () => setState(s => ({ ...s, CForm: false, AdvertenciaTitular: false }))
    const fnRechaza = (ProspectoID: any) => setState(s => ({ ...s, CFormVerificaTitular: false, AdvertenciaTitular: true, ProspectoID, Filtro: 2, cancela: false }))
    const fnCancelaP = (ProspectoID: any) => setState(s => ({ ...s, CFormVerificaTitular: false, AdvertenciaTitular: true, ProspectoID, Filtro: 2, cancela: true }))

    const fnVerificaTitular = (ProspectoID: any) => setState(s => ({ ...s, CFormVerificaTitular: false, AdvertenciaTitular: true, ProspectoID, Filtro: 1, cancela: false }))

    // Use effect
    React.useEffect(() => {
        setState(s => ({ ...s, Datos }))
        if (state.Cargando && props.Item) {
            const fetchData = async () => FNGetLocal()
            fetchData().catch(console.error);
            const fetchData2 = async () => ConsultaDocs()
            fetchData2().catch(console.error);
            //FNGetLocal()
            //ConsultaDocs()
        }

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro, state.Cargando, props])

    return (
        <ModalWin open={props.mostrar} xlarge >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    VERFICAR TITULAR <br />
                    PROSPECTO :&nbsp;{props.ProspectoID}&nbsp;{props.nombreP}
                </h5>
                <button type="button" className="delete" onClick={props.fnCancelarVerificaModal}></button>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ Nota: '' }}
                    onSubmit={(values, actions) => {
                    }}>
                    <Form >
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="row">

                                <div className="col-sm-12 text-end" style={{ marginBottom: '1em' }}>
                                    {[3, 2, 0].includes(props.VerificaTitular) &&
                                        <div>
                                            <button type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => fnCancelaP(props.ProspectoID)}>CANCELAR PROSPECTO</button>
                                            <button type="button" className="ms-2 btn btn-warning waves-effect waves-light" onClick={() => fnRechaza(props.ProspectoID)}>AGREGAR NOTA</button>
                                            <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => fnVerificaTitular(props.ProspectoID)}>VALIDAR LA INFORMACIÓN DEL TITULAR</button>
                                        </div>}
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <div className="text-end">
                                        <div className="text-center">
                                            <Acordion TabSelecionado="info">
                                                <Acordion.Tab Identificador="info" Titulo={<React.Fragment><FaUser />&nbsp;DATOS GENERALES</React.Fragment>}>
                                                    <>
                                                        <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha Nacimiento:</td>
                                                                        <td>{moment(estado.Datos.prospecto?.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                                                        <td>{estado.Datos.prospecto?.Sexo}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                                        <td>{estado.Datos.prospecto?.CURP}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO. CIVIL: </td>
                                                                        <td>{estado.Datos.prospecto?.EstadoCivil}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                                        <td>{estado.Datos.prospecto?.TelefonoMovil}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                                                        <td>{estado.Datos.prospecto?.CorreoElectronico}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar de Nacimiento:</td>
                                                                        <td>{estado.Datos.prospecto?.LugarNacimiento}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                        <td>{estado.Datos.prospecto?.DireccionProspecto}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Teléfono Fijo:</td>
                                                                        <td>{estado.Datos.prospecto?.TelefonoDomicilio}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <hr />
                                                        <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <caption style={{ captionSide: 'top' }}><strong>DATOS LABORALES</strong></caption>
                                                                {!estado.Datos.prospecto?.TieneEmpleo && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene Empleo</td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>}
                                                                {Boolean(estado.Datos.prospecto?.TieneEmpleo) &&
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa</td>
                                                                            <td>{estado.Datos.prospecto?.Empresa}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                                            <td>{estado.Datos.prospecto?.Ocupacion}</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>

                                                                            <td>{FormateoDinero.format(estado.Datos.prospecto?.Sueldo ?? 0)}</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antiguedad:</td>
                                                                            <td>{estado.Datos.prospecto?.Antiguedad}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                            <td>{estado.Datos.prospecto?.DireccionEmpresaProspecto}</td>
                                                                        </tr>

                                                                    </tbody>}
                                                            </table>
                                                        </div>
                                                        <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <caption style={{ captionSide: 'top' }}><strong>DATOS CONYUGE</strong></caption>
                                                                {!estado.Datos.prospecto?.TieneConyuge && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene conyuge</td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>}
                                                                {Boolean(estado.Datos.prospecto?.TieneConyuge) &&
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre</td>
                                                                            <td>{estado.Datos.prospecto?.NombreConyuge}</td>
                                                                        </tr>
                                                                    </tbody>}
                                                                {Boolean(estado.Datos.prospecto?.TieneConyuge && estado.Datos.prospecto?.TieneEmpleoConyuge) &&
                                                                    <tbody>
                                                                        <p className={"mb-1 fw-bold"} >DATOS LABORALES CONYUGUE</p>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                                            <td>{estado.Datos.prospecto?.EmpresaConyuge}</td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                                            <td>{estado.Datos.prospecto?.OcupacionConyuge}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                            <td>{FormateoDinero.format(estado.Datos.prospecto?.SueldoConyuge ?? 0)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antiguedad:</td>
                                                                            <td>{estado.Datos.prospecto?.AntiguedadConyuge}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                            <td>{estado.Datos.prospecto?.DireccionEmpresaConyuge}</td>
                                                                        </tr>

                                                                    </tbody>}
                                                            </table>
                                                        </div>

                                                    </>
                                                </Acordion.Tab>
                                            </Acordion>
                                            <Acordion TabSelecionado="">
                                                <Acordion.Tab Identificador="socio" Titulo={<React.Fragment><FaHouseUser />&nbsp;DATOS SOCIOECONOMICOS</React.Fragment>}>
                                                    <>
                                                        <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                {!estado.Datos.socioeconomico?.TipoVivienda && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Capturada</td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>}
                                                                {estado.Datos.socioeconomico?.TipoVivienda && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFC:</td>
                                                                        <td>{estado.Datos.socioeconomico?.RFC}</td>
                                                                    </tr>
                                                                </tbody>}
                                                            </table>
                                                        </div>
                                                        {estado.Datos.socioeconomico?.TipoVivienda && <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <caption style={{ captionSide: 'top' }}><strong>DATOS VIVIENDA</strong></caption>
                                                                {!estado.Datos.socioeconomico?.TipoVivienda && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Capturada</td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>}
                                                                {estado.Datos.socioeconomico?.TipoVivienda && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo de Vivienda:</td>
                                                                        <td>{estado.Datos.socioeconomico?.TipoVivienda}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Personas que la habitan:</td>
                                                                        <td>{estado.Datos.socioeconomico?.numeroPersonasHabitan}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Valor (aprox):</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.valorAproximado ?? 0)}</td>
                                                                    </tr>
                                                                </tbody>}
                                                            </table>
                                                        </div>}
                                                        {estado.Datos.socioeconomico?.TipoVivienda && <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <caption style={{ captionSide: 'top' }}><strong>DATOS OTRA VIVIENDA</strong></caption>
                                                                {!estado.Datos.socioeconomico?.TieneOtraVivienda && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No Tiene Otra Vivienda</td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>}
                                                                {Boolean(estado.Datos.socioeconomico?.TieneOtraVivienda) && <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo de Vivienda:</td>
                                                                        <td>{estado.Datos.socioeconomico?.TipoViviendaOtra}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Valor (aprox.)</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.valorAproximadoOtra ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                                        <td>{estado.Datos.socioeconomico?.DireccionOtraVivienda}</td>
                                                                    </tr>
                                                                </tbody>}
                                                            </table>
                                                        </div>}
                                                        <hr />
                                                        {estado.Datos.socioeconomico?.TipoVivienda && <div className="text-start">
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <caption style={{ captionSide: 'top' }}><strong>INGRESOS</strong></caption>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.ingresoSueldo ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ganancias como DV:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.gananciasDV ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ingreso del Conyuge:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.ingresoConyuge ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Otro Ingreso:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.otrosIngresos ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>Total de Ingreso:</strong></td>
                                                                        <td><strong>{FormateoDinero.format(estado.Datos.socioeconomico?.ingresoTotal ?? 0)}</strong></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                                <caption style={{ captionSide: 'top' }}><strong>EGRESOS</strong></caption>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Alimentación:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.AlimetacionEgreso ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tarjetas:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.TarjetasEgreso ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Vivienda (pago o renta):</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.RentaPagoViviendaEgreso ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Servicios Domesticos:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.ServiciosDomesticosEgreso ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Otros Egresos:</td>
                                                                        <td>{FormateoDinero.format(estado.Datos.socioeconomico?.OtroEgreso ?? 0)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dependientes Economicos:</td>
                                                                        <td>{estado.Datos.socioeconomico?.DependientesEconomicos}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong>Total de Egresos:</strong></td>
                                                                        <td><strong>{FormateoDinero.format(estado.Datos.socioeconomico?.EgresoTotal ?? 0)}</strong></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <hr />
                                                            {estado.Datos.vehiculos.length <= 0 && <span>Sin Vehículos</span>}
                                                            {estado.Datos.vehiculos.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                                                <table className='table'>
                                                                    <caption style={{ captionSide: 'top' }}>VEHÍCULOS</caption>
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ backgroundColor: 'darkgray', color: 'white' }}>MARCA</th>
                                                                            <th style={{ backgroundColor: 'darkgray', color: 'white' }}>MODELO</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {estado.Datos.vehiculos.map((c: any, cId: number) =>
                                                                            <tr key={'crd_' + cId}>
                                                                                <td>{c.Marca}</td>
                                                                                <td>{c.Modelo}</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>}
                                                            <hr />
                                                            {estado.Datos.experiencia.length <= 0 && <span>Sin Experiencia</span>}
                                                            {estado.Datos.experiencia.length > 0 && <div className="text-start" style={{ overflowX: 'auto' }}>
                                                                <table className='table' >
                                                                    <caption style={{ captionSide: 'top' }}>EXPERIENCIA EN VENTAS</caption>
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ backgroundColor: 'darkgray', color: 'white', verticalAlign: 'bottom' }}>EMPRESA</th>
                                                                            <th style={{ backgroundColor: 'darkgray', color: 'white', verticalAlign: 'bottom' }}>INGRESO</th>
                                                                            <th style={{ backgroundColor: 'darkgray', color: 'white' }}>LIMITE DE CRÉDITO</th>
                                                                            <th style={{ backgroundColor: 'darkgray', color: 'white' }}>CRÉDITO DISPONIBLE</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {estado.Datos.experiencia.map((c: any, cId: number) =>
                                                                            <tr key={'crd_' + cId}>
                                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.Descripcion}</td>
                                                                                <td>{moment(c.FechaIngreso).format('DD/MM/YYYY')}</td>
                                                                                <td>{FormateoDinero.format(c.LimiteCredito)}</td>
                                                                                <td>{FormateoDinero.format(c.CreditoDisponible)}</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>}
                                                        </div>}
                                                    </>
                                                </Acordion.Tab>
                                            </Acordion>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6">
                                    <Acordion TabSelecionado="Documentos">
                                        <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTOS</React.Fragment>}>
                                            <>
                                                <div>
                                                    <div className="row">
                                                        <div className="col-12 text-center" style={{ marginBottom: '1em' }}>
                                                            <div className="lightbox" style={{ width: '100%', height: '450px', backgroundColor: 'white' }}>
                                                                <figure className="figure">
                                                                    <figcaption className="figure-caption">{state.docLabel}</figcaption>
                                                                    {state.doc.includes("pdf") ? <object data={state.doc} type='application/pdf' width={'100%'} height={'400px'} /> : <ImgViewer imgSrc={state.doc} noToolbar={false} zIndex={1000} maxWidth={500} maxHeight={450} />}
                                                                </figure>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        </Acordion.Tab>
                                    </Acordion>


                                </div>
                                {state.AdvertenciaTitular && <AdvertenciaTitular
                                    oidc={props.oidc}
                                    mostrar={state.AdvertenciaTitular}
                                    ProspectoID={state.ProspectoID}
                                    Filtro={state.Filtro}
                                    fnCancelar={fnCancelarVerifca}
                                    fnCancelarVerifica={props.fnCancelarVerifca}
                                    fnCerrarverifica={props.fnCancelarVerificaModal}
                                    cbActualizar={props.cbActualizar}
                                    initialValues={state.Form.Datos}
                                    cancela={state.cancela}
                                />}

                            </div>
                        }



                        <div className="row text-center">
                            {props.VerificaTitular !== 1 && <div style={{ width: '100%', textAlign: 'center' }}>
                                {estado.Datos.prospecto?.Observacion != null && <FaTimesCircle color='red' size={30} />}
                                {estado.Datos.prospecto?.Observacion != null && <p style={{ fontSize: '15px' }}>NOTA: {estado.Datos.prospecto.Observacion}</p>}
                                {props.VerificaTitular == 3 && estado.Datos.prospecto?.Observacion == null}
                                {props.VerificaTitular == 2 && estado.Datos.prospecto?.Observacion == null}

                                {props.VerificaTitular != 2 && props.VerificaTitular != 3 && estado.Datos.prospecto?.Observacion == null && <FaCheckCircle color='green' size={30} />}
                            </div>}
                        </div>
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>

    )
}
