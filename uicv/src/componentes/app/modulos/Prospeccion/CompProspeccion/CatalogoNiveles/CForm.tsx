import React from 'react'
import { Formik, Form , Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as FuncionesP from '../../CompProspeccion/CatalogoMesaCreditoIndex/FuncionesDictamen'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { string } from 'yup/lib/locale'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'

type CFormType = {
    oidc: IOidc
    Id?: number,
    NuevoNivel: boolean,  
    initialValues: { DistribuidorNivelID: number 
                    , DistribuidorNivel: string
                    , PorcComisionBase: number 
                    , CapitalColocadoMinimo: number 
                    , CapitalColocadoMaximo: number 
                    , ImporteProteccionSaldo: number 
                    , importeMaxCanje: number 
                    , maximoPrestamoPersonal: number 
                    , maximoImporteCanjeCliente: number 
                    , maximoImporteCanjeAval: number 
                    , Activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {

// Loading
const [loading, setLoading] = React.useState(false)

console.log(props.initialValues)

return (
    <Formik
    initialValues={props.initialValues}
    enableReinitialize
    validationSchema={Yup.object().shape({
      //  DistribuidorNivelID: Yup.string().required("Campo obligatorio"),
        DistribuidorNivel: Yup.string().required("Campo obligatorio"),
        PorcComisionBase: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),
        CapitalColocadoMinimo: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),//.moreThan(props.initialValues.CapitalColocadoMaximo,"El capital minimo no puede ser mayor o igual al capital maximo"),
        CapitalColocadoMaximo: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),//.lessThan(props.initialValues.CapitalColocadoMinimo,"El capital minimo no puede ser mayor o igual al capital maximo"),
        ImporteProteccionSaldo: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),
        importeMaxCanje: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),
        maximoPrestamoPersonal: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),
        maximoImporteCanjeCliente: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),
        maximoImporteCanjeAval: Yup.number().required("Campo obligatorio").positive("No se permiten valores negativos"),
        // Activo: Yup.number().required("Campo obligatorio")
        
    })}
    // validate={ (values:any) => {
    //     const errors = {};
    //     if (values.CapitalColocadoMinimo >= values.CapitalColocadoMaximo)
    //     {
    //         //toast.error("El capital minimo no puede ser mayor o igual al capital maximo")
    //     }  
    // }}
    onSubmit={(values: any, { resetForm }) => {
        console.log(`submit`)

        if (values.CapitalColocadoMinimo >= values.CapitalColocadoMaximo)
        {
            toast.error("El capital minimo no puede ser mayor o igual al capital maximo")
        }  
        else
        {
            // Set our form to a loading state
            setLoading(true)
            console.log(`values`, values)
            
              //Finish the callback
            if (props.NuevoNivel === true)
            {       console.log(`insert`)
                FuncionesP.FNAddNivel(props.oidc, values)
                .then((respuesta: any) => {
                    setLoading(false)
                    props.cbGuardar(respuesta)
                    toast.success("Tipo agregado correctamente")
                     resetForm()
                })
                .catch((error: any) => {
                    toast.error("Error al agregar tipo")
                     setLoading(false)
                })
            }

            else
            {      console.log(`update`)
                FuncionesP.FNUpdNivel(props.oidc, { ...values, DistribuidorNivelID: props.Id  })
                .then((respuesta: any) => {
                    setLoading(false)
                    props.cbActualizar(respuesta)
                    toast.success("Tipo actualizado correctamente")
                })
                .catch((error: any) => {
                    toast.error("Error al actualizar tipo")
                    setLoading(false)
                })
            }
        }
    }}

    >
        <Form>
        {/* <CustomFieldText disabled={true} label="id" name="DistribuidorNivelID" placeholder="id" /> */}
        <CustomFieldText disabled={loading} label="Nivel" name="DistribuidorNivel" placeholder="Nivel" />
        <CustomFieldText disabled={loading} label="Comision Base" name="PorcComisionBase" placeholder="Comision Base" />
        <CustomFieldText disabled={loading} label="Capital Minimo" name="CapitalColocadoMinimo" placeholder="Capital Minimo" />
        <CustomFieldText disabled={loading} label="Capital Maximo" name="CapitalColocadoMaximo" placeholder="Capital Maximo" />
        <CustomFieldText disabled={loading} label="Importe Proteccion" name="ImporteProteccionSaldo" placeholder="Importe Proteccion" />
        <CustomFieldText disabled={loading} label="Importe Max Canje" name="importeMaxCanje" placeholder="Importe Max Canje" />
        <CustomFieldText disabled={loading} label="Max Prestamo Personal" name="maximoPrestamoPersonal" placeholder="Max Prestamo Personal" />
        <CustomFieldText disabled={loading} label="Maxi Importe Canje Cliente" name="maximoImporteCanjeCliente" placeholder="Maxi Importe Canje Cliente" />
        <CustomFieldText disabled={loading} label="Max Importe Canje Aval" name="maximoImporteCanjeAval" placeholder="Max Importe Canje Aval" />
        <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
        {loading && <Spinner />}
        {!loading &&
            <div className="text-end">
                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar }>
                    Cancelar

            </button>
                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
            </div>
        }
        </Form>
    </Formik>

    )
}