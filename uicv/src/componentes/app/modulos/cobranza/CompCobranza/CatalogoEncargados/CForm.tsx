import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    optEncargado: { value: number, label: string }[],
    initialValues: { DirectorMesaCobranzaID: number,PersonaID:number, NombreCompleto:string, Activo: boolean, UsuarioID:number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    fnCerrarCformConfirmar(): any,
}

export const CForm = (props: CFormType) => {

  // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)
    console.log(`Inicial values `)
    console.log(props.initialValues)
  // Return the component
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
                DirectorMesaCobranzaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
      })}
      onSubmit={(values: any) => {
        setLoading(true);
        // console.log(`Values`, values);

        if (props.Id === undefined)
          Funciones.FNAdd(props.oidc, values)
            .then((respuesta: any) => {
                        setLoading(false)
                        props.fnCancelar() //cierra la forma de CForm
                        props.fnCerrarCformConfirmar() // cierra la forma CformConfirmar
                        props.cbGuardar(respuesta)
                        toast.success(respuesta.msj)
            })
            .catch((error: any) => {
              if (error.response)
                toast.error(`Response: ${error.response.data}`);
              else if (error.request) toast.error(`Request ${error}`);
              else toast.error(`${error}`);
              setLoading(false);
            });
        else
          Funciones.FNUpdate(props.oidc, values)
            .then((respuesta: any) => {
              setLoading(false);
              props.fnCancelar();
              props.cbGuardar(respuesta);
              props.cbActualizar(respuesta);
              toast.success("Actualizado correctamente");
            })
            .catch((error: any) => {
              toast.error("Error al actualizar");
              setLoading(false);
            });
      }}
    >
      <Form>
        <ActionSelect
          disabled={false}
          label="Encargado"
          name="NombreCompleto"
          placeholder="Seleccione el tipo"
          options={props.optEncargado}
          addDefault={false}
          valor={props.initialValues.DirectorMesaCobranzaID}

        />

        <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
        {loading && <Spinner />}
        {!loading && (
          <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
              Cancelar
            </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
          </div>
        )}
      </Form>
    </Formik>
    )
}