import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        ProductoID: number,
        CreditoID: number,
        PersonaID: number,
        NombreCompleto: string,
        Coordinador: string,
        NoCreditosActivos: string,
        ValeCanje: number,
        FechaHoraRegistro: string,
        UsuarioIDRegistro: string,
        Capturo: string,
        Descripcion: string,
        Aval: string,
        TasaTipo: string,
        EstatusNombre: string,
        ImporteTotal: number,
        Abonos: number,
        SaldoActual: number,
        Capital: number, 
        Interes: number, 
        ManejoCuenta: number, 
        Seguro: number,  
        IVA: number,
        TipoDesembolsoID: number,
        CuentaID: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optTiposDesembolso: { value: number, label: string }[],
    optCuentas: { value: number, label: string }[],
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CuentaID: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione la cuenta')
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                // if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, {
                                ...values,
                                CreditoID: props.Id as number
                            })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se genero la entrega del crédito")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la entrega")
                        })
                // else
                //     Funciones.FNUpdate(props.oidc, {
                //         ...values,
                //         ComisionesID: props.Id as number
                //     })
                //         .then((respuesta: any) => {
                //             setLoading(false)
                //             props.cbActualizar(respuesta)
                //             toast.success("Se actualizó la comisión")
                //         })
                //         .catch((error: any) => {
                //             console.log(JSON.stringify(error))
                //             setLoading(false)
                //             toast.error("Error al actualizar la comisión")
                //         })

            }}>
            <Form>
               <div className="container">
                    <div className="row">
                        <div className="col-2">
                            <CustomFieldText disabled={true} label="N° Cliente" name="PersonaID" placeholder="" />
                        </div>
                        <div className="col-10">
                            <CustomFieldText disabled={true} label="Nombre Cliente" name="NombreCompleto" placeholder="" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <CustomFieldText disabled={true} label="Movimientos" name="NoCreditosActivos" placeholder="" />
                        </div>
                        <div className="col-6">
                            <CustomFieldText disabled={true} label="Crédito" name="CreditoID" placeholder="" />
                        </div>
                    </div>
                    <div className="row">  
                        <div className="col-6">
                            <CustomSelect
                                disabled={true}
                                label="Tipo Entrega"
                                name="TipoDesembolsoID"
                                placeholder="Seleccione la cuenta"
                                options={props.optTiposDesembolso}
                                addDefault={false}
                            />
                        </div>                      
                        <div className="col-6">
                            <CustomFieldText disabled={true} label="Importe" name="ImporteTotal" placeholder="" />
                        </div>
                    </div>
                    <CustomSelect
                        disabled={loading}
                        label="Cuenta Bancaria"
                        name="CuentaID"
                        placeholder="Seleccione la cuenta"
                        options={props.optCuentas}
                        addDefault={false}
                    />
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Entregar
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
