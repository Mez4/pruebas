import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'
// import * as Funciones from './Funciones'
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import yup from "../../../../../../global/yupLocale";
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'

type CFormType = {
  oidc: IOidc
  Id?: number,
  optProdMesa: { value: number, label: string }[],
    optPersonas: { value: number, label: string }[],
  initialValues: {PersonaID: number, NombreCompleto: string, MesaCobranzaID: number, mesaCobranza: string, Activo: boolean },
  fnCancelar():any,
};



export const CForm = (props: CFormType) => {

      // Loading
      const [loading, setLoading] = React.useState(false)
      const [isMounted, setisMounted] = React.useState(false)
  

    // const [state, setState] = React.useState({
    //     Form:{
    //         Mostrar: false,
           
    //         Id:undefined
    //     }
    // })

    // const FnCancelar = () => {
    //     props.fnCancelar()
    //     setState({...state,Form:{Mostrar: false, Id: undefined }})
     
    // }

  return <>

    <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={yup.object().shape({})}
        
        onSubmit={() => {}}>

        <Form>
            {/* <div className={"row"}>
                <div className={"col-sm-12 col-md-6"}>
                    <div style={{ backgroundColor: '#ebefea', padding: '2em' }}>
                        <div className="col text-center">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={() => {props.fnCancelar}}>
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
            <ActionSelect
          disabled={false}
          label="Analista Cobranza"
          name="PersonaID"
          placeholder="Seleccione el tipo"
          options={props.optPersonas}
          addDefault={false}
          valor={props.initialValues.PersonaID}

        />
        <ActionSelect
          disabled={false}
          label="Mesa De Cobranza"
          name="MesaCobranzaID"
          placeholder="Seleccione el tipo"
          options={props.optProdMesa}
          addDefault={true}
          valor={props.initialValues.MesaCobranzaID}
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
  </>;
};
