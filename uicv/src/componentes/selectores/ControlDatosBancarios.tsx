import React, { useEffect } from 'react'
import { connect } from 'react-redux'
// import { ICatalogos } from '../../interfaces/catalogos/ICatalogos'
import { IEstado } from '../../interfaces/redux/IEstado'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { BiSearchAlt } from 'react-icons/bi'
import { GetServerUrl } from '../../global/variables'
import axios from 'axios'

// import * as tFunciones from '../../redux/catalogos/functionesThunk'

// import { GetServerUrl } from '../../global/variables'
// import axios from 'axios'

type CustomFieldType = {
    // Catalogos: ICatalogos,
    // Asentamientos(Id: number): any,
    ClienteId: number,
    oidc: IOidc,
    valor: number,
    RequiereDatosBancarios: boolean,
    fnOpen(): any,
    name?: string,
    label?: string,
}

const ControlDatosBancarios = (props: CustomFieldType) => {

    // console.log('RequiereDatosBancarios', props.RequiereDatosBancarios)

    const formikProps = useFormikContext()

    // const [datoBancario, setDatoBancario] = useState('')

    useEffect(() => {

        formikProps.setFieldValue('RequiereDatosBancarios', props.RequiereDatosBancarios);

        // eslint-disable-next-line
    }, [props.RequiereDatosBancarios])

    useEffect(() => {

        if (props.valor > 0) {

            formikProps.setFieldValue(props.name ?? 'personasDatosBancariosID', props.valor);

            let Id = props.valor

            console.log('Id: ', Id)

            axios.get(`${GetServerUrl()}General/PersonaDatosBancarios/getById/${Id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.oidc.user.access_token}`
                }
            })
                .then(respuesta => {
                    console.log('res getById: ', respuesta)
                    formikProps.setFieldValue('datoBancario', respuesta.data.datoBancario);
                })
                .catch(error => {
                    formikProps.setFieldValue('datoBancario', '');
                })

            // if(props.valor > 0)
            // {
            //     FNGetLocal()
            // }
        }
        // eslint-disable-next-line
    }, [props.valor])

    // const FNGetLocal = () => {        
    //     axios.post(`${GetServerUrl()}General/PersonaDatosBancarios/get`, {personaID: props.valor}, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${props.oidc.user.access_token}`
    //         }
    //     })
    //     .then(respuesta => {
    //         setDatoBancario(respuesta.data.datoBancario)
    //     })
    //     .catch(() => {
    //         setDatoBancario('')
    //     })       
    // }

    return (
        <div className={"mb-2"}>
            <div className="input-group">
                {props.RequiereDatosBancarios && <label className="input-group-text" style={{ minWidth: "130px", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={"datoBancario"}>{props.label ? props.label : "Cuenta Cliente"}</label>}
                <Field type={props.RequiereDatosBancarios ? "input" : 'hidden'} disabled className="form-control" name={'datoBancario'} id={'datoBancario'} />
                <Field type="hidden" className="form-control" name={'RequiereDatosBancarios'} id={'RequiereDatosBancarios'} />
                <Field type="hidden" className="form-control" name={props.name ?? 'personasDatosBancariosID'} id={props.name ?? 'personasDatosBancariosID'} />
                {props.RequiereDatosBancarios &&
                    <button className="btn btn-outline-secondary" type="button" disabled={props.ClienteId === 0} onClick={props.fnOpen}><BiSearchAlt size={22} /></button>
                }
            </div>
            <ErrorMessage component="div" name={props.name ?? "personasDatosBancariosID"} className="text-danger" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ControlDatosBancarios)