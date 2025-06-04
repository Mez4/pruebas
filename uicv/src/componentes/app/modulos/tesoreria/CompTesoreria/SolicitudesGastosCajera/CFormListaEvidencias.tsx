import React, { useRef, TextareaHTMLAttributes } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, Card, CustomFieldText, CustomFieldText2, CustomSelect, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaEraser, FaFile, FaLock, FaLockOpen, FaMoneyCheckAlt, FaWindowClose } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Control from 'react-select/src/components/Control'
import { formatDate } from '../../../../../../global/functions'
import moment from 'moment'

type CFormType = {
    oidc: IOidc
    SolicitudDetalleID: number,
    Cotizacion: boolean,
    Evidencias: any[]
    fnVerDoc(): any
    fnSetDocumentoID(item: any): any

}

export const CFormListaEvidencias = (props: CFormType, propss: any) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    const refObservaciones = useRef<Text>(null)
    console.log("PROPS RECIBIDOS: ", props)
    const EvidenciasLista: any[] = []

    const [state, setState] = React.useState({
        GeneraGasto: false,
        EvidenciasLista,
        Cargando: false,
        Error: false
    })


    const FNGetEvidencias = () => {
        setState
            ({
                ...state,
                Cargando: true
            })

        Funciones.FNGetEvidencias(props.oidc, props.SolicitudDetalleID, props.Cotizacion)
            .then((res: any) => {

                console.log("RES: ", res)
                setState({
                    ...state,
                    EvidenciasLista: res,
                    Cargando: false
                })
            }).catch((err: any) => {
                console.log("ERR: ", err)
            }
            )
    }
    React.useEffect(() => {
        FNGetEvidencias()
    }, [])

    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY hh:mm")
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title={props.Cotizacion ? 'Cotizaciones' : 'Evidencias'}>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando &&
                                <div className="text-center">
                                    <Spinner />
                                    <br />
                                    <span>Cargando </span>
                                </div>
                            }
                            {state.Error &&
                                <div className="text-center">
                                    <p>Error al cargar </p>
                                    <button className="btn btn-sm btn-confia text-white">Actualizar</button>
                                </div>
                            }
                            {!state.Cargando && !state.Error &&
                                <DataTable
                                    data={state.EvidenciasLista}
                                    striped
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"SolicitudDetalleID"}
                                    defaultSortField={"SolicitudDetalleID"}
                                    columns={
                                        [
                                            {
                                                name: "SolicitudDetalleID",
                                                selector: "SolicitudDetalleID",
                                                sortable: false,
                                                center: true,
                                                cell: (row: any) => {
                                                    return (
                                                        <span className="text-center">
                                                            {row.SolicitudDetalleID}
                                                        </span>
                                                    )
                                                }
                                            },
                                            {
                                                name: "¿Es Cotización?",
                                                selector: "Cotizacion",
                                                sortable: false,
                                                center: true,
                                                cell: (row: any) => {
                                                    return (
                                                        <span className="text-center">
                                                            {row.Cotizacion ? 'Si' : 'No'}
                                                        </span>
                                                    )
                                                }
                                            },
                                            {
                                                name: "Fecha de subida",
                                                selector: "FechaSubida",
                                                sortable: false,
                                                center: true,
                                                cell: (row: any) => {
                                                    //Format in dd-mm-yyyy in <span> tag
                                                    return (
                                                        <span className="text-center">
                                                            {formatearFecha(row.FechaSubida)}
                                                        </span>
                                                    )

                                                }
                                            },


                                            {
                                                name: "Ruta",
                                                selector: "Ruta",
                                                sortable: false,
                                                center: true,
                                                cell: (row: any) => {
                                                    return (
                                                        <span className="text-center">
                                                            {row.Ruta}
                                                        </span>
                                                    )
                                                }
                                            },
                                            {
                                                name: 'Acciones', selector: 'Acciones', sortable: false, center: true,
                                                cell: (propss) => <span className="text-center">
                                                    <button className="btn btn-primary btn-sm" onClick={() => {
                                                        props.fnSetDocumentoID(propss.DocumentoID)
                                                        props.fnVerDoc()
                                                    }}><i className="fa fa-eye"></i></button>
                                                </span>

                                            }
                                        ]
                                    }
                                />
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}