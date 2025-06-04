import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../interfaces/redux/IEstado'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { BiSearchAlt } from 'react-icons/bi'

import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

type CustomFieldType = {
    // Catalogos: ICatalogos,
    // Asentamientos(Id: number): any,
    oidc: IOidc,
    valor: number,
    fnOpen(): any,
    name?: string
    // label: string
}

const ControlAsentamientos = (props: CustomFieldType) => {

    const formikProps = useFormikContext()

    const [Asentamiento, setAsentamiento] = useState('')

    useEffect(() => {
        formikProps.setFieldValue(props.name ?? 'AsentamientoID', props.valor);

        if (props.valor > 0) {
            FNGetLocal()
            // props.Asentamientos(props.valor)
        }
        // else
        // {
        //     setAsentamiento('')
        // }  

        // eslint-disable-next-line
    }, [props.valor])

    // useEffect(() => {        
    //     if(props.Catalogos.Asentamientos.Datos){
    //         setAsentamiento(props.Catalogos.Asentamientos.Datos[0].Asentamiento)
    //     }
    //     else
    //     {
    //         setAsentamiento('')
    //     }  

    // }, [props.Catalogos.Asentamientos.Datos])


    const FNGetLocal = () => {
        axios.post(`${GetServerUrl()}Catalogos/Asentamiento/get`, { AsentamientoID: props.valor }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                setAsentamiento(`${respuesta.data.Tipo_asenta} ${respuesta.data.Asentamiento} C.P. ${respuesta.data.CodigoPostal} ${respuesta.data.Municipio}, ${respuesta.data.Estado}`)
            })
            .catch(() => {
                setAsentamiento('')
            })
    }


    return (
        <div className={"mb-2"}>
            <div className="input-group">
                <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={"Asentamiento"}>{"Asentamiento"}</label>
                <Field type="input" hidden className="form-control" name={props.name ?? 'AsentamientoID'} id={props.name ?? 'AsentamientoID'} />
                <input type="input" disabled className="form-control" name="Asentamiento" value={props.valor + (props.valor > 0 ? ` - ${Asentamiento}` : '')} />
                <button className="btn btn-outline-secondary" type="button" onClick={props.fnOpen}><BiSearchAlt size={22} /></button>
            </div>
            <ErrorMessage component="div" name={props.name ?? "AsentamientoID"} className="text-danger" />
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    // Catalogos: state.Catalogos
    oidc: state.oidc
})

const mapDispatchToProps = (dispatch: any) => ({
    // Asentamientos: (Id: number) => dispatch(tFunciones.Asentamientos({AsentamientoID: Id}))
})

export default connect(mapStateToProps, mapDispatchToProps)(ControlAsentamientos)