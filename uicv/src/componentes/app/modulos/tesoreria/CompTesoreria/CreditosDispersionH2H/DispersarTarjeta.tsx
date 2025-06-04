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


}


export const DispersarTarjeta = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const [card, setCard] = useState();
    const inputCard = useRef(null);
    console.log(props.ClienteID)
    const handleChange = () => {
        // @ts-ignore: Object is possibly 'null'.
        const cardValue = inputCard.current.value
            .replace(/\D/g, '')
            .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
        // @ts-ignore: Object is possibly 'null'.
        inputCard.current.value = !cardValue[2]
            ? cardValue[1]
            : `${cardValue[1]}-${cardValue[2]}${`${cardValue[3] ? `-${cardValue[3]}` : ''
            }`}${`${cardValue[4] ? `-${cardValue[4]}` : ''}`}`;
        // @ts-ignore: Object is possibly 'null'.
        const numbers = inputCard.current.value.replace(/(\D)/g, '');
        setCard(numbers);
    };


    useEffect(() => {
        handleChange();
    }, [card]);
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                descripcion: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),

            })}
            onSubmit={(values: any) => {
                setLoading(true)
            }}
        >
            <Form>
                <div>

                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Ingresar nueva tarjeta" ref={inputCard} onChange={handleChange} />
                        <span className="input-group-text"><FaCreditCard /> </span>
                    </div>

                    {props.CargandoModaL && <div>
                        sdsdsds


                    </div>}

                    {!props.CargandoModaL && <Spinner />}


                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" >
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>


            </Form>

        </Formik >
    )
}