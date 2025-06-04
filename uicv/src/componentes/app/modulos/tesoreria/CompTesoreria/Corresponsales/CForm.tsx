import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        CorresponsalID: number,
        Nombre: string,
        TipoConciliacion: string,
        TipoComisionID: number,
        MontoFijo: number,
        MontoCorte: number,
        Activo: boolean
    },
    options: {
        label: string,
        value: number
    }[],
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}


export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Nombre: Yup.string().required("Campo obligatorio"),
                TipoConciliacion: Yup.string().required("Campo obligatorio"),
                MontoFijo: Yup.string().required("Campo obligatorio"),
                MontoCorte: Yup.string().required("Campo obligatorio"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                // Finish the callback
                if ( !!props.Id ) {
                    Funciones.FNActualizarCorresponsales(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false);
                            props.cbActualizar(respuesta);
                        })
                        .catch((error: any) => {
                            setLoading(false);
                            toast.error('Error al actualizar el corresponsal');
                        })
                } else {
                    Funciones.FNAgregarCorresponsales(props.Seguridad, values
                        ).then((respuesta: any) => {
                            setLoading(false);
                            props.cbGuardar(respuesta);
                        })
                        .catch((error: any) => {
                            setLoading(false);
                            toast.error('Error al agregar el corresponsal');
                        })
                }
            }}
        >
            <Form>
                <div>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                            <CustomFieldText
                                disabled={false}// props.Id=== undefined? false : true
                                label="Nombre:"
                                name="Nombre"
                                placeholder="Agregar Nombre"
                            />
                        </div>
                        <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                            <CustomFieldText
                                disabled={false}// props.Id=== undefined? false : true
                                label="Tipo conciliacion:"
                                name="TipoConciliacion"
                                placeholder="Agregar Tipo de conciliacion"
                            />
                        </div>
                        <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                            <CustomSelect name='TipoComisionID'  disabled={loading} addDefault={true} label='Tipo comision' options={props.options} />
                        </div>
                        <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                            <CustomFieldText
                                disabled={false}// props.Id=== undefined? false : true
                                label="Monto fijo $:"
                                name="MontoFijo"
                                placeholder="Agregar Monto fijo"
                            />
                        </div>
                        <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile">
                            <CustomFieldText
                                disabled={false}// props.Id=== undefined? false : true
                                label="Monto corte $:"
                                name="MontoCorte"
                                placeholder="Monto corte"
                            />
                        </div>

                    </div>

                    <div className="">
                        <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                    </div>

                    {loading && <Spinner />}
                    {!loading &&
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