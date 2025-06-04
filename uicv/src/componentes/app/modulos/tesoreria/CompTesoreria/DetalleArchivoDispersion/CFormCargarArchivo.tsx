import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { Field, ErrorMessage } from 'formik'
import DatePicker, { registerLocale } from "react-datepicker"
import { FaSearch, FaTimes, FaTrashAlt, FaCheckCircle } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaPencilAlt, FaPlus, FaCircle, FaTrash, FaPrint } from 'react-icons/fa'
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import * as XLSX from 'xlsx'


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


type CFormType = {
    tipo?: string,
    oidc: IOidc
    cbActualizar(item: any): any,

}


export const CFormCargarArchivo = (props: CFormType) => {

    const MySwal = withReactContent(Swal)

    const DatosDefecto = { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const opPolizasTipo: any[] = []
    const CuentasCSV: any[] = []

    const [state, setState] = React.useState({
        Datos: {
            fechaInicial: "",
            fechaFinal: "",
            usuario: "",
            arqueoId: 0
        },
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        optCuentas,
        opPolizasTipo,
        startDate: null,
        endDate: null,
        CuentasCSV

    })

    const [estado, setEstado] = React.useState({
        numeroP: {
            id: "",
        }
    })
    // Loading
    const [loading, setLoading] = React.useState(false)
    const handleUpload = (e) => {
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            if (e.target) {
                var data = e.target.result;
                let readedData = XLSX.read(data, { type: 'binary' });
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
                //const cols = make_cols(ws['!ref'])
                let tabla: any[] = []
                let Valor = dataParse[0]
                var StringVal = dataParse[0] + ""
                if (StringVal == 'Estado de Órdenes Enviadas' || StringVal == 'Consulta de Órdenes Enviadas') {
                    dataParse.forEach(item => {
                        tabla.push(convert(item))
                    });
                    tabla.splice(0, 2);
                    setState(s => ({ ...s, CuentasCSV: tabla }))
                } else {
                    setState(s => ({ ...s, CuentasCSV: [] }))
                    toast.error("Archivo no corresponde a formato STP")
                }
            }

        };
        reader.readAsBinaryString(f)
    }
    const convert = (arr: any) => {
        let tabla: any[] = []
        var obj = {};
        for (var i = 0; i < arr.length; ++i) {
            obj[i] = arr[i];
        }
        let detalle: any = {
            clave_rastreo: obj[5],
            estado: obj[12],
            cuenta: obj[14],
            causa_dev: obj[13]
        }
        return detalle;
    }

    // Return the component
    return (
        <Formik
            initialValues={state.Datos}
            enableReinitialize

            onSubmit={(values: any) => {
                MySwal.fire(
                    {
                        allowOutsideClick: false,
                        icon: 'info',
                        html: <div><br />
                            <h3 className="text-center">Aviso</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Aplicando dispersión.</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Ok`,
                        didOpen: () => {
                            MySwal.showLoading()
                        },
                    }
                );
                let datos = {
                    Dispersiones_Aplicar: state.CuentasCSV
                }
                Funciones.FNAplicarDispersion(props.oidc, datos)
                    .then((respuesta: any) => {
                        console.log("RESP COMPLETO .", respuesta.completo)
                        console.log("RESP ID .", respuesta.dispersionID)

                        if (respuesta.completo) {
                            props.cbActualizar(respuesta)
                        }
                        MySwal.fire(
                            {
                                allowOutsideClick: false,
                                icon: 'success',
                                html: <div><br />
                                    <h3 className="text-center">Éxito</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Dispersión aplicada correctamente.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: `Continuar`,
                                showConfirmButton: true,
                            }
                        );
                    })
                    .catch((error: any) => {
                        MySwal.fire(
                            {
                                allowOutsideClick: false,
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Error</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Ocurrió un problema al aplicar la dispersión.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: `Continuar`,
                                showConfirmButton: true,
                            }
                        );
                        console.log(error)
                    })


            }}>

            <Form>
                <div>
                    <div className="row">
                        {loading && <Spinner />}
                        {!loading && <div><br />
                            <h3 className="text-center">Carga de archivo de {props.tipo}</h3>
                            <div className={`modal-body`}>
                                <div>
                                    <div className="columns is-centered is-mobile is-multiline">
                                        <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile text-center">
                                            <input type="file" id="input" onChange={handleUpload} accept=".xls, .xlsx" />
                                        </div>
                                        <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile text-center">
                                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" disabled={state.CuentasCSV.length > 0 ? false : true} onClick={() => {
                                                console.log(state.CuentasCSV)
                                            }}>
                                                Aceptar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>

            </Form>
        </Formik >
    )
}