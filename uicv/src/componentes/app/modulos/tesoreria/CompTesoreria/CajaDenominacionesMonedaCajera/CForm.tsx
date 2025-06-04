import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable from 'react-data-table-component'
import { FaPencilAlt } from 'react-icons/fa'
import { Toast } from 'react-toastify/dist/components'
import { FormateoDinero } from '../../../../../../global/variables'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type CFormType = {

    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        bancoID: number,
        nombre: string,
        activo: boolean
    },

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optionsSucursal: { value: number, label: string }[]
    optionsCajas: { value: number, label: string }[]
    DatosTabla: any[]

    calcularTotal(item: any): any
    CargandoModal: any
    TotalGeneral: any
    CajaID: any,

}

export const CForm = (props: CFormType) => {
    //alert(props.CajaID)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                //nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                let totalEfectivoCaja: any = []
                props.DatosTabla.forEach((element: any) => {
                    if (element.cantidad === undefined) {
                        element.cantidad = 0
                        element.total = 0
                    }
                    let a = {
                        "catDenomEfectivoID": element.catDenomEfectivoID,
                        "cantidad": element.cantidad,
                        "totalXEfectivo": element.total,
                        "CajaID": props.CajaID,
                    }
                    totalEfectivoCaja.push(a)
                });

                let datos = {
                    CajaID: props.CajaID,
                    totalEfectivoCaja
                }

                var continuar = false;

                totalEfectivoCaja.forEach(element => {
                    if (element.cantidad > 0) {
                        continuar = true
                    }
                });

                if (continuar) {
                    setLoading(true)
                    Funciones.FNAddRegistro(props.Seguridad, datos).then((respuesta: any) => {
                        toast.success(respuesta.Mensaje)
                        props.fnCancelar()
                        //props.cbActualizar(datos.CajaID)
                        resetForm({ values: '' })
                        setLoading(false)
                    })
                        .catch((res: any) => {
                            toast.error("Ocurrió un problema mientras se guardaba, reintente.")
                            setLoading(false)
                            console.log(res)
                        })
                } else {
                    MySwal.fire({
                        icon: 'error',
                        html: <div><br />
                            <h3 className="text-center">Cantidad</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Captura alguna cantidad antes de continuar.</h5>
                            </div>
                        </div>,
                        showCancelButton: false,
                        confirmButtonText: `Ok`,
                    })
                }
            }}
        >
            <Form>
                <div>
                    <hr />
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column text-center  is-half-desktop is-full-tablet is-full-mobile">
                            <h4 >
                                Cantidades Monetarias:
                            </h4>
                        </div>
                        <div className="column text-center  is-half-desktop is-full-tablet is-full-mobile">
                            <h6 >
                                Total : {FormateoDinero.format(props.TotalGeneral)}
                            </h6>
                        </div>
                    </div>
                    <hr />
                    {props.CargandoModal && <Spinner />}
                    {!props.CargandoModal &&
                        <DataTable
                            data={props.DatosTabla}
                            striped
                            pagination={false}
                            dense
                            noHeader
                            responsive
                            keyField={"catDenomEfectivoID"}
                            defaultSortField={"catDenomEfectivoID"}
                            columns={[
                                {
                                    name: 'Id',
                                    selector: 'catDenomEfectivoID',
                                    sortable: false,
                                    center: true
                                },
                                {
                                    name: 'Concepto',
                                    selector: 'concepto',
                                    sortable: false,
                                    center: true,
                                    wrap: true
                                },
                                {
                                    name: 'Valor monetario',
                                    selector: 'valorMonetario',
                                    sortable: false,
                                    center: true
                                },
                                {
                                    name: 'Cantidad',
                                    selector: 'cantidad',
                                    sortable: false,
                                    center: true,
                                    cell: (propss) =>
                                        <Field disabled={false} id={"cantidad" + propss.catDenomEfectivoID} name={"cantidad" + propss.catDenomEfectivoID}>
                                            {
                                                (control: any) => (
                                                    <input
                                                        type="number"
                                                        step='0'
                                                        min='0'
                                                        placeholder='0'
                                                        className="form-control"
                                                        value={control.field.value}
                                                        defaultValue="0"
                                                        //pattern="\d{1,10}(.\d{1,2})?"
                                                        disabled={false}
                                                        onBlur={(value: any) => {
                                                            propss.cantidad = parseInt(value.target.value)
                                                            if (isNaN(propss.total)) {
                                                                propss.total = 0


                                                            }
                                                            if (propss.total !== undefined) {
                                                                if (propss.totalNuevo !== undefined) {
                                                                    propss.totalAn = propss.totalNuevo
                                                                }
                                                                if (propss.totalAn === undefined) {
                                                                    props.calcularTotal(propss)
                                                                    propss.totalAn = propss.total
                                                                }

                                                                if (parseFloat(propss.totalAn) !== parseFloat(propss.total)) {
                                                                    propss.totalNuevo = parseFloat(propss.total)
                                                                    props.calcularTotal(propss)
                                                                    delete propss.totalAn
                                                                }
                                                            }
                                                        }}
                                                        onChange={(value: any) => {
                                                            control.form.setFieldValue("cantidad" + propss.catDenomEfectivoID, value.target.value)
                                                            let suma = parseInt(value.target.value) * propss.valorMonetario
                                                            console.log(suma)
                                                            propss.total = suma
                                                        }}
                                                    />
                                                )
                                            }
                                        </Field>
                                },
                                {
                                    name: 'Total',
                                    selector: 'total',
                                    sortable: false,
                                    center: true,
                                    cell: (propss) => propss.total == undefined ? <span className="text-center">$ 0.00</span> : <span className="text-center">{FormateoDinero.format(propss.total)}</span>
                                }
                            ]}
                        />
                    }
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end mt-4">
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

function setState(arg0: (s: any) => any) {
    throw new Error('Function not implemented.')
}
