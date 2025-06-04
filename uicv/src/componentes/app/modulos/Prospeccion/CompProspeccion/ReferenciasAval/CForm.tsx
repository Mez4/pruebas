import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomFieldText2, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Parentesco } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    AvalID?: number,
    initialValues: { ReferenciaID: number, PersonaID: number, TipoPersonaID: number, numeroReferencia: number, nombre: string, primerApellido: string, segundoApellido: string, parentesco: string, celular: string, domicilio: string, edad: number, Activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
    Editar: boolean
}

export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [parentezco, setParentezco] = React.useState(props.initialValues.parentesco)

    const ParentezcoSelected = (val: string) => {
        //setTrabajaDisplay(val === 'true'? 'block' : 'none')
        setParentezco(val)
    }

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                nombre: Yup.string().required().min(2),
                primerApellido: Yup.string().required().min(2),
                segundoApellido: Yup.string().required().min(2),
                parentesco: Yup.string().required().min(2),
                celular: Yup.string().required().min(10).max(10),
                domicilio: Yup.string().required().min(10, 'Captura la direccion completa'),
                edad: Yup.number().typeError('Ingrese un numero').required().min(18, 'Debe ser mayor de edad'),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                //Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, { ...values, TipoPersonaID: 3, PersonaID: props.AvalID })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Agregado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, ReferenciaID: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar")
                            setLoading(false)
                        })

            }}>
            <Form>
                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Nombre y Relación</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-12"}>
                            <CustomFieldText2 disabled={loading === props.Editar} label={'Nombre(s)'} datoType='text' name={`nombre`} placeholder={'Nombre(s)'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={loading === props.Editar} label={'Primer Apellido'} datoType='text' name={`primerApellido`} placeholder={'Primer Apellido'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={loading === props.Editar} label={'Segundo Apellido'} datoType='text' name={`segundoApellido`} placeholder={'Segundo Apellido'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-12"}>
                            <Parentesco disabled={loading === props.Editar} label={'Parentesco'} name={`parentesco`} accion={ParentezcoSelected} valor={parentezco} />
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Datos y Contacto</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={loading === props.Editar} label={'Edad'} datoType='text' name={`edad`} placeholder={'Edad'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 disabled={loading === props.Editar} label={'Teléfono'} datoType='text' name={`celular`} placeholder={'Teléfono fijo o celular'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-12"}>
                            <CustomFieldText2 disabled={loading === props.Editar} label={'Domicilio'} datoType='text' name={`domicilio`} placeholder={'Domicilio COMPLETO'} />
                        </div>
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        {props.Editar && <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>}
                    </div>
                }
            </Form>
        </Formik>
    )
}