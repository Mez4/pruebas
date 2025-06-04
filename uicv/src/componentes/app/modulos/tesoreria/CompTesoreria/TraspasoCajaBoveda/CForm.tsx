import { DBConfia_Distribuidores } from '../../../../../../interfaces_db/DBConfia/Distribuidores'
import { ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React from 'react'
import * as Funciones from './Funciones'

interface ITraspasoData {
    BovedaID: number,
    CajaID: number,
    Accion: number,
    Observaciones: string,
    Importe: number,
}

export const CForm = ({ state, initialValues, ...props }) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={{
                CajaID: 0,
                BovedaID: 0,
                Observaciones: '',
                Importe: 0,
            }}
            enableReinitialize
            validationSchema={
                Yup.object().shape({
                    Observaciones: Yup.string().required(),
                    Importe: Yup.number().required(),
                })}
            onSubmit={(values: any) => {
                let resData: ITraspasoData
                console.log(initialValues.ValorOrigen, initialValues);
                if (initialValues.TipoTraspaso == 1) {
                    resData = {
                        BovedaID: initialValues.ValorOrigen,
                        CajaID: values.CajaID,
                        Accion: initialValues.TipoTraspaso,
                        Observaciones: values.Observaciones,
                        Importe: parseInt(values.Importe),
                    }
                    console.log('test1', resData);
                    if (resData.CajaID == 0) {
                        toast.error("Favor de seleccionar una caja")
                        return
                    }
                } else {
                    resData = {
                        CajaID: initialValues.ValorOrigen,
                        BovedaID: values.BovedaID,
                        Accion: initialValues.TipoTraspaso,
                        Observaciones: values.Observaciones,
                        Importe: parseInt(values.Importe),
                    }
                    console.log('test12', resData);
                    if (resData.BovedaID == 0) {
                        toast.error("Favor de seleccionar una boveda")
                        return
                    }
                }

                Funciones.FnTraspasarValores(props.oidc, resData)
                    .then((respuesta: any) => {
                        setLoading(false)
                        if (respuesta.resultCode == 1) {
                            props.dgGuardar(respuesta)
                            toast.success(respuesta.message)
                            return;
                        }
                        toast.error(respuesta.message)
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Ha ocurrido un error al realizar el traspaso")
                    })

            }}>
            {({ values }) => (
                <Form>
                    {state.TipoTraspaso == 1 && < ActionSelect
                        disabled={false}
                        label="Caja"
                        name="CajaID"
                        placeholder={'Seleccione una caja'}
                        options={state.Cajas}
                        addDefault={false}
                        valor={values.CajaID}
                    />}
                    {state.TipoTraspaso == 2 && <ActionSelect
                        disabled={false}
                        label="Boveda"
                        name="BovedaID"
                        placeholder={'Seleccione una boveda'}
                        options={state.Bovedas}
                        addDefault={false}
                        valor={values.BovedaID}
                    />}

                    <CustomFieldText
                        disabled={loading}
                        label="Importe"
                        name="Importe"
                        placeholder="Importe a trasladar" />
                    <CustomFieldText
                        disabled={loading}
                        label="Motivo de traspaso"
                        name="Observaciones"
                        placeholder="Ingrese Motivo del traspaso" />

                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Aceptar
                            </button>
                        </div>
                    }
                </Form>

            )}
        </Formik>
    )
}
