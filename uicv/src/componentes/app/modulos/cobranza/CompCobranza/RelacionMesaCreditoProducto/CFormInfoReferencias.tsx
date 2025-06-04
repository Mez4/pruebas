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
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    initialValues: { AniosDom: string, Cel: string, CreditosDistribuidoresReferenciaID: number, DistribuidorID: number, Domicilio: string, Edad: number, FechaHoraRegistro: string, Nombre: string, Parentesco: string, PersonaIDRegistro: number, Tel: string, UsuarioIDRegistro: number, referenciaTipoId: number }
}

export const CFormInfoReferencias = (props: FormaNotasTipo) => {

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
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Numero Referencia:</td>
                                                                <td>{props.initialValues.CreditosDistribuidoresReferenciaID}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre Completo:</td>
                                                                <td>{props.initialValues.Nombre}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Edad:</td>
                                                                <td>{props.initialValues.Edad}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Parentesco: </td>
                                                                <td>{props.initialValues.Parentesco}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                                <td>{props.initialValues.Cel}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Domicilio:</td>
                                                                <td>{props.initialValues.Domicilio}</td>
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
