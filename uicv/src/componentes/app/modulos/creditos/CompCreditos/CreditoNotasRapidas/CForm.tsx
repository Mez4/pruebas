import { useState, useMemo, useRef, useEffect } from "react"
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { iUI } from "../../../../../../interfaces/ui/iUI"

import * as Funciones from "./Funciones"
import { DatePickeEnd, DatePickeStart, Spinner } from "../../../../../global"
import { toast } from "react-toastify"
import FiltroPorUsuario from "../../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario"
import { Form, Formik } from "formik"
import { Coordinadores, Sucursales, Zonas } from "../../../../../selectores"
import moment from "moment"
import { date } from "yup"
import { number } from '../../../../../../global/idiomaValidacion.bak';
import styled from 'styled-components';
import { format } from 'path';

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
        tipoDias: string,
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
    return arr;
}


export default function CForm(props: FormCumpleType) {
    let isMounted = useRef(true);

    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = useState({
        Error: false,
        Datos,
        DatosMostrar,
    });

    const [loading, setLoading] = useState(false);
    const [zona, setZona] = useState(0);
    const [sucursal, setSucursal] = useState(0);
    const [coordinador, setCoordinador] = useState(0);    
   
    //var Fecha_Registro = moment(startDate).format("YYYY-MM-DD")
    
    const filtrar = (values: any) => {
        const ProdID = Number.isInteger(values.ProductoID) ? values.ProductoID as number : 0;
        const SucursalIDAux = !isNaN(values.SucursalID) ? values.SucursalID as number : 0;
        const ZonaAux = Number.isInteger(values.ZonaID) ? values.ZonaID as number : 0;
        const GrupoIDAux = !isNaN(values.GrupoID) ? values.GrupoID as number : 0;
        const FechaInicioAux = moment(values.FechaInicio).format('YYYY-MM-DD') ? values.FechaInicio as string : '';
        const FechaFinAux = moment(values.FechaFin).format('YYYY-MM-DD') ? values.FechaFin as string : '';
        console.log('valores', values);
        setLoading(true);
        Funciones.FNGetLocal(props.oidc, { DistribuidorID: values.DistribuidorID, SucursalID: SucursalIDAux, ZonaID: ZonaAux, ProductoID: ProdID, GrupoID: GrupoIDAux, FechaInicio: FechaInicioAux, FechaFin: FechaFinAux})
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
        const arr = filtro(state.Datos, { zona, sucursal, coordinador});
        setState(s => ({ ...s, DatosMostrar: arr }));
    }, [zona, sucursal, coordinador])

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [props.oidc])

    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                // { name: 'ZonaID', selector: 'ZonaID', sortable: false, center: true, minWidth: '19px', cell: (props) =>
                // <span style={{ textAlign: "center" }}>{props.ZonaID}</span> },
                // { name: 'Zona', selector: 'Nombre_Zona', sortable: false, center: true, minWidth: '90px', cell: (props) =>
                // <span style={{ textAlign: "center" }}>{props.Nombre_Zona}</span> },
                // {
                //     name: 'Sucursal', selector: 'Sucursal_Nombre', sortable: false,minWidth: "150px", center: true, cell: (props) =>
                //         <span style={{ textAlign: "center" }}>{props.Sucursal_Nombre}</span>
                // },
                {
                    name: 'Coordinador', selector: 'Coordinador', sortable: false, minWidth: "180px", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Coordinador}</span>
                },
                {
                    name: 'SociaID', selector: 'DistribuidorID', sortable: false, center: true, minWidth:'70px', cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.DistribuidorID}</span>
                },
                {
                    name: 'Socia', selector: 'Socia', sortable: false, minWidth: "180px", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Socia}</span>
                },
                {
                    name: 'Tipo Nota', selector: 'Tipo_Nota', sortable: false, minWidth: "50px", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Tipo_Nota}</span>
                },
                {
                    name: 'Nota', selector: 'Descripcion', sortable: false, minWidth: "200px", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Descripcion}</span>
                },
                {
                    name: 'Realizó Nota', selector: 'Registro_Nota', sortable: false, minWidth: "180px", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{props.Registro_Nota}</span>
                },
                {
                    name: 'Fecha Realización', selector: 'Fecha_Registro', sortable: false, minWidth: "110px", center: true, cell: (props) =>
                        <span style={{ textAlign: "center" }}>{(props.Fecha_Registro)}</span>
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
                EsNotasRapidas={true}
                PrintExcelObj={{ data: state.Datos, title: "Consulta Rapida 221", nameDoc: "ConsultaRapida(221)" }}
            />
            {/* Filtro de datos (DISTINCT) */}
            {state.Datos.length > 0 &&
                <Formik
                    initialValues={{ Zona: 0, Sucursal: 0, Coordinador: 0}}
                    onSubmit={() => { }}
                >
                    {({ values }) => (
                        <Form>
                            {setZona(values.Zona)}
                            {setSucursal(values.Sucursal)}
                            {setCoordinador(values.Coordinador)}
                        
                           
                           
                            <div style={{marginTop: '10px'}} className="columns is-desktop">
                                <div  className="column is-12-mobile is-12-tablet is-3-desktop" >
                                    <Zonas oidc={props.oidc} name="Zona" cargar={loading} />
                                </div>
                                <div  className="column is-12-mobile is-12-tablet is-3-desktop" >
                                    <Sucursales valor={sucursal} name="Sucursal" />
                                </div>
                                <div  className="column is-12-mobile is-12-tablet is-3-desktop" >
                                    <Coordinadores valor={coordinador} name="Coordinador" />
                                </div>
                               
                                <div className="text-end">
                                    <button style={{marginLeft:'140px'}}
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