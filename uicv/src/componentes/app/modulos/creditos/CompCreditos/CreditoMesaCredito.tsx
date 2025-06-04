import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card, CustomFieldDatePicker, Spinner } from '../../../../global'
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { Form, Formik } from 'formik';
// Obtencion de scripts o variables necesarias para minimizar el codigo por pagina
import { HeadersColumns } from './CreditoCobranzaGlobal/scripts'
import * as Yup from "yup";
import { FaSearch } from 'react-icons/fa';
import { Productos, Sucursales } from '../../../../selectores';
import { FormateoDinero } from '../../../../../global/variables';
import moment from 'moment';
import { FNGetReporte1549 } from './CreditoMesaCredito/Funciones';

type CreditoCobranzaGlobalType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
        ProductoID: number,
     
    },
}

function CreditoMesaCredito(props: CreditoCobranzaGlobalType) {
  let isMounted = React.useRef(true);
    const [state, setState] = useState({ 
        data: [{}], 
        loading: false,
        DatosMostrar: [],
        Cargando: false,
        Error: false,
        Filtro: ""

    })

    const Columns: IDataTableColumn[] = [
        {
          name: "SucursalID",
          selector: "SucursalID",
          center: true,
          sortable: false,
          // minWidth: "4%",
          width: '65px',
          cell: (propss) => (
            <span className="text-center">{propss.SucursalID}</span>
          ),
        },
        {
          center: true,
          name: "Sucursal",
          selector: "Sucursal",
          sortable: false,
          // minWidth: "11%",
          cell: (propss) => <span className="text-center">{propss.Sucursal}</span>,
        },
        {
          name: "ZonaID",
          selector: "ZonaID",
          center: true,
          sortable: false,
          // minWidth: "4%",
        //   cell: (propss) => (
        //     <span className="text-center">
        //       {moment(propss.FechaReporte).utc().format("DD-MM-YYYY HH:mm:ss A")}
        //     </span>
        //   ),
        },
        {
          name: "Zona",
          selector: "Zona",
          center: true,
          sortable: false,
          // minWidth: "8%",
          cell: (propss) => (
            <span className="text-center">{propss.Zona}</span>
          ),
        },
        {
          name: "Empresa",
          selector: "Empresa",
          center: true,
          sortable: false,
          // minWidth: "7%",
          cell: (propss) => (
            <span className="text-center">{propss.Empresa}</span>
          ),
        },
        {
          name: "Estatus",
          selector: "Estatus",
          sortable: false,
          center: true,
          // minWidth: "7%",
          cell: (propss) => (
            <span className="text-center">{propss.Estatus}</span>
          ),
        },
        {
          center: true,
          name: "SociaID",
          selector: "SociaID",
          sortable: false,
          // minWidth: "4%",
        //   cell: (propss) => (
        //     <span className="text-center">
        //       {FormateoDinero.format(propss.ImporteDesembolsadoSistema)}
        //     </span>
        //   ),
        },
        {
          center: true,
          name: "Socia",
          selector: "Socia",
          sortable: false,
          width: '180px',
          // minWidth: "9%",
          cell: (propss) => (
            <span className="text-center">{propss.Socia}</span>
          ),
        },
        {
          center: true,
          name: "Línea Dinero",
          selector: "Linea",
          sortable: false,
          width:'120px',
          // minWidth: "9%",
          cell: (propss) => (
            <span className="text-center">
              {FormateoDinero.format(propss.Linea)}
            </span>
          ),
        },
        {
          center: true,
          name: "Linea ConfiaShop",
          selector: "LineaCS",
          sortable: false,
          // minWidth: "9%",
          cell: (propss) => (
            <span className="text-center">
              {FormateoDinero.format(propss.LineaCS)}
            </span>
          ),
        },
        {
          name: "Usuario Consolida",
          selector: "UsuarioConsolida",
          sortable: false,
          center: true,
          width:'160px',
          // minWidth: "10%",
          cell: (propss) => (
            <span className="text-center">{propss.UsuarioConsolida}</span>
          ),
        },
        {
          name: "Fecha/Hora Consolida",
          selector: "FechaConsolida",
          center: true,
          sortable: false,
          width:'120px',
          // minWidth: "5%",
          cell: (propss) => (
            <span className="text-center">
              {moment(propss.FechaConsolida).utc().format("DD-MM-YYYY HH:mm:ss A")}
            </span>
          ),
        },
        {
            name: "Usuario Valida",
            selector: "UsuarioValida",
            sortable: false,
            center: true,
            width:'160px',
            // minWidth: "10%",
            cell: (propss) => (
              <span className="text-center">{propss.UsuarioValida}</span>
            ),
          },
          {
            name: "Fecha/Hora Valida",
            selector: "FechaValida",
            center: true,
            sortable: false,
            width:'120px',
            // minWidth: "5%",
            cell: (propss) => (
              <span className="text-center">
                {moment(propss.FechaValida).utc().format("DD-MM-YYYY HH:mm:ss A")}
              </span>
            ),
          },
          {
            name: "Fecha/Hora Alta",
            selector: "FechaAlta",
            center: true,
            sortable: false,
            width:'120px',
            // minWidth: "5%",
            cell: (propss) => (
              <span className="text-center">
                {moment(propss.FechaAlta).utc().format("DD-MM-YYYY HH:mm:ss A")}
              </span>
            ),
        },
        {
            name: "Origen IngresoID",
            selector: "OrigenIngresoID",
            sortable: false,
            center: true,
            // minWidth: "7%",
            cell: (propss) => (
              <span className="text-center">{propss.OrigenIngresoID}</span>
            ),
          },
          {
              name: "Origen Ingreso",
              selector: "OrigenIngreso",
              sortable: false,
              center: true,
              // minWidth: "9%",
              cell: (propss) => (
                <span className="text-center">{propss.OrigenIngreso}</span>
              ),
            },
            {
                name: "Estatus Buro",
                selector: "EstatusBuro",
                sortable: false,
                center: true,
                // minWidth: "7%",
                cell: (propss) => (
                  <span className="text-center">{propss.EstatusBuro}</span>
                ),
            },
            {
                name: "Coordinador",
                selector: "Coordinador",
                sortable: false,
                center: true,
                width:'160px',
                // minWidth: "10%",
                cell: (propss) => (
                  <span className="text-center">{propss.Coordinador}</span>
                ),
            },
            {
                name: "Promotor",
                selector: "Promotor",
                sortable: false,
                center: true,
                width:'160px',
                // minWidth: "10%",
                cell: (propss) => (
                  <span className="text-center">{propss.Promotor}</span>
                ),
            },
            {
                name: "Limite Disponible",
                selector: "LimiteDisponible",
                sortable: false,
                center: true,
                width:'120px',
                // minWidth: "8%",
                cell: (propss) => (
                  <span className="text-center">
                    {FormateoDinero.format(propss.LimiteDisponible)}
                  </span>
                ),
            },
            {
                name: "Saldo Actual",
                selector: "SaldoActual",
                sortable: false,
                center: true,
                width:'120px',
                // minWidth: "8%",
                cell: (propss) => (
                  <span className="text-center">
                    {FormateoDinero.format(propss.SaldoActual)}
                  </span>
                ),
            },
            {
                name: "Dias Atraso",
                selector: "DiasAtraso",
                sortable: false,
                center: true,
                // minWidth: "7%",
                cell: (propss) => (
                  <span className="text-center">{propss.DiasAtraso}</span>
                ),
            },
            {
              name: "Fecha/Hora Primer Canje",
              selector: "FechaPrimerCanje",
              center: true,
              sortable: false,
              width:'120px',
              // minWidth: "5%",
              cell: (propss) => (
                <span className="text-center">
                  {moment(propss.FechaPrimerCanje).utc().format("DD-MM-YYYY HH:mm:ss A")}
                </span>
              ),
            },
            {
                name: "Distribuidor TipoID",
                selector: "DistribuidorTipoID",
                sortable: false,
                center: true,
                // minWidth: "7%",
                cell: (propss) => (
                  <span className="text-center">{propss.DistribuidorTipoID}</span>
                ),
            },
            {
                name: "Distribuidor Tipo",
                selector: "DistribuidorTipo",
                sortable: false,
                center: true,
                // minWidth: "8%",
                cell: (propss) => (
                  <span className="text-center">{propss.DistribuidorTipo}</span>
                ),
            },
            {
              name: "Fecha/Hora Solicitud Validacion",
              selector: "FechaSolicitudValidacion",
              center: true,
              sortable: false,
              width:'120px',
              // minWidth: "5%",
              cell: (propss) => (
                <span className="text-center">
                  {moment(propss.FechaSolicitudValidacion).utc().format("DD-MM-YYYY HH:mm:ss A")}
                </span>
              ),
            },
            {
                name: "EstatusID",
                selector: "EstatusID",
                sortable: false,
                center: true,
                // minWidth: "7%",
                cell: (propss) => (
                  <span className="text-center">{propss.EstatusID}</span>
                ),
            },
      ];
    

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Mesa de Crédito 1495">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={{
                                    SucursalID: 0,
                                    ProductoID: 0,
                                    FechaInicio:'',
                                    FechaFin:''
                                  }}
                                enableReinitialize
                                validationSchema={Yup.object().shape({
                                  FechaInicio: Yup.date()
                                    .required("Seleccione una Fecha(Obligatorio)")
                                    .nullable(),
                                    FechaFin: Yup.date()
                                    .required("Seleccione una Fecha(Obligatorio)")
                                    .nullable(),
                                  SucursalID: Yup.number().moreThan(
                                    0,
                                    "Seleccione una Sucursal(Obligatorio)"
                                  ),
                                })}
                                onSubmit={(values: any) => { 
                                    FNGetReporte1549(props.oidc,values)
                                    .then((respuesta: any) => {
                                      if (isMounted.current === true) {
                                        
                              
                                        setState((s) => ({
                                          ...s,
                                          Cargando: false,
                                          DatosMostrar: respuesta,
                                          Filtro2: true,
                                        }));
                                        // setLoading(false);
                                      }
                                      /*  } */
                                    })
                                    .catch(() => {
                                      if (isMounted.current === true) {
                                        setState((s) => ({
                                          ...s,
                                          Cargando: false,
                                          DatosMostrar: [],
                                          Filtro2: false,
                                        }));
                                        // setLoading(false);
                                      }
                                    });
                                }}
                            >
                                {({ values }) => (
                                <Form>
                                    <div className='columns is-desktop'>
                                    <div className="column is-4-desktop">
                                    <Sucursales disabled={state.loading}  name={'SucursalID'} ProductoID={props.ui.Producto?.ProductoID} valor={0} />
                                    </div>
                                    
                                        <div className="column is-4-desktop">
                                            <CustomFieldDatePicker
                                                disabled={state.loading}
                                                label='Fecha inicio'
                                                name='FechaInicio'
                                            />
                                        </div>
                                        <div className="column is-4-desktop">
                                            <CustomFieldDatePicker
                                                disabled={state.loading}
                                                label='Fecha fin'
                                                name='FechaFin'
                                            />
                                        </div>
                                        </div>
                                        
                                    <div className="text-end">
                                        <button
                                            disabled={state.loading}
                                            className='button is-success'
                                            type="submit"
                                        >
                                            Buscar
                                        </button>
                                    </div>

                                    <div className="columns is-centered is-mobile is-multiline">
                      {state.Cargando && <Spinner />}
                      {!state.Cargando && !state.Error && (
                        <DataTable
                          subHeader
                          noDataComponent={<div>No hay datos</div>}
                          subHeaderComponent={
                            <div className="row">
                              <div className="input-group pb-3 mb-10">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Buscar"
                                  value={state.Filtro}
                                  onChange={(e) =>
                                    setState((s) => ({
                                      ...s,
                                      Filtro: e.target.value,
                                    }))
                                  }
                                />
                                <span className="input-group-text">
                                  <FaSearch />{" "}
                                </span>
                              </div>
                            </div>
                          }
                          data={state.DatosMostrar}
                          striped
                          pagination
                          dense
                          responsive
                          keyField={"CreditoID"}
                          defaultSortField={"CreditoID"}
                          columns={Columns}
                        />
                      )}
                    </div>
                                </Form>
                                 )}
                            </Formik>
                            {/* <DataTable
                                columns={Columns}
                                data={state.data}
                                responsive
                                pagination
                            /> */}
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

export default connect(mapStateToProps, {})(CreditoMesaCredito)