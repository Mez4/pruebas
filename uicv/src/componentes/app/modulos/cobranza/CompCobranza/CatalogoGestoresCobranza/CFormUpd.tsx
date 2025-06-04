import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import {Spinner, ActionSelect, CustomFieldText } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'
import prospecto from '../../../Prospeccion/CompProspeccion/Prospectos/prospecto'
import { TextArea } from 'usetheform'



type CFormType = {
    oidc :IOidc
    id?:number,
    // optProdMesa: { value: number, label: string }[],
    optPersonas: { value: number, label: string }[],
    initialValues: { PersonaID: number, NombreCompleto: string, MesaCobranzaID: number, mesaCobranza: string, Activo: boolean, MesaAnteriorId:number },
    cbGuardar(item: any): any,
    fnCancelar(): any,
    cbActualizar(item: any): any,
}

export const CFormUpd = (props: CFormType) => {
    const [mesaAnterior, setMesaAnterior] = useState(0)
    const [mesasCobranza, setMesaCobranza] = useState([])
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    useEffect(() => {
        mesaCobranza();
        FNGetMesa();
        setMesaAnterior(props.initialValues.MesaCobranzaID)
        console.log("Estos son los props",props.initialValues)
    }, [props.oidc, props.initialValues])


    
        const FNGetMesa = () => {
            Funciones.FNGetMesa(props.oidc)
                .then((respuesta: any) => {
                        console.log(respuesta)
                        var mesaCob = respuesta.map((valor:any) => {
                            var obj = {value:valor.MesaCobranzaID, label:valor.Nombre}
                            return obj;
                        });
                        setMesaCobranza(mesaCob);  
                    
                })
                .catch((error) => {
                    console.log("###e", error)        
                       
                    
                })
        }


        const mesaCobranza = () => {
            Funciones.FNGet(props.oidc).then((respuesta: any) => {
                var mesaCob = respuesta.map((valor:any) => {
                    var obj = {value:valor.MesaCobranzaID, label:valor.mesaCobranza}
                    return obj;
                });
                
                // console.log('Se logro', mesaCob);
            })
            .catch ((error:any) => {
                 console.log('Error');
            })
        }

    return(
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // Mesa: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
                // PersonaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
            })}

            onSubmit={(Values: any ) => {
                console.log("Si funciona", Values)
                            setLoading(true);
                            Funciones.FNUpd(props.oidc, Values )
                                .then((respuesta: any) => {
                                    setLoading(false)
                                    props.fnCancelar()
                                    props.cbGuardar(respuesta)
                                    props.cbActualizar(respuesta)
                                    toast.success(respuesta.msj)
                                })
                                .catch((error: any) => {
                                    
                                    if (error.response)
                                        toast.error(`Response: ${error.response.data}`)
                                    else if (error.request)
                                        toast.error(`Request ${error}`)
                                    else
                                        toast.error(`${error}`)
                                    setLoading(false)
                                
                        })  
                            .catch((error: any) => {
                                if (error.response)
                                    toast.error(`Response Error: ${error.response.data}`)
                                else if (error.request)
                                    toast.error(`Request ${error}`)
                                else
                                    toast.error(`${error}`)
                            })
                    }}>
            <Form>
                <div style={{   display:"flex", 
                                justifyContent:"space-evenly",

                            }}> 
                    {/* <CustomFieldText
                        disabled={true}
                        label="ID Mesa actual"
                        name="MesaAnteriorId"

                    /> */}
                    <CustomFieldText
                        disabled={true}
                        label="Gestor"
                        name="PersonaID"
                    />
                </div>
             
                <ActionSelect
                    disabled={false}
                    label="Mesa De Cobranza"
                    name="MesaCobranzaID"
                    placeholder="Seleccione el tipo"
                    options={mesasCobranza}
                    addDefault={true}
                    valor={mesasCobranza}
                    
                />
                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                {loading == true&& <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}