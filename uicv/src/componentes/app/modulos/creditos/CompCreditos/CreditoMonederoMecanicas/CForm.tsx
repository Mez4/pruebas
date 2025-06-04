import { Form, Formik } from 'formik';
import { CustomFieldDatePicker, CustomFieldText, CustomSelect } from '../../../../../global';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc';
import * as Funciones from './Funciones'
import { toast } from 'react-toastify';
import yup from '../../../../../../global/yupLocale';

type CFormType = {
    oidc: IOidc,
    loading: boolean,
    MecanicaID: number,
    isUpdate: boolean,
    initialValues: {
        Descripcion: string,
        DistribuidorNivelId: number,
        MontoBase: number,
        MontoRecompensa: number,
        FechaInicio: Date | null,
        FechaFin: Date | null
    },
    fnCerrarModal: () => void,
    fnActualizar: () => void
}

export default function CForm(props: CFormType) {
    return <Formik
        initialValues={props.isUpdate ? props.initialValues : {
            Descripcion: "",
            DistribuidorNivelId: 0,
            MontoBase: 0,
            MontoRecompensa: 0,
            FechaInicio: null,
            FechaFin: null
        }}
        enableReinitialize
        validationSchema={yup.object().shape({
            Descripcion: yup.string().required("Campo obligatorio"),
            FechaFin: yup.date().required("Ingrese la fecha de finalizacion"),
            FechaInicio: yup.date().required("Ingrese la fecha de inicio"),
            MontoBase: yup.number().moreThan(0, "Ingese el monto base"),
            MontoRecompensa: yup.number().moreThan(0, "Ingese el monto de recompensa para el ahorro"),
        })}
        onSubmit={(values: any) => {
            if (props.isUpdate) {
                Funciones.FNEditMecanicas(props.oidc, {
                    MecanicaID: props.MecanicaID,
                    Descripcion: values.Descripcion,
                    FechaFin: values.FechaFin,
                    FechaInicio: values.FechaInicio,
                    MontoBase: values.MontoBase,
                    MontoRecompensa: values.MontoRecompensa,
                }).then((respuesta: any) => {
                    props.fnCerrarModal()
                    props.fnActualizar()
                    if (respuesta.data.code == 204) {
                        toast.warning(respuesta.data.msg);
                        return;
                    }
                    toast.success("Se actualizo la mecanica de manera correcta");
                }).catch(() => {
                    toast.error("Ocurrio un error al actualizar la mecanica");
                });
                return;
            }

            Funciones.FNAddMecanicas(props.oidc, {
                Descripcion: values.Descripcion,
                FechaFin: values.FechaFin,
                FechaInicio: values.FechaInicio,
                MontoBase: values.MontoBase,
                MontoRecompensa: values.MontoRecompensa,
            }).then((respuesta: any) => {
                props.fnCerrarModal()
                props.fnActualizar()
                toast.success("Se agrego la mecanica de manera correcta");
            }).catch(() => {
                toast.error("Ocurrio un error al agregar la mecanica");
            });
        }}
    >
        <Form>
            <div className="columns is-desktop">
                <div className="column is-12-desktop">
                    <CustomFieldText
                        disabled={props.loading}
                        label="Descripción"
                        name="Descripcion"
                        placeholder="Agregar descripción"
                    />
                </div>
            </div>
            <div className="columns is-desktop">
                <div className="column is-6-desktop">
                    <CustomFieldText
                        disabled={props.loading}
                        label="Monto Base"
                        name="MontoBase"
                        placeholder="Agregar monto"
                    />
                </div>
                <div className="column is-6-desktop">
                    <CustomFieldText
                        disabled={props.loading}
                        label="Monto Recompensa para el ahorro"
                        name="MontoRecompensa"
                        placeholder="Agregar monto"
                    />
                </div>
            </div>
            <div className="columns is-desktop">
                <div className="column is-6-desktop">
                    <CustomFieldDatePicker
                        disabled={props.loading}
                        label='Fecha Inicio'
                        name='FechaInicio'
                        placeholder='Fecha de inicio de la mecanica'
                    />
                </div>
                <div className="column is-6-desktop">
                    <CustomFieldDatePicker
                        disabled={props.loading}
                        label='Fecha Fin'
                        name='FechaFin'
                        placeholder='Fecha de fin de la mecanica'
                    />
                </div>
            </div>
            <div className="text-end">
                <button
                    className='btn btn-danger mr-2'
                    type="button"
                    onClick={props.fnCerrarModal}
                >
                    Cancelar
                </button>
                <button
                    className='btn btn-success'
                    type="submit"
                >
                    {props.isUpdate ? 'Editar' : 'Agregar'}
                </button>
            </div>
        </Form>
    </Formik>

}