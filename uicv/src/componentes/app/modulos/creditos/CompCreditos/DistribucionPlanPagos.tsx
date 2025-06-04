import { connect } from "react-redux"
import { IEstado } from "../../../../../interfaces/redux/IEstado"
import { IOidc } from "../../../../../interfaces/oidc/IOidc"
import { ActionSelect, Card, Spinner } from "../../../../global"
import { DataGrid, GridActionsCellItem, GridActionsColDef, GridCellEditStopParams, GridCellEditStopReasons, GridColDef, GridCsvExportMenuItem, GridEventListener, GridPrintExportMenuItem, GridRowEditStartParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridSaveAltIcon, GridToolbarExportContainer, MuiEvent } from "@mui/x-data-grid"
import React, { useMemo } from "react"
import moment from "moment"
import * as Yup from 'yup';
import { Form, Formik } from "formik"
import { FaFilter, FaPencilAlt, FaSave } from "react-icons/fa"
import { FiRefreshCcw } from "react-icons/fi"
import { Creditos, Distribuidores, Sucursales } from "../../../../selectores"
import CForm from "./DistribucionPlanPagos/CForm"
import * as Funciones from "./DistribucionPlanPagos/Funciones"
import { FaXmark } from "react-icons/fa6"
import DataTable from "react-data-table-component"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

type CatalogosType = {
	oidc: IOidc
}

type CreditosDatosTipo = {
	CreditoID: any,
	ProductoID: number,
	ClienteID: number,
	SucursalID: number,
	CajaID: number,
	ZonaID: number,
	EmpresaID: number,
	DistribuidorID: number,
	CoordinadorID: number,
	ContratoID: number,
	EstatusID: string,
	DistribuidorNivelID: number,
	FechaInicio: Date,
	FechaFin: Date
}

type CreditosTipo = {
	Cargando: boolean,
	Error: boolean,
	Form: {
		CreditoID: number,
		ProductoID: number,
		ClienteID: number,
		SucursalID: number,
		CajaID: number,
		ZonaID: number,
		EmpresaID: number,
		DistribuidorID: number,
		CoordinadorID: number,
		ContratoID: number,
		EstatusID: boolean,
		DistribuidorNivelID: number,
	},
	FechaInicio: Date,
	FechaFin: Date,
	Loading: boolean,
	Datos: any[],
	DatosSinEditar: any[],
	Credito: any,
	TotalesModificados: any,
	CargandoGuardado: boolean,
}

const TotalesOriginalesInit = {
	Interes: 0,
	ManejoCuenta: 0,
	Seguro: 0,
	Cargo: 0,
	IVA: 0,
	SaldoActual: 0,
	Abonos: 0,
	Capital: 0,
}

const OriginalState = {
	Cargando: false,
	Error: false,
	Form: {
		CreditoID: 0,
		ProductoID: 0,
		ClienteID: 0,
		SucursalID: 0,
		CajaID: 0,
		ZonaID: 0,
		EmpresaID: 0,
		DistribuidorID: 0,
		CoordinadorID: 0,
		ContratoID: 0,
		EstatusID: false,
		DistribuidorNivelID: 0,
	},
	FechaInicio: moment().toDate(),
	FechaFin: moment().toDate(),
	Loading: false,
	Datos: [],
	DatosSinEditar: [],
	Credito: TotalesOriginalesInit,
	TotalesModificados: TotalesOriginalesInit,
	CargandoGuardado: false
}

const DistribucionPlanPagos = (props: CatalogosType) => {
	const MySwal = withReactContent(Swal)
	const [isMounted, setisMounted] = React.useState(false);
	const [state, setState] = React.useState<CreditosTipo>(OriginalState);
	const [rows, setRows] = React.useState<any[]>([]);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

	const Columns: any[] = [
		{ field: 'NoPago', headerName: 'No. Pago', editable: false, flex: 0.5, align: "center", headerAlign: 'center' },
		{ field: 'Capital', headerName: 'Capital', editable: true, flex: 1 },
		{ field: 'Interes', headerName: 'Interes', editable: true, flex: 1 },
		{ field: 'ManejoCuenta', headerName: 'ManejoCuenta', editable: true, flex: 1 },
		{ field: 'Seguro', headerName: 'Seguro', editable: true, flex: 1 },
		{ field: 'Cargo', headerName: 'Cargo', editable: true, flex: 1 },
		{ field: 'IVA', headerName: 'IVA', editable: true, flex: 1 },
		{ field: 'Abonos', headerName: 'Abonos', editable: true, flex: 1 },
		{
			field: 'FechaVencimiento', headerName: 'F.Vencimiento', editable: true,
			type: 'date', flex: 1, valueGetter: (params) => moment(params.value).add(1, 'd').toDate()
		},
		{
			field: 'FechaVencimientoClienteFinal', headerName: 'F.Vencimiento CF', editable: true,
			type: 'date', flex: 1, valueGetter: (params) => moment(params.value).add(1, 'd').toDate()
		},
		{ field: 'SaldoActual', headerName: 'Saldo actual', type: 'number', editable: false, flex: 1 },
		{
			field: 'actions',
			type: 'actions', headerName: 'Actions', flex: 1, cellClassName: 'actions',
			getActions: ({ id }) => {
				const row = state.Datos.find(reg => reg['NoPago'] === id)
				if (row.SaldoActual < 1 && !row.isNew)
					return []


				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<FaSave />}
							label="Guardar"
							sx={{ color: 'green' }}
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<FaXmark />}
							label="Cancel"
							sx={{ color: 'red' }}
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<FaPencilAlt />}
						label="Editar"
						onClick={handleEditClick(id)}
					/>,
				];
			},
		},
	].map(r => ({
		...r,
		align: 'center',
		headerAlign: 'center',
	}))

	const handleEditClick = (id) => () => setRowModesModel({
		...rowModesModel, [id]: { mode: GridRowModes.Edit }
	});

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = state.Datos.find((row) => row['NoPago'] === id);

		if (editedRow!.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};


	const processRowUpdate = (newRow: GridRowModel) => {
		newRow = {
			...newRow,
			NoPago: newRow.NoPago,
			Interes: parseFloat(newRow.Interes || 0),
			ManejoCuenta: parseFloat(newRow.ManejoCuenta || 0),
			Seguro: parseFloat(newRow.Seguro || 0),
			Cargo: parseFloat(newRow.Cargo || 0),
			IVA: parseFloat(newRow.IVA || 0),
			Abonos: parseFloat(newRow.Abonos || 0),
			Capital: parseFloat(newRow.Capital || 0),
			isNew: newRow.isNew ? newRow.isNew : false
		}
		if (isNaN(newRow.Interes) ||
			isNaN(newRow.ManejoCuenta) ||
			isNaN(newRow.Seguro) ||
			isNaN(newRow.Cargo) ||
			isNaN(newRow.IVA) ||
			isNaN(newRow.Abonos) ||
			isNaN(newRow.Capital) ||
			isNaN(newRow.SaldoActual)) {
			toast.error("Los valores ingresados deben ser numericos")

			newRow = {
				...newRow,
				Interes: newRow.InteresOriginal || 0,
				ManejoCuenta: newRow.ManejoCuentaOriginal || 0,
				Seguro: newRow.SeguroOriginal || 0,
				Cargo: newRow.CargoOriginal || 0,
				IVA: newRow.IVAOriginal || 0,
				Abonos: newRow.AbonosOriginal || 0,
				Capital: newRow.CapitalOriginal || 0,
				SaldoActual: newRow.SaldoActualOriginal || 0,
			}
		}
		newRow = {
			...newRow,
			isEdited: newRow.isNew ? false : true,
			SaldoActual: (newRow.Capital +
				newRow.Interes +
				newRow.ManejoCuenta +
				newRow.Seguro +
				newRow.Cargo +
				newRow.IVA) - newRow.Abonos
		}

		const TotalesModificados = state.Datos
			.map(row => row.NoPago == newRow.NoPago ? newRow : row)
			.reduce((a, b) => ({
				Interes: parseFloat((a.Interes + b.Interes).toFixed(4)),
				ManejoCuenta: parseFloat((a.ManejoCuenta + b.ManejoCuenta).toFixed(4)),
				Seguro: parseFloat((a.Seguro + b.Seguro).toFixed(4)),
				Cargo: parseFloat((a.Cargo + b.Cargo).toFixed(4)),
				IVA: parseFloat((a.IVA + b.IVA).toFixed(4)),
				SaldoActual: parseFloat((a.SaldoActual + b.SaldoActual).toFixed(4)),
				Abonos: parseFloat((a.Abonos + b.Abonos).toFixed(4)),
				Capital: parseFloat((a.Capital + b.Capital).toFixed(4)),
			}), TotalesOriginalesInit)

		setState(prev => ({
			...prev,
			TotalesModificados: TotalesModificados,
			Datos: state.Datos.
				map(row => row.NoPago == newRow.NoPago ? newRow : row),
		}))

		return newRow
	};

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
		console.log(state.Datos.find(r => r.NoPago == id))
	};

	const getPlanPagosCredito = (reqData: CreditosDatosTipo) => {
		setRowModesModel({});
		setState(prev => ({ ...prev, Cargando: true }))

		let CreditoID = reqData.CreditoID == null ? 0 :
			(isNaN(reqData.CreditoID.value) ? 0 : reqData.CreditoID.value);

		Funciones.FNGetPlanPagos(props.oidc, { CreditoID: CreditoID })
			.then((res: any) => {
				if (Array.isArray(res.PlanPagos)) {
					const formatted = res.PlanPagos.map(r => ({
						...r,
						FechaVencimiento: moment(r.FechaVencimiento).toDate(),
						FechaVencimientoClienteFinal: moment(r.FechaVencimientoClienteFinal).toDate(),
						SaldoActualOriginal: r.SaldoActual,
						AbonosOriginal: r.Abonos
					})).sort((a, b) => a.NoPago - b.NoPago)

					const TotalesOriginales = formatted.reduce((a, b) => ({
						Interes: parseFloat((a.Interes + b.Interes).toFixed(4)),
						ManejoCuenta: parseFloat((a.ManejoCuenta + b.ManejoCuenta).toFixed(4)),
						Seguro: parseFloat((a.Seguro + b.Seguro).toFixed(4)),
						Cargo: parseFloat((a.Cargo + b.Cargo).toFixed(4)),
						IVA: parseFloat((a.IVA + b.IVA).toFixed(4)),
						SaldoActual: parseFloat((a.SaldoActual + b.SaldoActual).toFixed(4)),
						Abonos: parseFloat((a.Abonos + b.Abonos).toFixed(4)),
						Capital: parseFloat((a.Capital + b.Capital).toFixed(4)),
					}), TotalesOriginalesInit)

					setState(prev => ({
						...prev, Cargando: false, Error: false,
						Datos: formatted,
						Credito: res.Credito,
						TotalesModificados: TotalesOriginales
					}))
				}
			}).catch(err => {
				console.log(err)
				setState(prev => ({ ...prev, Cargando: false, Error: true }))
			})
	}

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => setRowModesModel(newRowModesModel);

	const FnAñadirAbono = () => {
		const array = state.Datos.length > 0 ? state.Datos.reduce((a, b) => a > b.NoPago ? a : b.NoPago, state.Datos[0].NoPago) : null
		if (array !== null)
			setState(prev => ({
				...prev,
				Datos: [
					...state.Datos,
					{
						...TotalesOriginalesInit,
						NoPago: array + 1,
						isNew: true,
					}
				]
			}))
	}

	const FnGuardarPlanPagos = () => {
		setState(prev => ({ ...prev, CargandoGuardado: true }))


		MySwal.fire(
			{
				icon: 'question',
				html: <div><br />
					<h3 className="text-center"><strong>Aviso</strong></h3>
					<div className={`modal-body`}>
						<h5 className="text-center">¿Estás seguro de guardar el plan de pagos? .</h5>
						<h6 className="text-center">Esta operación no se puede deshacer.</h6>
					</div>
				</div>,
				confirmButtonText: `Aceptar`,
				cancelButtonText: 'Cancelar',
				showCancelButton: true,
				confirmButtonColor: `#3085d6`,
				cancelButtonColor: 'red'
			}
		).then((value) => {
			if (value.isConfirmed) {
				Funciones.FNUpdatePlanPagos(props.oidc, { CreditoID: state.Credito.CreditoID, PlanPagoArray: JSON.stringify(state.Datos) })
					.then((res: any) => {
						if (res.regresa == 0) toast.error(res.mensaje)
						else {
							toast.success(res.mensaje)
							resetData()
						}
					})
					.catch(error => {
						console.error(error)
					})
			}
			setState(prev => ({ ...prev, CargandoGuardado: false }))
		}).catch(() => setState(prev => ({ ...prev, CargandoGuardado: false })));
	}

	const resetData = () => setState(OriginalState)

	React.useEffect(() => {
		if (isMounted === true) { }
		return () => { setisMounted(false) }
	}, [])

	return (
		<div>
			<div className="row">
				<div className="col-12">
					<Card Title="Dist. Plan de pagos">
						<Card.Body>
							<Card.Body.Content>

								<CForm
									getPlanPagosCredito={getPlanPagosCredito}
									state={state}
									isMounted={isMounted}
									oidc={props.oidc}
									FnAñadirAbono={FnAñadirAbono}
									FnGuardarPlanPagos={FnGuardarPlanPagos}
								/>
								<div className="columns is-centered is-mobile is-multiline">
									{state.Cargando && <Spinner />}
									{state.Error && <span>Error al cargar los datos...</span>}
									{(!state.Cargando && !state.Error) &&
										<DataGrid
											columns={Columns}
											density="compact"
											editMode="row"
											sx={{ marginY: '4vh' }}
											rows={state.Datos}
											getRowId={(row) => row["NoPago"]}
											disableColumnFilter
											processRowUpdate={processRowUpdate}
											onRowModesModelChange={handleRowModesModelChange}
											onProcessRowUpdateError={(e) => { console.log(e) }}
											rowModesModel={rowModesModel}
											isCellEditable={(params) => params.row.SaldoActualOriginal > 1 || params.row.isNew}
											isRowSelectable={(params) => params.row.SaldoActualOriginal > 1 || params.row.isNew}
											initialState={{
												pagination: {
													paginationModel: { pageSize: 25, page: 0 }
												},

											}}

											pageSizeOptions={[25, 50, 100]}
										/>
									}

									<DataTable
										columns={[
											{ selector: 'tipo', name: '' },
											{ selector: 'Capital', name: 'Capital' },
											{ selector: 'Interes', name: 'Interes' },
											{ selector: 'ManejoCuenta', name: 'Manejo Cuenta' },
											{ selector: 'Seguro', name: 'Seguro' },
											{ selector: 'Cargo', name: 'Cargo' },
											{ selector: 'IVA', name: 'IVA' },
											{ selector: 'Abonos', name: 'Abonos' },
											{ selector: 'SaldoActual', name: 'Saldo Actual' },
										]}
										data={[
											{ tipo: 'Sin modificar', ...state.Credito },
											{ tipo: 'Modificado', ...state.TotalesModificados },
										]}
										title={'Diferencias de saldos'}
									/>
								</div>
								<div className="is-flex is-justify-content-end">
									<button disabled={state.CargandoGuardado || state.Datos.length == 0} onClick={FnGuardarPlanPagos} className="btn btn-success waves-effect waves-light">
										<span className="">Guardar plan de pagos</span>&nbsp;<FaSave />
									</button>
								</div>
							</Card.Body.Content>
						</Card.Body>
					</Card>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state: IEstado) => ({
	oidc: state.oidc,
	iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(DistribucionPlanPagos)