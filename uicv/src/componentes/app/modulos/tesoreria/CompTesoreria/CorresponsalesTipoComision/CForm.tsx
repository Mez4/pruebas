import {useState} from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    initialValues: {
        
        TipoComisionID: number,
        TipoComision: string,
        TipoPorcentaje: boolean,
        TipoMontoFijo: boolean,
        TipoMontoCorte: boolean
    },
    cbActualizar(item: any): any,
    cbGuardar(item:any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                TipoComision: Yup.string().required("Campo obligatorio")
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                // Finish the callback
                console.log("id", props.initialValues.TipoComisionID)

                if ( !!props.initialValues.TipoComisionID ) {
                    Funciones.FNActualizarCorresponsalesTipo(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false);
                            props.cbActualizar(respuesta);
                        })
                        .catch((error: any) => {
                            setLoading(false);
                            toast.error('Error al actualizar los tipo de comision');
                        });
                } else {
                    Funciones.FNAgregarCorresponsalesTipo(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false);
                            props.cbGuardar(respuesta);
                        })
                        .catch((error: any) => {
                            setLoading(false);
                            toast.error('Error al actualizar los tipo de comision');
                        });
                }
            }}
        >
            <Form>
                <CustomFieldText
                    disabled={loading}// props.Id=== undefined? false : true
                    label="Tipo de comision:"
                    name="TipoComision"
                    placeholder="Agregar Tipo de comision"
                />
                <CustomFieldCheckbox disabled={loading} label="Tipo Porcentaje" name="TipoPorcentaje" />
                <CustomFieldCheckbox disabled={loading} label="Tipo monto fijo" name="TipoMontoFijo" />
                <CustomFieldCheckbox disabled={loading} label="Tipo monto corte" name="TipoMontoCorte" />
                    
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
            </Form>
        </Formik>
    )
}