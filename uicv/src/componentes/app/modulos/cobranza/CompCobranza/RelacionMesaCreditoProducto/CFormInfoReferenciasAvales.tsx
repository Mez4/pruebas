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
import { FaPlus, FaSearch, FaHouseUser, FaTimesCircle, FaCheckCircle, } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { date } from 'yup/lib/locale'
import { FormaTiempo } from '../../../Mesadecredito/CompMesadecredito/RevisionExpediente/FormaTiempos'
//import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, PersonaID: number, NombreCompleto: string, FechaNacimiento: string, Sexo: string, CURP: string, EstadoCivil: string, TelefonoMovil: string, CorreoElectronico: string, LugarNacimiento: string, TelefonoDomicilio: string, RFC: string, DireccionID: number, NombreVialidad: string, CreacionFecha: string, NombreConyuge: string }
}

export const CFormInfoReferenciasAvales = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const DatosDefecto = { Nota: '' }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

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
        }
    })

    React.useEffect(() => {
        if (state.Cargando) {
            // FNGetLocal()
        }
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro, state.Cargando, props])


    console.log(moment(props.initialValues.FechaNacimiento, 'YYYY-MM-DD'), 123)

    return (
        <Formik
            initialValues={{}}
            onSubmit={() => {
            }}>
            <Form >
                {loading && <Spinner />}
                {!loading &&
                    <>
                        {/* <div className="d-flex flex-row-reverse" style={{marginBottom: '1em'}}>
                                {props.referencia?.Validado == null && <div className="p-0">  <button onClick={() => fnValidaAval(props.referencia?.ReferenciaID)} type="submit"
                                    className="ms-2 btn btn-success waves-effect waves-light">VALIDAR REFERENCIA</button></div>}
                                {props.referencia?.Validado == null && <div className="p-0">   <button onClick={() => fnRechazaAval(props.ReferenciaID)} type="submit"
                                    className="ms-2 btn btn-danger waves-effect waves-light ">NOTIFICAR ERROR</button></div>}
                            </div> */}
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
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre Completo:</td>
                                                                <td>{props.initialValues.NombreCompleto}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha de Nacimiento:</td>

                                                                <td>{moment(props.initialValues.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo: </td>
                                                                <td>{props.initialValues.Sexo}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                                <td>{props.initialValues.CURP}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO. CIVIL:</td>
                                                                <td>{props.initialValues.EstadoCivil}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                                <td>{props.initialValues.TelefonoMovil}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-MAIL:</td>
                                                                <td>{props.initialValues.CorreoElectronico}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar Nacimiento:</td>
                                                                <td>{props.initialValues.LugarNacimiento}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Domicilio:</td>
                                                                <td>{props.initialValues.NombreVialidad}</td>
                                                            </tr>

                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>NombreConyuge:</td>
                                                                <td>{props.initialValues.NombreConyuge}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>

                                                </div>


                                            </div>

                                        </div>


                                    </div>

                                </div>

                            </Acordion.Tab>

                        </Acordion>
                    </>
                }
            </Form>
        </Formik>
    )
}
