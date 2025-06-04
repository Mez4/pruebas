import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, Card } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import { CForm } from '../CatalogoEncargados/CForm'

// import { AgregarConPersona } from '../../../Prospeccion/CompProspeccion/AgregarConPersona'

import { AgregarConPersonaEncargado } from '../CatalogoEncargados/AgregarConPersonaEncargado'

type CFormType = {
    oidc: IOidc,
    Id?: number,
    initialValues: { DirectorMesaCobranzaID: number,PersonaID:number, NombreCompleto:string, Activo: boolean, UsuarioID:number },
    cbGuardar(item: any): any,
    fnCancelar(): any,
    cbActualizar(item: any): any,
    FNGetLocal(): any,
    optEncargado: { value: number, label: string }[],
    fnCFormConfirmar(): any,
    // optPersonas: { value: number, label: string }[],  
}

export const CFormConfirmar = (props: CFormType) => {

    //const DatosDefecto = { /*GestorCobranzaID: 0,*/ PersonaID: 0, MesaCobranzaID: 0, Activo: true }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProdMesa: any[] = []
    const optPersonas: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optProdMesa,
        optPersonas,
        Filtro: '',
        Cargando: true,
        Error: false,
        Mostrar: false,
        AgregarConPersonaEncargado: false,
        Form:
        {
            Mostrar: false,
            // Datos: DatosDefecto,
            Id: undefined
        }
    })

    const fnCancelar = () => {
        props.fnCFormConfirmar()// Abre la forma CFormConfirmar
        setState({ ...state, Form: { ...state.Form, Mostrar: false }, AgregarConPersonaEncargado: false }) //Cierra la forma de CForm
    }

    const FnAbrirCForm = () => {
        props.fnCancelar()// Cierra la forma de CFormConfirmar
        setState({ ...state, Form: { Mostrar: true, Id: undefined } })
    }

    const FnAbrirFormaAgregar = () => {
        props.fnCancelar() // Cierra la forma de CFormConfirmar
        setState(s => ({ ...s, AgregarConPersonaEncargado: true, Item: undefined }))
    }

    return (

        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({})}

            onSubmit={() => { }}>

            <Form>

                {/* {state.Cargando && <Spinner />} */}
                {state.Error && <span>Error al cargar los datos...</span>}
                {/* {!state.Cargando && !state.Error && */}

                <div className={"row"}>

                    <div className={"col-sm-12 col-md-6"}>

                        <div style={{ backgroundColor: '#ebefea', padding: '2em' }}>
                            <div className="col text-center">
                                <button type="button" className="btn btn-info" onClick={() => { FnAbrirCForm() }} >Agregar Encargado Interno</button>
                            </div>
                        </div>
                    </div>

                    <div className={"col-sm-12 col-md-6"}>
                        <div style={{ backgroundColor: '#ebefea', padding: '2em' }}>
                            <div className="col text-center">
                                <button type="button" className="btn btn-success" onClick={() => { FnAbrirFormaAgregar() }} >Agregar Encargado Externo</button>
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <div className="d-flex justify-content-end" >
                    <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                        Cancelar
                    </button>
                </div>

                <ModalWin open={state.Form.Mostrar} center>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}> Agregar Encargado</h5>
                        {/* <button type="button" className="delete" onClick={fnCancelar}></button> */}
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CForm
                            oidc={props.oidc}
                            initialValues={props.initialValues}
                            Id={state.Form.Id}
                            optEncargado={props.optEncargado}
                            cbGuardar={props.cbGuardar}
                            fnCancelar={fnCancelar}
                            cbActualizar={props.cbActualizar}
                            fnCerrarCformConfirmar={props.fnCancelar}
                        />}

                        {<AgregarConPersonaEncargado
                            oidc={props.oidc}
                            Id={state.Form.Id}
                            cbGuardar={props.cbGuardar}
                            optProdMesa={props.optEncargado}
                            fnCancelar={fnCancelar}
                            mostrar={state.AgregarConPersonaEncargado}
                            FNGetLocal={props.FNGetLocal}
                        />}

                    </ModalWin.Body>
                </ModalWin>
            </Form>
        </Formik>
    )
}