import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: { 
        personaID           : number, 
	    grupoID             : number,
	    esGrupal            : boolean,
	    productoID          : number,
        sucursalID          : number,
   	    usuarioRegistraID   : number,
        esBuro              : boolean,
        creditoID           : number,
        estatusValidacionID : number
    },
    options :{ value: number, label: string}[]
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any
}



export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                personaID:       Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
                usuarioRegistra: Yup.number().required("Seleccione el analista").moreThan(0, "Seleccione el analista"),
            
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar el analista" + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.Seguridad, { ...values, personaID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar el analista" + JSON.stringify(error))
                            setLoading(false)
                        })

            }}>
            <Form>
                
                <CustomFieldText disabled={loading} label="Analista" name="usuarioRegistra" placeholder="Analista" />
                <CustomSelect 
                    disabled={loading} 
                    label="Analista" 
                    name="personaID" 
                    placeholder="Seleccione un analista" 
                    options={props.options} 
                    addDefault={false}
                   
                    isMulti={false}
                />
            

                
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
