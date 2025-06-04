import React, { useState, useMemo, useRef, useEffect } from "react"
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { iUI } from "../../../../../../interfaces/ui/iUI"

import * as Funciones from "./Funciones"
import { ActionSelect, CustomFieldDatePicker, CustomSelect2, DatePickeStart, Spinner } from "../../../../../global"
import { toast } from "react-toastify"
import FiltroPorUsuario from "../../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario"
import { Form, Formik } from "formik"
import { Coordinadores, Sucursales, Zonas } from "../../../../../selectores"
import moment from "moment"
import { Select } from "usetheform"
import CustomSelect from '../../../../../global/CustomSelect';
import { format } from 'path';
import { formatDate } from '../../../../../../global/functions';

type FormCumpleType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
        DirectorID: number,
        ProductoID: number,
        SucursalID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        CoordinadorID: number,
        creditoPromotorId: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date,
        GrupoID: number,
        Permiso: boolean,
        tipoDias: string
    },
}


const filtroExceptoCampo = (arr: any[], field: string, data: string) => {
    const response = field && data ? arr.filter((element) => element[`${field}`] == data) : arr;
    return response;
}

const filtro = (data: any[], values) => {
    let arr: any[] = filtroExceptoCampo(data, "", "");
    if (!isNaN(values.zona) && values.zona > 0)
        arr = filtroExceptoCampo(arr, "ZonaID", `${values.zona}`)
    if (!isNaN(values.sucursal) && values.sucursal > 0)
        arr = filtroExceptoCampo(arr, "SucursalID", `${values.sucursal}`)
    if (!isNaN(values.coordinador) && values.coordinador > 0)
        arr = filtroExceptoCampo(arr, "CoordinadorID", `${values.coordinador}`)
    if (!isNaN(values.meses) && values.meses > 0)
        arr = filtroExceptoCampo(arr, "Mes_NacimientoID", `${values.meses}`)
    return arr;
}


export default function CForm(props: FormCumpleType) {
    let isMounted = useRef(true);

    const Datos: any[] = []
    const DatosMostrar: any[] = []
    //const optMeses: any[] = []
    const FiltroMeses: number = 0

    const [state, setState] = useState({
        Error: false,
        Datos,
        DatosMostrar,
        //optMeses,
        FiltroMeses
    });
   
    const handleChange = (options:any) => {
        // sel_estatus =  options.label;
         console.log(meses)
         setMes(options);
       
         //console.log("Selected Options: ", sel_estatus)
       };

    const [loading, setLoading] = useState(false);
    const [zona, setZona] = useState(0);
    const [sucursal, setSucursal] = useState(0);
    const [coordinador, setCoordinador] = useState(0);
    const [meses, setMes] = useState(0);

    const filtrar = (values: any) => {
        const ProdID = Number.isInteger(values.ProductoID) ? values.ProductoID as number : 0;
        const SucursalIDAux = !isNaN(values.SucursalID) ? values.SucursalID as number : 0;
        const ZonaAux = Number.isInteger(values.ZonaID) ? values.ZonaID as number : 0;
        const GrupoIDAux = !isNaN(values.GrupoID) ? values.GrupoID as number : 0;
        setLoading(true);
        Funciones.FNGetLocal(props.oidc, { DistribuidorID: values.DistribuidorID, SucursalID: SucursalIDAux, ZonaID: ZonaAux, ProductoID: ProdID, GrupoID: GrupoIDAux})
            .then((respuesta: any) => {
                setState(s => ({ ...s, Error: false, Datos: respuesta, DatosMostrar: respuesta }))
                setLoading(false);
                // toast.success("Datos obtenidos correctamente");
            })
            .catch(() => {
                setState(s => ({ ...s, Error: false, Datos: [], DatosMostrar: [] }))
                setLoading(false);
                toast.error("Hubo un error al obtener los datos");
            })
    }


    useEffect(() => {
        const arr = filtro(state.Datos, { zona, sucursal, coordinador, meses });
        setState(s => ({ ...s, DatosMostrar: arr }));
    }, [zona, sucursal, coordinador, meses])

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [props.oidc])


    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Zona Id', selector: 'ZonaID', sortable: false, center: true, minWidth: '4%'},
                { name: 'Zona', selector: 'Nombre_Zona', sortable: false, center: true, minWidth: '5%' },
                {
                    name: 'Sucursal', selector: 'Sucursal_Nombre', sortable: false,minWidth: "15%", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Sucursal_Nombre}</span>
                },
                {
                    name: 'Coordinador', selector: 'Coordinador', sortable: false, minWidth: "20%", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Coordinador}</span>
                },
                {
                    name: 'Socia ID', selector: 'DistribuidorID', sortable: false, center: true, minWidth: '4%', cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.DistribuidorID?.toLocaleString("en-US")}</span>
                },
                {
                    name: 'Socia', selector: 'Socia', sortable: false, minWidth: "20%", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Socia}</span>
                },
                {
                    name: 'Fecha Cumpleaños', selector: 'Fecha_Nacimiento', sortable: false, minWidth: "11%", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{(props.Fecha_Nacimiento)}</span>
                },
                {
                    name: 'Edad', selector: 'Edad', sortable: false, center: true, minWidth: '9%', cell: (props) =>
                        <span style={{ textAlign: "center" }}>{(props.Edad)}</span>
                },
               
            ]
        return colRet
    }, [])

    return (
        <div>
            <FiltroPorUsuario
                oidc={props.oidc}
                ui={props.ui}
                initialValues={props.initialValues}
                onSubmit={filtrar}
                loading={loading}
                PrintExcelObj={{ data: state.Datos, title: "Consulta Rapida 191", nameDoc: "ConsultaRapida(191)" }}
            />
            {/* Filtro de datos (DISTINCT) */}
            {state.Datos.length > 0 &&
                <Formik
                    initialValues={{ Zona: 0, Sucursal: 0, Coordinador: 0, Mes: 0 }}
                    onSubmit={() => { }}
                >
                    {({ values }) => (
                        <Form>
                            {setZona(values.Zona)}
                            {setSucursal(values.Sucursal)}
                            {setCoordinador(values.Coordinador)}
                            {setMes(values.Mes)}
                            <div className="columns is-desktop mx-3 my-1">
                                <div className="column is-12-mobile is-12-tablet is-3-desktop" >
                                    <Zonas oidc={props.oidc} name="Zona" cargar={loading} />
                                </div>
                                <div className="column is-12-mobile is-12-tablet is-3-desktop" >
                                    <Sucursales valor={sucursal} name="Sucursal" />
                                </div>
                                <div className="column is-12-mobile is-12-tablet is-3-desktop" >
                                    <Coordinadores valor={coordinador} name="Coordinador" />
                                </div>
                                <div className="column is-12-mobile is-12-tablet is-3-desktop" >
                                {/*<CustomFieldDatePicker disabled={loading} label="Mes_Nacimiento" name="Mes_Nacimiento" />*/}
                                {/*<Select options={App} />*/}
                                <ActionSelect
                                    disabled={false}
                                    label="Mes"
                                    name="Mes"
                                    placeholder="TODOS"
                                    addDefault={false}
                                    options={[ 
                                        {
                                            value: 0, label:"TODOS", 
                                        },
                                        {
                                            value: 1, label:"Enero", 
                                        },
                                        {
                                            value: 2, label: "Febrero"
                                        }, 
                                        {
                                            value:3, label: "Marzo"
                                        }, 
                                        {
                                            value: 4, label: "Abril"
                                        }, 
                                        {
                                            value: 5, label: "Mayo"
                                        }, 
                                        {
                                            value: 6, label: "Junio"
                                        },
                                        {
                                            value: 7, label: "Julio"
                                        },
                                        {
                                            value: 8, label: "Agosto"
                                        }, 
                                        {
                                            value: 9, label: "Septiembre"
                                        }, 
                                        {
                                            value: 10, label: "Octubre"
                                        }, 
                                        {
                                            value: 11, label: "Noviembre"
                                        }, 
                                        {
                                            value: 12, label: "Diciembre"
                                        }
                                    ]}
                                    accion={setMes}
                                />

                                </div>
                                
                            </div>
                            <div className="text-end">
                                    <button style={{ marginRight: '20px', marginBottom: '2px'}}
                                        onClick={() => {
                                            const arr = filtroExceptoCampo(state.Datos, "", "");
                                            setState(s => ({ ...s, DatosMostrar: arr }))
                                        }}
                                        disabled={loading}
                                        className="btn btn-info btn-lg mt-4"
                                        type="reset"
                                    >
                                        Reiniciar
                                    </button>
                                </div>
                        </Form>
                    )}
                </Formik>
            }
            {/* Fin Filtro de datos (DISTINCT) */}
            <DataTable
                data={state.DatosMostrar}
                progressPending={loading}
                progressComponent={<Spinner />}
                dense
                striped
                noHeader
                subHeader
                pagination
                responsive
                keyField={""}
                columns={Columns}
                paginationRowsPerPageOptions={[10, 20, 30]}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                    setState(s => ({ ...s, Error: false, DatosMostrar: state.Datos }))
                }}
            />
        </div>
    )
}