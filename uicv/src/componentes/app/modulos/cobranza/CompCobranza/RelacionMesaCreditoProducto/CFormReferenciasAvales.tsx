import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { Formik, Form } from 'formik'

import * as Funciones from '../RelacionMesaCreditoProducto/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../../global/functions'
import { CFormInfoReferenciasAvales } from '../RelacionMesaCreditoProducto/CFormInfoReferenciasAvales'
import { Console } from 'console'
import { date } from '../../../../../../global/idiomaValidacion.bak'

type CatalogosType = {
    oidc: IOidc
    Id?: number,
    //initialValues: { DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    DistribuidorID: number
    //optGestor: { value: number, label: string }[]
    //Prueba: number
}

export const CFormReferenciasAvales = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { DistribuidorID: 0, PersonaID: 0, NombreCompleto: '', FechaNacimiento: '', Sexo: '', CURP: '', EstadoCivil: '', TelefonoMovil: '', CorreoElectronico: '', LugarNacimiento: '', TelefonoDomicilio: '', RFC: '', DireccionID: 0, NombreVialidad: '', CreacionFecha: '', NombreConyuge: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetReferenciasAvales(props.oidc, props.DistribuidorID)
            .then((respuesta: any) => {
                console.log(respuesta, 'ABC')
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'PersonaID',
                    selector: 'PersonaID',
                    sortable: true,
                },
                {
                    name: 'NombreCompleto',
                    selector: 'NombreCompleto',
                    sortable: true,
                },


                {
                    name: 'Accion',
                    // selector: 'NombreCompleto',
                    sortable: true,
                    width: '25%',
                    cell: (props) =>
                        <><button data-tip data-for={`btnVD_${props.AvalID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-outline-primary" type={"button"}
                            onClick={() => {

                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: { DistribuidorID: props.DistribuidorID, PersonaID: props.PersonaID, NombreCompleto: props.NombreCompleto, FechaNacimiento: props.FechaNacimiento, Sexo: props.Sexo, CURP: props.CURP, EstadoCivil: props.EstadoCivil, TelefonoMovil: props.TelefonoMovil, CorreoElectronico: props.CorreoElectronico, LugarNacimiento: props.LugarNacimiento, TelefonoDomicilio: props.TelefonoDomicilio, RFC: props.RFC, DireccionID: props.DireccionID, NombreVialidad: props.NombreVialidad, CreacionFecha: props.CreacionFecha, NombreConyuge: props.NombreConyuge },
                                        Id: props.DistribuidorID,
                                    }

                                }))
                            }
                            }>
                            VER REFERENCIAS
                        </button></>
                },
            ]
        return colRet
    }, [])

    // On use effect
    React.useEffect(() => {
        FNGetLocal()
    }, [props.DistribuidorID])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: s.Datos }))
        // eslint-disable-next-line
    }, [state.Datos])

    // /** funcion Callback al actualizar un item */
    // const cbActualizar = (item: any) =>
    //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.ClasificadorID === item.ClasificadorID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { DistribuidorID: 0, DistribuidorDesc: '', SucursalDesc: '', DiasAtraso: 0, GestorId: 0, GestorDesc: '', ColorAsignaGestor: '' } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <Formik
            initialValues={{}}
            onSubmit={() => {
            }}>
            <Form >
                <div className="text-end">
                    <Card>
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    <div>
                                        <DataTable
                                            subHeader
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            {/* <input type="text" className="form-control" placeholder="Buscar Clasificador" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                            <span className="input-group-text"><FaSearch /> </span>
                                            <button className="btn btn-outline-secondary" type="button"
                                                onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                            ><FaPlus /></button>*/}
                                                            <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            data={state.DatosMostrar}
                                            striped
                                            //pagination
                                            dense
                                            noHeader
                                            responsive
                                            keyField={"DistribuidorID"}
                                            defaultSortField={"DistribuidorID"}
                                            columns={Columns}
                                        />
                                        <ModalWin open={state.Form.Mostrar} center>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>DATOS REFRENCIAS <br /> REFERENCIA: {state.Form.Datos.PersonaID} {state.Form.Datos.NombreCompleto} </h5>
                                                <button type="button" className="delete" onClick={fnCancelar}></button>
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                {<CFormInfoReferenciasAvales
                                                    oidc={props.oidc}
                                                    initialValues={state.Form.Datos}
                                                    Id={state.Form.Id}
                                                />}
                                            </ModalWin.Body>
                                        </ModalWin>
                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>

            </Form>
        </Formik>
    )
}

