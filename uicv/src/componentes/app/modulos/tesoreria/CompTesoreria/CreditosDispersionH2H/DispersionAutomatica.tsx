import React, { useState, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaCreditCard, FaSearch } from 'react-icons/fa'

type CFormType = {
    Seguridad: IOidc,

    ClienteID?: number,
    CargandoModaL: boolean,
    initialValues: {

    },
    fnCancelar(): any,
    fnMostrarAuto(): any
    fnActivar(): any
    Activar: boolean

}


export const DispersarAutomatica = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const [card, setCard] = useState();
    const inputCard = useRef(null);
    console.log("ACTIVAR", props.Activar)

    const [state, setState] = React.useState({
        Activar: false
    })

    useEffect(() => {

    }, [card]);
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                varValue: Yup.number().moreThan(0, 'No permite letras ni valores negativos'),

            })}
            onSubmit={(values: any) => {
                setLoading(true)
                let a = {
                    varValue: values.varValue,
                }
                Funciones.FNUpdate(props.Seguridad, a)
                    .then((respuesta: any) => {
                        props.fnCancelar()
                        toast.success("TIEMPO DE DISPERSION AGREGADO CON EXITO")
                        setLoading(false)
                    })
                    .catch(() => {
                        toast.error("Error al modificar tiempo")
                        setLoading(false)
                    })

            }}
        >
            <Form>
                <div>
                    {<div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                        <br />
                        <label className="form-check-label" >Activar Dispersion Automatica</label>
                        <input
                            className='form-check-input text-center'
                            type="checkbox"
                            //style={{ marginTop: '0.7em' }}
                            checked={state.Activar}
                            onChange={e => (setState({ ...state, Activar: e.target.checked }))}
                        />
                    </div>}
                    <div className="column is-full-desktop is-full-tablet is-full-mobile">
                        <CustomFieldText
                            disabled={!state.Activar}
                            label="Minutos para Dispersion Automatica"
                            name="varValue"
                            placeholder="Escribir minutos para dispersion"
                        />

                    </div>

                    {/*      {props.CargandoModaL && <div>

                    </div>} */}
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => {
                                props.fnCancelar();
                            }}>
                                CANCELAR
                            </button>
                            <button type="submit" disabled={!state.Activar} className="ms-2 btn btn-success waves-effect waves-light">
                                ACEPTAR
                            </button>
                        </div>
                    }
                </div>


            </Form>

        </Formik >
    )
}