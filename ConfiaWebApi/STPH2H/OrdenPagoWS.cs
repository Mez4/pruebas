using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace registraOrden
{
    public class OrdenPagoWS
    {
        protected int causaDevolucion;
        protected String claveCatUsuario1;
        protected String claveCatUsuario2;
        protected String clavePago;
        protected String claveRastreo;
        protected String claveRastreoDevolucion;
        protected String conceptoPago;
        protected String conceptoPago2;
        protected String cuentaBeneficiario;
        protected String cuentaBeneficiario2;
        protected String cuentaOrdenante;
        protected int digitoIdentificadorBeneficiario;
        protected int digitoIdentificadorOrdenante;
        protected String emailBeneficiario;
        protected String empresa;
        protected String error;
        protected String estado;
        protected String fechaLimitePago;
        protected int fechaOperacion;
        protected String firma;
        protected String folioOrigen;
        protected String folioPlataforma;
        protected String idCliente;
        protected int idEF;
        protected int institucionContraparte;
        protected int institucionOperante;
        protected decimal iva;
        protected int medioEntrega;
        protected String monto;
        protected decimal montoComision;
        protected decimal montoInteres;
        protected decimal montoOriginal;
        protected String nombreBeneficiario;
        protected String nombreBeneficiario2;
        protected String nombreOrdenante;
        protected String numCelularBeneficiario;
        protected String numCelularOrdenante;
        protected int pagoComision;
        protected int prioridad;
        protected String referenciaCobranza;
        protected int referenciaNumerica;
        protected int reintentos;
        protected String rfcCurpBeneficiario;
        protected String rfcCurpBeneficiario2;
        protected String rfcCurpOrdenante;
        protected String serieCertificado;
        protected String swift1;
        protected String swift2;
        protected int tipoCuentaBeneficiario;
        protected int tipoCuentaBeneficiario2;
        protected int tipoCuentaOrdenante;
        protected int tipoOperacion;
        protected int tipoPago;
        protected String topologia;
        protected Int64 tsAcuseBanxico;
        protected Int64 tsAcuseConfirmacion;
        protected Int64 tsCaptura;
        protected Int64 tsConfirmacion;
        protected Int64 tsDevolucion;
        protected Int64 tsDevolucionRecibida;
        protected Int64 tsEntrega;
        protected Int64 tsLiquidacion;
        protected String uetr;
        protected String usuario;

        //Utilizando la parte de encapsulamiento, sabemos que los atributos no los podemos ver fuera de la clase, por lo tanto se realizaron métodos Getters, todos son métodos Getters
        //Metodo GETTER para imprimir en Main
        public int getCausaDevolucion()
        {
            return causaDevolucion;
        }
        //Método SETTER para signar las variables en Main
        public void setCausaDevolucion(int value)
        {
            this.causaDevolucion = value;
        }
        //Nota: Todos los campos hacen uso de un método SETTER y GETTER
        public String getClaveCatUsuario1()
        {
            return claveCatUsuario1;
        }
        public void setClaveCatUsuario1(String value)
        {
            this.claveCatUsuario1 = value;
        }
        public String getClaveCatUsuario2()
        {
            return claveCatUsuario2;
        }
        public void setClaveCatUsuario2(String value)
        {
            this.claveCatUsuario2 = value;
        }
        public String getClavePago()
        {
            return clavePago;
        }
        public void setClavePago(String value)
        {
            this.clavePago = value;
        }
        public String getClaveRastreo()
        {
            return claveRastreo;
        }
        public void setClaveRastreo(String value)
        {
            this.claveRastreo = value;
        }
        public String getClaveRastreoDevolucion()
        {
            return claveRastreoDevolucion;
        }
        public void setClaveRastreoDevolucion(String value)
        {
            this.claveRastreoDevolucion = value;
        }
        public String getConceptoPago()
        {
            return conceptoPago;
        }
        public void setConceptoPago(String value)
        {
            this.conceptoPago = value;
        }
        public String getConceptoPago2()
        {
            return conceptoPago2;
        }
        public void setConceptoPago2(String value)
        {
            this.conceptoPago2 = value;
        }
        public String getCuentaBeneficiario()
        {
            return cuentaBeneficiario;
        }
        public void setCuentaBeneficiario(String value)
        {
            this.cuentaBeneficiario = value;
        }
        public String getCuentaBeneficiario2()
        {
            return cuentaBeneficiario2;
        }
        public void setCuentaBeneficiario2(String value)
        {
            this.cuentaBeneficiario2 = value;
        }
        public String getCuentaOrdenante()
        {
            return cuentaOrdenante;
        }
        public void setCuentaOrdenante(String value)
        {
            this.cuentaOrdenante = value;
        }
        public int getDigitoIdentificadorBeneficiario()
        {
            return digitoIdentificadorBeneficiario;
        }
        public void setDigitoIdentificadorBeneficiario(int value)
        {
            this.digitoIdentificadorBeneficiario = value;
        }
        public int getDigitoIdentificadorOrdenante()
        {
            return digitoIdentificadorOrdenante;
        }
        public void setDigitoIdentificadorOrdenante(int value)
        {
            this.digitoIdentificadorOrdenante = value;
        }
        public String getEmailBeneficiario()
        {
            return emailBeneficiario;
        }
        public void setEmailBeneficiario(String value)
        {
            this.emailBeneficiario = value;
        }
        public String getEmpresa()
        {
            return empresa;
        }
        public void setEmpresa(String value)
        {
            this.empresa = value;
        }
        public String getError()
        {
            return error;
        }
        public void setError(String value)
        {
            this.error = value;
        }
        public String getEstado()
        {
            return estado;
        }
        public void setEstado(String value)
        {
            this.estado = value;
        }
        public String getFechaLimitePago()
        {
            return fechaLimitePago;
        }
        public void setFechaLimitePago(String value)
        {
            this.fechaLimitePago = value;
        }
        public int getFechaOperacion()
        {
            return fechaOperacion;
        }
        public void setFechaOperacion(int value)
        {
            this.fechaOperacion = value;
        }
        public String getFirma()
        {
            return firma;
        }
        public void setFirma(String value)
        {
            this.firma = value;
        }
        public String getFolioOrigen()
        {
            return folioOrigen;
        }
        public void setFolioOrigen(String value)
        {
            this.folioOrigen = value;
        }
        public String getFolioPlataforma()
        {
            return folioPlataforma;
        }
        public void setFolioPlataforma(String value)
        {
            this.folioPlataforma = value;
        }
        public String getIdCliente()
        {
            return idCliente;
        }
        public void setIdCliente(String value)
        {
            this.idCliente = value;
        }
        public int getIdEF()
        {
            return idEF;
        }
        public void setIdEF(int value)
        {
            this.idEF = value;
        }
        public int getInstitucionContraparte()
        {
            return institucionContraparte;
        }
        public void setInstitucionContraparte(int value)
        {
            this.institucionContraparte = value;
        }
        public int getInstitucionOperante()
        {
            return institucionOperante;
        }
        public void setInstitucionOperante(int value)
        {
            this.institucionOperante = value;
        }
        public decimal getIva()
        {
            return iva;
        }
        public void setIva(decimal value)
        {
            this.iva = value;
        }
        public int getMedioEntrega()
        {
            return medioEntrega;
        }
        public void setMedioEntrega(int value)
        {
            this.medioEntrega = value;
        }
        public String getMonto()
        {
            return monto;
        }
        public void setMonto(String value)
        {
            this.monto = value;
        }
        public decimal getMontoComision()
        {
            return montoComision;
        }
        public void setMontoComision(decimal value)
        {
            this.montoComision = value;
        }
        public decimal getMontoInteres()
        {
            return montoInteres;
        }
        public void setMontoInteres(decimal value)
        {
            this.montoInteres = value;
        }
        public decimal getMontoOriginal()
        {
            return montoOriginal;
        }
        public void setMontoOriginal(decimal value)
        {
            this.montoOriginal = value;
        }
        public String getNombreBeneficiario()
        {
            return nombreBeneficiario;
        }
        public void setNombreBeneficiario(String value)
        {
            this.nombreBeneficiario = value;
        }
        public String getNombreBeneficiario2()
        {
            return nombreBeneficiario2;

        }
        public void setNombreBeneficiario2(String value)
        {
            this.nombreBeneficiario2 = value;
        }
        public String getNombreOrdenante()
        {
            return nombreOrdenante;
        }
        public void setNombreOrdenante(String value)
        {
            this.nombreOrdenante = value;
        }
        public String getNumCelularBeneficiario()
        {
            return numCelularBeneficiario;
        }
        public void setNumCelularBeneficiario(String value)
        {
            this.numCelularBeneficiario = value;
        }
        public String getNumCelularOrdenante()
        {
            return numCelularOrdenante;
        }
        public void setNumCelularOrdenante(String value)
        {
            this.numCelularOrdenante = value;
        }
        public int getPagoComision()
        {
            return pagoComision;
        }
        public void setPagoComision(int value)
        {
            this.pagoComision = value;
        }
        public int getPrioridad()
        {
            return prioridad;
        }
        public void setPrioridad(int value)
        {
            this.prioridad = value;
        }
        public String getReferenciaCobranza()
        {
            return referenciaCobranza;
        }
        public void setReferenciaCobranza(String value)
        {
            this.referenciaCobranza = value;
        }
        public int getReferenciaNumerica()
        {
            return referenciaNumerica;
        }
        public void setReferenciaNumerica(int value)
        {
            this.referenciaNumerica = value;
        }
        public int getReintentos()
        {
            return reintentos;
        }
        public void setReintentos(int value)
        {
            this.reintentos = value;
        }
        public String getRfcCurpBeneficiario()
        {
            return rfcCurpBeneficiario;
        }
        public void setRfcCurpBeneficiario(String value)
        {
            this.rfcCurpBeneficiario = value;
        }
        public String getRfcCurpBeneficiario2()
        {
            return rfcCurpBeneficiario2;
        }
        public void setRfcCurpBeneficiario2(String value)
        {
            this.rfcCurpBeneficiario2 = value;
        }
        public String getRfcCurpOrdenante()
        {
            return rfcCurpOrdenante;
        }
        public void setRfcCurpOrdenante(String value)
        {
            this.rfcCurpOrdenante = value;
        }
        public String getSerieCertificado()
        {
            return serieCertificado;
        }
        public void setSerieCertificado(String value)
        {
            this.serieCertificado = value;
        }
        public String getSwift1()
        {
            return swift1;
        }
        public void setSwift1(String value)
        {
            this.swift1 = value;
        }
        public String getSwift2()
        {
            return swift2;
        }
        public void setSwift2(String value)
        {
            this.swift2 = value;
        }
        public int getTipoCuentaBeneficiario()
        {
            return tipoCuentaBeneficiario;
        }
        public void setTipoCuentaBeneficiario(int value)
        {
            this.tipoCuentaBeneficiario = value;
        }
        public int getTipoCuentaBeneficiario2()
        {
            return tipoCuentaBeneficiario2;
        }
        public void setTipoCuentaBeneficiario2(int value)
        {
            this.tipoCuentaBeneficiario2 = value;
        }
        public int getTipoCuentaOrdenante()
        {
            return tipoCuentaOrdenante;
        }
        public void setTipoCuentaOrdenante(int value)
        {
            this.tipoCuentaOrdenante = value;
        }
        public int getTipoOperacion()
        {
            return tipoOperacion;
        }
        public void setTipoOperacion(int value)
        {
            this.tipoOperacion = value;
        }
        public int getTipoPago()
        {
            return tipoPago;
        }
        public void setTipoPago(int value)
        {
            this.tipoPago = value;
        }
        public String getTopologia()
        {
            return topologia;
        }
        public void setTopologia(String value)
        {
            this.topologia = value;
        }
        public Int64 getTsAcuseBanxico()
        {
            return tsAcuseBanxico;
        }
        public void setTsAcuseBanxico(Int64 value)
        {
            this.tsAcuseBanxico = value;
        }
        public Int64 getTsAcuseConfirmacion()
        {
            return tsAcuseConfirmacion;
        }
        public void setTsAcuseConfirmacion(Int64 value)
        {
            this.tsAcuseConfirmacion = value;
        }
        public Int64 getTsCaptura()
        {
            return tsCaptura;
        }
        public void setTsCaptura(Int64 value)
        {
            this.tsCaptura = value;
        }
        public Int64 getTsConfirmacion()
        {
            return tsConfirmacion;
        }
        public void setTsConfirmacion(Int64 value)
        {
            this.tsConfirmacion = value;
        }
        public Int64 getTsDevolucion()
        {
            return tsDevolucion;
        }
        public void setTsDevolucion(Int64 value)
        {
            this.tsDevolucion = value;
        }
        public Int64 getTsDevolucionRecibida()
        {
            return tsDevolucionRecibida;
        }
        public void setTsDevolucionRecibida(Int64 value)
        {
            this.tsDevolucionRecibida = value;
        }
        public Int64 getTsEntrega()
        {
            return tsEntrega;
        }
        public void setTsEntrega(Int64 value)
        {
            this.tsEntrega = value;
        }
        public Int64 getTsLiquidacion()
        {
            return tsLiquidacion;
        }
        public void setTsLiquidacion(Int64 value)
        {
            this.tsLiquidacion = value;
        }
        public String getUetr()
        {
            return uetr;
        }
        public void setUetr(String value)
        {
            this.uetr = value;
        }
        public String getUsuario()
        {
            return usuario;
        }
        public void setUsuario(String value)
        {
            this.usuario = value;
        }
    }
}