import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'
import { number } from '../../../../../../global/idiomaValidacion.bak'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { idRelMesaCredProd: number, ProductoID: number, Producto: string, DirectorMesaCobranzaID: number, NombreDirector: string, idTabMora: number, MesaCobranzaID: number, limInferiorDias: number, limSuperiorDias: number, Activo: boolean, verifDom: boolean, Monitoreo: boolean, Cobranza: boolean, Coordinador: boolean, Legal: boolean },
     //initialValues: { idRelMesaCredProd: number, ProductoID: number, Producto: string, DirectorMesaCobranzaID: number, NombreDirector: string, idTabMora: number, MesaCobranzaID: number, MesaCobranzaDesc: string, Clave: string, limInferiorDias: number, limSuperiorDias: number, Activo: boolean, verifDom: boolean, Monitoreo: boolean, Cobranza: boolean, Coordinador: boolean, Legal: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    // optMesa: { value: number, label: string, Clave :string }[],
    optMesa: { value: number, label: string}[],
    optTabMora: { value: number, label: string }[],
    optPersonas: { value: number, label: string }[]
    identificador: number
}

export const CForm = (props: CFormType) => {
    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                idTabMora: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opcion'),
                MesaCobranzaID: Yup.string().required("Campo obligatorio"),
                // Clave: Yup.string().required("Campo obligatorio"),
            })}

            onSubmit={(values: any) => {
                console.log(`SUBMIT`)
                console.log(props.identificador)
                setLoading(true)
                if (props.identificador === 2)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success(respuesta.msj)
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })

                else
                    Funciones.FNUpdate(props.oidc, { ...values, idRelMesaCredProd: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success(respuesta.msj)
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })
                        console.log(`end`)
            }}>
            <Form>

                {/* {props.identificador == 2 && <CustomFieldText disabled={loading} label="MesaCobranzaDesc" name="MesaCobranzaDesc" placeholder="MesaCobranzaDesc" />} */}

                {props.identificador == 2 && <ActionSelect
                    disabled={false}
                    label="Mesa Cobranza"
                    name="MesaCobranzaID"
                    placeholder="Seleccione una Opcion"
                    options={props.optMesa}
                    addDefault={true}
                    valor={props.initialValues.MesaCobranzaID}
                    />}

                {/* {props.identificador == 2 && <CustomFieldText disabled={false} label="Clave" name="Clave" placeholder="Clave"    />} */}

                {/* {props.identificador == 2 && <ActionSelect
                    disabled={false}
                    label="Clave"
                    name="MesaCobranzaClave"
                    placeholder="Clave"
                    options={props.optMesa}
                    addDefault={true}
                    valor={props.initialValues.Clave}
                    />} */}


                {props.identificador == 2 && <ActionSelect
                    disabled={false}
                    label="idTabMora"
                    name="idTabMora"
                    placeholder="Seleccione una Opcion"
                    options={props.optTabMora}
                    addDefault={true}
                    valor={props.initialValues.idTabMora}
                />}

                <ActionSelect
                    disabled={false}
                    label="Encargado"
                    name="DirectorMesaCobranzaID"
                    placeholder="Seleccione una Opcion"
                    options={props.optPersonas}
                    addDefault={true}
                    valor={props.initialValues.DirectorMesaCobranzaID}
                />

                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />

                <CustomFieldCheckbox disabled={loading} label="verifDom" name="verifDom" />

                <CustomFieldCheckbox disabled={loading} label="Monitoreo" name="Monitoreo" />

                <CustomFieldCheckbox disabled={loading} label="Cobranza" name="Cobranza" />

                <CustomFieldCheckbox disabled={loading} label="Coordinador" name="Coordinador" />

                <CustomFieldCheckbox disabled={loading} label="Legal" name="Legal" />


                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}