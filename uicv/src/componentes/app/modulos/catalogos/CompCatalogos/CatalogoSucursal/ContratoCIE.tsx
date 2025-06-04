import React from 'react'

import * as Yup from 'yup'
import * as Funciones from './Funciones'

import { CustomFieldText2, Spinner } from '../../../../../global'
import { Formik, Form } from 'formik'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
// import { Productos, Sucursales } from '../../../../../selectores'

type ContratoCIEType = {
    oidc: IOidc
    // Id?: number,
    initialValues: { SucursalID: number, ProductoID: number, ContratoCIE: string, Producto: string, Sucursal: string },
    cbActualizar(item: any): any,
    // cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const ContratoCIE = (props: ContratoCIEType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ContratoCIE: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(50, "Maximo 50 caracteres")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                
                Funciones.FNUpdateContrato(props.oidc, { ...values })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                        toast.success("Se actualizó el contrato CIE")
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Error al actualizar el contrato CIE")
                    })

            }}>
            <Form>             
                {/* <Productos oidc={props.oidc} unaLinea disabled={loading} name={'ProductoID'} />   */}
                <CustomFieldText2 disabled label="Sucursal" datoType='text' name="Sucursal" placeholder="" />    
                <CustomFieldText2 disabled label="Producto" datoType='text' name="Producto" placeholder="" />    
                <CustomFieldText2 disabled={loading} label="Contrato CIE" datoType='text' name="ContratoCIE" placeholder="Contrato CIE" />    
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
