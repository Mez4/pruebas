import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { off } from 'process'
import { FaExchangeAlt } from 'react-icons/fa'

type CustomFieldType = {
    accion(): any,

}
const ButtonCambiarCajaSucursal = (props: CustomFieldType) => {
    return (
        <button
            style={{ position: 'absolute', right: '0px', top: '1.5%', zIndex: 9999 }}
            data-tip data-for="Button"
            type="button" className="ms-2 btn btn-success waves-effect waves-light"
            onClick={() => {
                props.accion()
            }}>


            Cambiar Caja &nbsp;  <FaExchangeAlt />


        </button>
    )
}
export default ButtonCambiarCajaSucursal