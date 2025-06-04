import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik'
import { ActionSelect, CustomFieldText } from '../../.../../global'
import { FNAddNotaRapida, FNGetTipoNotas } from './CompPerfilPersona/FuncionesNotasRapidas';
import { IOidc } from '../../../interfaces/oidc/IOidc';
import yup from '../../../global/yupLocale';
import { toast } from 'react-toastify';

type CFormNotasRapidasType = {
    oidc: IOidc,
    DistribuidorID: number,
    fnCerrarForm: () => void
}

export default function CFormNotasRapidas(props: CFormNotasRapidasType) {
    const [TipoNotasOptions, setTipoNotasOptions] = useState([] as { label: string, value: number }[])

    const fnGetTiposNotas = () => FNGetTipoNotas(props.oidc)
        .then((data: any) => {
            const tipoNotas: { label: string, value: number }[] = [];
            data.forEach(element => {
                tipoNotas.push({
                    value: element.TipoNotaID,
                    label: element.Descripcion
                })
            });

            setTipoNotasOptions(tipoNotas)
        })
        .catch(err => console.log("Hubo un error"))

    useEffect(() => {
        fnGetTiposNotas();
    }, [])

    return (
        <Formik
            initialValues={{
                Descripcion: "",
                TipoNotas: 0
            }}
            onSubmit={(values: any) => {
                FNAddNotaRapida(props.oidc, { DistribuidorID: props.DistribuidorID, Descripcion: values.Descripcion, TipoNotaID: values.TipoNotas })
                    .then(() => {
                        toast.success("Se guardo la nota correctamente")
                        props.fnCerrarForm();
                    })
                    .catch(() => toast.error("Hubo un error al guardar la nota"))
            }}
            validationSchema={yup.object().shape({
                TipoNotas: yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opcion'),
                Descripcion: yup.string().required("Campo obligatorio")
            })}
        >
            <Form>
                <CustomFieldText disabled={false} label='Descripción' name={'Descripcion'} placeholder='Descripción de la nota' />
                <ActionSelect placeholder='Seleccione una opción' addDefault={false} disabled={false} label='Tipo Notas' name={'TipoNotas'} options={TipoNotasOptions} />

                <div className="text-end">
                    <button type="submit" className="btn btn-success">Agregar nota</button>
                </div>
            </Form>
        </Formik>
    )
}