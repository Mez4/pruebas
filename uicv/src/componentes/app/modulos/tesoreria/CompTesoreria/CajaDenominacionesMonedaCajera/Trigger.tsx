import React from 'react'
// import Select from 'react-select'
import { ErrorMessage, Field } from 'formik'
import { FaArrowDown, FaHouseUser, FaPencilAlt } from 'react-icons/fa'
import Acordion from '../../../../../global/Accordion'

type CustomFieldType = {
    nombreCuenta: string,
    opera: string,
    numeroCuenta: string,

}

const Trigger = (props: CustomFieldType) => {


    // Renderear el componente
    return (
        <Acordion TabSelecionado="Economicos">
            <Acordion.Tab Identificador="Economicos" Titulo={<React.Fragment><FaHouseUser />&nbsp;{props.nombreCuenta}</React.Fragment>}>
                <>
                    <div className="text-start">
                        <table style={{ width: '100%', tableLayout: 'fixed' }}>


                        </table>
                    </div>

                </>
            </Acordion.Tab>
        </Acordion>

    )
}
export default Trigger
