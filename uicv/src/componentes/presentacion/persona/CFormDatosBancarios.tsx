import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesBanco'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { /*personasDatosBancariosID:number*/personaID: number, datoTipoID: number, cveBancoRef: number, datoBancario: string,/*fechaRegistro:string,activo:boolean*/ },
    // initialValues2: { AclaracionID: number, descripcionAclaracion:string, estatus:string, MesaAclaracionID:number, AnalstaId: number, Asignada:boolean, SucursalID: number },
    cbActualizar(item: any): any
    optBancos: { value: number, label: string }[],
    optTipos: { value: number, label: string }[],
    optAclaraciones: { value: number, label: string }[],
    fnCancelar(): any
    cbGuardar(item: any): any
    listo?: any
}

export const CForm = (props: CFormType) => {
    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)
    // Return the component

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                datoBancario: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                cveBancoRef: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                datoTipoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                // CatalogoTipoDocumentoID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el tipo'),
                // Orden: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el tipo'),
            })}
            onSubmit={(values: any, { resetForm }) => {
                // Set our form to a loading state
                setLoading(true)
                //console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            // props.cbGuardar(respuesta)
                            props.cbActualizar(respuesta)
                            toast.success("Dato agregado correctamente")
                            props.listo = 1
                            resetForm()
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar Producto")
                            setLoading(false)
                        })
                // else
                // console.log('ELSE')
            }
            }>
            <Form>
                <ActionSelect
                    disabled={false}
                    label="Bancos"
                    name="cveBancoRef"
                    placeholder="Seleccione un Banco"
                    options={props.optBancos}
                    addDefault={false}
                    valor={props.initialValues.cveBancoRef} />
                <ActionSelect
                    disabled={false}
                    label="Tipo"
                    name="datoTipoID"
                    placeholder="Seleccione el Tipo"
                    options={props.optTipos}
                    addDefault={false}
                    valor={props.initialValues.datoTipoID} />
                {/* <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" /> */}
                <CustomFieldText disabled={loading} label="Dato Bancario" name="datoBancario" placeholder="Dato Bancario" />
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}