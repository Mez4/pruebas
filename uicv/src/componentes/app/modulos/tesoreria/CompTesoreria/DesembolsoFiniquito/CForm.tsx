import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, ActionAsyncSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import Select from 'react-select'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Cuentas } from '../../../../../selectores'
// import ProgressBar from "../../../../../global/progress-bar.component"

// Icons
import { FaPrint, FaSearch } from 'react-icons/fa'

type CFormType = {
    oidc: IOidc
    initialValues: {
        SucursalID: number,
        SACId: number,
        CuentaBancoID: number,
        Todos: boolean
    },
    cbSolicitudes(item: any): any,
    fnGetEmpleados(SucursalID: any, Nombre: string, callback: any): any,
    // fnGetSolicitudes(SucursalID: number, SACId: number, CuentaBancoID: number, Todos: boolean): any,
    optSucursales: { value: number, label: string }[],
    optEmpleados: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = useState(false)

    const refSucursal = useRef<Select>(null)

    const loadOptionsEmpleados = (inputText: string, callback: any) => {
        const sucursal: any = refSucursal;
        const SucursalId = sucursal.current.props.value.value as number;
        props.fnGetEmpleados(SucursalId, inputText, callback);
    }

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // CuentaBancoID: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione la cuenta')
            })}
            onSubmit={(values: any) => {
                setLoading(true)

                Funciones.FNGet(props.oidc, values)
                    .then((respuesta: any) => {
                        props.cbSolicitudes(respuesta)

                        setLoading(false)
                    })
                    .catch((error: any) => {
                        console.log(error)
                        setLoading(false)
                        toast.error("Ocurrió un error al recuperar la información.")
                    })

            }}>
            {({ values }) => (
                <Form>
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-12-mobile is-12-tablet is-3-desktop">
                            <ActionSelect
                                disabled={loading}
                                label="Sucursal"
                                name="SucursalID"
                                placeholder="Seleccione la sucursal"
                                options={props.optSucursales}
                                addDefault={false}
                                valor={props.initialValues.SucursalID}
                                // accion={cbSucursal}
                                ref={refSucursal}
                            />
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-3-desktop">
                            <Cuentas
                                ProductoID={0}
                                SucursalId={values.SucursalID}
                                name={'CuentaBancoID'}
                                disabled={loading}
                                oidc={props.oidc}
                            />
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-3-desktop">
                            <ActionAsyncSelect
                                loadOptions={loadOptionsEmpleados}
                                disabled={loading}
                                label="Empleado"
                                name="SACId"
                                placeholder="Buscar empleado"
                                options={props.optEmpleados}
                                addDefault={false}
                                valor={props.initialValues.SACId}
                                // accion={cbEmpleado}
                                noOptionsMessage={'No encontrado'}
                            // ref={refCliente}
                            />
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-2-desktop">
                            <br />
                            <CustomFieldCheckbox disabled={loading} label="Desembolsado" name="Todos" />
                        </div>
                        <div className="column is-12-mobile is-12-tablet is-1-desktop">
                            <br />
                            {loading && <Spinner />}
                            {!loading &&
                                // <div className="text-end">
                                //     <div className="control">
                                <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light">
                                    <span className="is-hidden-touch"></span><FaSearch />
                                </button>
                                //     </div>
                                // </div>
                            }
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
