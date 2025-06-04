import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { Card, CustomFieldText, Spinner } from '../../../../../global'
import { FaClock, FaPlus, FaSearch } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    mostrar: boolean,
    fnCancelar(): any,
    ProspectoID: number,
    nombreP: string

}
export const CFormTiempos = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const DatosDefecto = {
        TipoDocumentoID: 0,
        NombreDocumento: '',
        Clave: '',
        Descripcion: '',
        DocumentoID: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0
    }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined

        }

    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetLogTiempos(props.oidc, props.ProspectoID, props.nombreP)
            .then((respuesta: any) => {

                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                if (error.response) 
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                props.fnCancelar()
                // console.log("###e", error)
                // if (isMounted.current === true) {
                //     setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'LogTiempoID',       
                    width:'10%'
                },
                {
                    name: 'Analista',
                    selector: 'NombreCompleto',
                    width:'30%',
                    cell: (props) =>
                        <span className="text-center">
                            {props.NombreCompleto}
                        </span>
                },
                {
                    name: 'Proceso',
                    selector: 'Descripcion',
                    width:'40%',
                    cell: (props) =>
                        <span className="text-center" style={{fontWeight:'bold'}}>
                            {props.Descripcion == 'DICTAMEN' ? 'VALIDACIÓN' : props.Descripcion == 'CONSOLIDACION' ? 'ACTIVACIÓN' : props.Descripcion } <span className={`${props.Validado ?'badge bg-success' : 'badge bg-primary'}`}>{props.Validado ? 'HECHO' : 'INCIO'}</span>
                        </span>
                },
                {
                    name: 'Fecha y Hora',
                    selector: 'tiempo',
                    width:'18%',
                    cell: (props) =>
                    <span className="divInDTable" style={{textAlign: 'start'}}>
                        <FaClock color='#D0D0D0'/> {props.tiempo}
                    </span>
                }


            ]
        return colRet
    }, [])

    // Use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        if (state.Cargando && props.Item) {
            FNGetLocal()
        }

        // eslint-disable-next-line
    }, [state.Datos, state.Filtro, state.Cargando, props])

    return (
        <ModalWin open={props.mostrar} xlarge >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                TIEMPOS <br />   
                PROSPECTO :&nbsp;{props.ProspectoID}&nbsp;{props.nombreP}
                </h5>
                <button type="button" className="delete" onClick={() => {
                   props.fnCancelar()
                }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    initialValues={{ Nota: '' }}
                    onSubmit={(values, actions) => {
                    }}>
                    <Form >
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <Card>

                                    <Card.Body>
                                        <Card.Body.Content>
                                            {state.Cargando && <Spinner />}
                                            {state.Error && <span>Error al cargar los datos...</span>}
                                            {!state.Cargando && !state.Error &&
                                                <div>
                                                    <DataTable
                                                        // subHeader
                                                        // subHeaderComponent=
                                                        // {
                                                        //     <div className="row">
                                                        //         <div className="col-sm-12">
                                                        //             <div className="input-group mb-3">
                                                        //                 <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        //                 <span className="input-group-text"><FaSearch /> </span>
                                                        //                 <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                        //             </div>
                                                        //         </div>
                                                        //     </div>
                                                        // }
                                                        data={state.DatosMostrar}
                                                        striped
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"LogTiempoID"}
                                                        defaultSortField={"LogTiempoID"}
                                                        defaultSortAsc={false}
                                                        columns={Columns}
                                                    />
                                                </div>
                                            }
                                        </Card.Body.Content>
                                    </Card.Body>
                                </Card>
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}
