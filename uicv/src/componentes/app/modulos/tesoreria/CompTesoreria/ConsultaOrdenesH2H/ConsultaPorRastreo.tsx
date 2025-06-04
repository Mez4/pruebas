import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, DatePickeStart } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'

import { valueContainerCSS } from 'react-select/src/components/containers'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { valueEventAriaMessage } from 'react-select/src/accessibility'
import DataTable from 'react-data-table-component'
import { FaCircle } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import moment from 'moment'
import { toast } from 'react-toastify'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormateoDinero } from '../../../../../../global/variables'


type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        ClaveRastreo: string,
        FechaOperacion: Date

    },
    fnCancelar(): any,

}

export const ConsultaPorRastreo = (props: CFormType) => {
    const MySwal = withReactContent(Swal)

    const [loading2, setLoading2] = React.useState(false)
    const [startDate, setStartDate] = useState(moment().toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize={false}
            validationSchema={Yup.object().shape({
                ClaveRastreo: Yup.string().required('Requerido'),
                FechaOperacion: Yup.date().required('Requerido').typeError('Requerido')

            })}
            onSubmit={(values: any, { resetForm }) => {

                setLoading2(true)
                let a = {
                    ClaveRastreo: values.ClaveRastreo,
                    FechaOperacion: values.FechaOperacion
                }
                Funciones.FNPostConsultaxRastreo(props.Seguridad, a)
                    .then((respuesta: any) => {
                        setLoading2(false)
                        if (respuesta.TipoRespuesta == 1) {
                            MySwal.fire(
                                {
                                    icon: 'success',
                                    html: <div><br />
                                        <h3 className="text-center"><strong>Información sobre la orden.</strong></h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">
                                                <table className="table table-orden">
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={2} scope='row' className='text-center' ><strong>Clave de Rastreo</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} scope='row' className='text-center'>{respuesta.ClaveRastreo} </td>
                                                        </tr>
                                                        <tr>
                                                            <td scope='row' colSpan={1} className='text-center' style={{ width: '50%' }}><strong>Fecha de Operación</strong></td>
                                                            <td scope='row' colSpan={1} className='text-center' style={{ width: '50%', whiteSpace: 'pre' }}><strong>Nombre del <br></br> Beneficiario</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope='row' colSpan={1} className='text-center td-orden' style={{ verticalAlign: 'middle' }}>{respuesta.FechaOperacion}</td>
                                                            <td scope='row' colSpan={1} className='text-center'>{respuesta.NombreBeneficiario}</td>
                                                        </tr>
                                                        <tr>
                                                            <td scope='row' className='text-center'><strong>Tipo Cuenta</strong></td>
                                                            <td scope='row' className='text-center'><strong>Cuenta Beneficiario</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope='row' className='text-center td-orden'>{respuesta.TipoCuentaBeneficiario}</td>
                                                            <td scope='row' className='text-center'>{respuesta.CuentaBeneficiario}</td>
                                                        </tr>
                                                        <tr>
                                                            <td scope='row' className='text-center'><strong>Estado</strong></td>
                                                            <td scope='row' className='text-center'><strong>Monto</strong></td>
                                                        </tr>
                                                        <tr>
                                                            <td scope='row' className='text-center td-orden'>{respuesta.Estado}</td>
                                                            <td scope='row' className='text-center'>{FormateoDinero.format(respuesta.Monto)}</td>
                                                        </tr>
                                                        {/*  <tr>
                                                            <td>Nombre Beneficiario</td>
                                                            <td>Estado</td>
                                                            <td>Tipo Ccuenta</td>
                                                            <td>Cuenta Beneficiario</td>
                                                            <td>Monto</td>
                                                        </tr> */}
                                                    </tbody>
                                                </table>


                                            </h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Ok`,
                                    confirmButtonAriaLabel: `Ok`,
                                    confirmButtonColor: `#3085d6`,
                                    allowEscapeKey: false,
                                    allowOutsideClick: false,

                                }
                            );
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'error',
                                    html: <div><br />
                                        <h3 className="text-center"><strong>Error al consultar</strong></h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">
                                                No se encontró la orden con la clave de rastreo:<strong> {values.ClaveRastreo}</strong>
                                            </h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Ok`,
                                    confirmButtonAriaLabel: `Ok`,
                                    confirmButtonColor: `#3085d6`,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,

                                }
                            );
                        }
                    })
                    .catch((error: any) => {
                        setLoading2(false)
                        toast.error("Error al consultar")
                    })

            }}
        >
            <Form>

                <div>

                    <div className="row columns is-centered is-mobile is-multiline">
                        <div className="column is-full-desktop is-full-tablet is-full-mobile">
                            <CustomFieldText
                                disabled={loading2}//props.Id=== undefined? false : true
                                label="Clave de rastreo:"
                                name="ClaveRastreo"
                                placeholder="Clave de rastreo"
                            />
                        </div>
                        <div style={{ display: 'none' }} className="column is-half-desktop is-half-tablet is-half-mobile">
                            <DatePickeStart name={'FechaOperacion'}
                                label={'Fecha:'}
                                disabled={loading2}
                                placeholder={'Fecha'}
                                isClearable
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate} />
                        </div>
                    </div>
                    {loading2 && <Spinner />}
                    {!loading2 &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>



            </Form>

        </Formik>
    )
}
