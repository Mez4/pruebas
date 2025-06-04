import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner} from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { empresaNombre: string, empresaRfc: string, empresaDireccionFiscal: string, empresaRegistroPatronal: string, empresaRazonSocial: string, EsPrestaStar: boolean, TipoEmpresaID: string },
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
                empresaNombre: Yup.string().required("Campo obligatorio").min(1, "Mínimo 1 caracter"),
                empresaRfc: Yup.string().required("Campo obligatorio").min(10,"Mínimo 12 caracteres").max(15,"Máximo 12 caracteres"),
                empresaDireccionFiscal: Yup.string().required("Campo obligatorio"),
                empresaRegistroPatronal: Yup.string().required("Campo obligatorio"),
                empresaRazonSocial: Yup.string().required("Campo obligatorio")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la empresa")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la empresa")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, empresaId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la empresa")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la empresa")
                        })

            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Nombre" name="empresaNombre" placeholder="Nombre Empresa" />
                <CustomFieldText disabled={loading} label="RFC" name="empresaRfc" placeholder="RFC" />
                <CustomFieldText disabled={loading} label="Direccion Fiscal" name="empresaDireccionFiscal" placeholder="Direccion Fiscal" />
                <CustomFieldText disabled={loading} label="Registro Patronal" name="empresaRegistroPatronal" placeholder="Registro Patronal" />
                <CustomFieldText disabled={loading} label="Razón Social" name="empresaRazonSocial" placeholder="Razón Social" />
                <CustomFieldCheckbox disabled={loading} label="PrestaStar" name="EsPrestaStar" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Ok  
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
