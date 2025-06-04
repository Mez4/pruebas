export const arrayCorte08 = [
    
    { name: 'Zona Id', selector: 'ZonaID', sortable: false, center: true
    },
    { name: 'Zona', selector: 'Zona', sortable: false, center: true },
    {
        name: 'Sucursal', selector: 'Sucursal', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Sucursal}</span>
    },
    {
        name: 'Coordinador', selector: 'Coordinador', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Coordinador}</span>
    },
    {
        name: 'Socia ID', selector: 'DistribuidorID', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.DistribuidorID}</span>
    },
    {
        name: 'Socia', selector: 'Distribuidor', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Distribuidor}</span>
    },
    {
        name: 'Dias Atraso', selector: 'DiasAtraso', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.DiasAtraso}</span>
    },
    {
        name: 'Saldo Atrasado', selector: 'SaldoAtrasado', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.SaldoAtrasado.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Vencido al corte', selector: 'VencidoCorte', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.VencidoCorte.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Bonificación', selector: 'Bonificacion', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Bonificacion.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pagos', selector: 'Pagos', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Pagos.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 09', selector: 'Dia01', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia01.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 10', selector: 'Dia02', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia02.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 11', selector: 'Dia03', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia03.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 12', selector: 'Dia04', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia04.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 13', selector: 'Dia05', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia05.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 14', selector: 'Dia06', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia06.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 15', selector: 'Dia07', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia07.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 16', selector: 'Dia08', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia08.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 17', selector: 'Dia09', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia09.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 18', selector: 'Dia10', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia10.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 19', selector: 'Dia11', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia11.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 20', selector: 'Dia12', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia12.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 21', selector: 'Dia13', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia13.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 22', selector: 'Dia14', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia14.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 23', selector: 'Dia15', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia15.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pactado', selector: 'Pactado', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Pactado?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
   /* {
        name: 'Pagos Antes', selector: 'PagosAntes', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.PagosAntes.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pagos Despues', selector: 'PagosDespues', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.PagosDespues.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },*/
    {
        name: 'Anticipada', selector: 'Anticipada', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Anticipada.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Puntual', selector: 'Puntual', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Puntual.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Tardía', selector: 'Tardia', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Tardia.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Final', selector: 'Final', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Final.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pendiente', sortable: false, center: true, cell: (props) =>
        <span style={{ textAlign: "center" }}>{((props.Anticipada + props.Puntual + props.Tardia + props.Final) - props.Pactado) < 0 ? (((props.Anticipada + props.Puntual + props.Tardia + props.Final) - props.Pactado) * -1).toLocaleString('en-US', { style: 'currency', currency: 'USD', }) : ((props.Anticipada + props.Puntual + props.Tardia + props.Final) - props.Pactado).toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    }
]

export const arrayCorte23 = [
    { name: 'Zona Id', selector: 'ZonaID', sortable: false, center: true },
    { name: 'Zona', selector: 'Zona', sortable: false, center: true },
    {
        name: 'Sucursal', selector: 'Sucursal', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Sucursal}</span>
    },
    {
        name: 'Coordinador', selector: 'Coordinador', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Coordinador}</span>
    },
    {
        name: 'Socia ID', selector: 'DistribuidorID', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.DistribuidorID}</span>
    },
    {
        name: 'Socia', selector: 'Distribuidor', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Distribuidor}</span>
    },
    {
        name: 'Días Atraso', selector: 'DiasAtraso', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.DiasAtraso}</span>
    },
    {
        name: 'Saldo Atrasado', selector: 'SaldoAtrasado', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.SaldoAtrasado.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Vencido al corte', selector: 'VencidoCorte', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.VencidoCorte.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Bonificación', selector: 'Bonificacion', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Bonificacion.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pagos', selector: 'Pagos', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Pagos.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 24', selector: 'Dia01', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia01.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 25', selector: 'Dia02', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia02.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 26', selector: 'Dia03', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia03.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 27', selector: 'Dia04', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia04.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 28', selector: 'Dia05', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia05.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 29', selector: 'Dia06', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia06.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 30/31', selector: 'Dia07', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia07.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 01', selector: 'Dia08', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia08.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 02', selector: 'Dia09', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia09.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 03', selector: 'Dia10', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia10.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 04', selector: 'Dia11', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia11.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 05', selector: 'Dia12', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia12.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 06', selector: 'Dia13', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia13.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 07', selector: 'Dia14', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia14.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Día 08', selector: 'Dia15', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Dia15.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pactado', selector: 'Pactado', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Pactado?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    /*{
        name: 'Pagos Antes', selector: 'PagosAntes', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.PagosAntes.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pagos Despues', selector: 'PagosDespues', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.PagosDespues.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },*/
    {
        name: 'Anticipada', selector: 'Anticipada', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Anticipada.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Puntual', selector: 'Puntual', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Puntual.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Tardia', selector: 'Tardia', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Tardia.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Final', selector: 'Final', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{props.Final.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    },
    {
        name: 'Pendiente', selector: 'PFinal', sortable: false, center: true, cell: (props) =>
            <span style={{ textAlign: "center" }}>{((props.Anticipada + props.Puntual + props.Tardia + props.Final) - props.Pactado) < 0 ? (((props.Anticipada + props.Puntual + props.Tardia + props.Final) - props.Pactado) * -1).toLocaleString('en-US', { style: 'currency', currency: 'USD', }) : ((props.Anticipada + props.Puntual + props.Tardia + props.Final) - props.Pactado).toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
    }
]
