using System;
using System.Text;
using System.Diagnostics; //Método de Debugusing System.Text.Json;
using System.Security.Cryptography.X509Certificates;
using System.Security.Cryptography;
using System.Net;

namespace registraOrden
{
    class CryptoHandler
    {
        public String firmaConsultaConciliacionV2(string tipoConsulta, int fecha)
        {

            string strData = "||EMPRENDEDORES_C|" + tipoConsulta + "|" + fecha + "||";

            Debug.WriteLine("Firma para conciliacion!");
            return EncriptacionV2(strData); ;

        }
        public String firmaConsultaConciliacionV2(string tipoConsulta)
        {

            string strData = "||EMPRENDEDORES_C|" + tipoConsulta + "|||";

            Debug.WriteLine("Firma para conciliacion!");
            return EncriptacionV2(strData); ;

        }
        public String firmaConsultaConciliacion(string tipoConsulta)
        {
            string strData = "||EMPRENDEDORES_C|" + tipoConsulta + "|||";
            Debug.WriteLine("Firma para conciliacion!");
            return EncriptacionV2(strData); ;

        }
        public String firmaSaldoCuentaOrdenante(string cuentaOrdenante)
        {
            string strData = cuentaOrdenante;
            Debug.WriteLine("Cuenta ordenante!");
            return EncriptacionV2(strData);
        }

        public String firmaBuscarXRastreo(string claveRastreo, int fechaOp, string empresa)
        {
            string strData = "|||" + empresa + "|" + fechaOp + "||" + claveRastreo + "|90646||||||||||||||||||||||||||||||";
            Debug.WriteLine(EncriptacionV2(strData));
            Debug.WriteLine("Cadena clave rastreo!");
            return EncriptacionV2(strData); ;

        }
        public String firmaHistoricoFecha(string empresa, int Fecha)
        {
            string strData = "|||" + empresa + "|" + Fecha + "|||||||||||||||||||||||||||||||||";
            Debug.WriteLine("Cadena fecha historico!");
            return EncriptacionV2(strData); ;
        }

        public String firmaHistorico(string empresa)
        {
            string strData = "|||" + empresa + "||||||||||||||||||||||||||||||||||";
            Debug.WriteLine("Cadena operativo!");
            return strData;
        }
        public String firma(String cadena)
        {
            string strData = cadena;
            Debug.WriteLine("Success!");
            return EncriptacionV2(strData); ;
        }

        public string EncriptacionV2(string cadenaOriginal)
        {
            string hostname = Dns.GetHostName();
            var ruta = "";
            ruta = hostname == "pop-os" ? "/home/leordzx/Downloads/llavePrivada-OLD.pfx" : "C:/sitiosIndicadores/llavePrivada_STP/llavePrivada.pfx";
            var password = "Triforc3$$.";
            var certificate2Collection = new X509Certificate2Collection();
            certificate2Collection.Import(ruta, password, X509KeyStorageFlags.DefaultKeySet);
            var privateKey = certificate2Collection[0].GetRSAPrivateKey();
            var signature = privateKey.SignData(Encoding.UTF8.GetBytes(cadenaOriginal), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
            var cadena = Convert.ToBase64String(signature);
            return cadena;
        }
        public String cadenaOriginal(OrdenPagoWS oPW)
        {
            StringBuilder sB = new StringBuilder();
            sB.Append("||");
            sB.Append(oPW.getInstitucionContraparte()).Append("|");
            sB.Append(oPW.getEmpresa()).Append("|");
            sB.Append(Convert.ToString(oPW.getFechaOperacion()) == null ? "" : oPW.getFechaOperacion()).Append("|");
            sB.Append(oPW.getFolioOrigen() == null ? "" : oPW.getFolioOrigen()).Append("|");
            sB.Append(oPW.getClaveRastreo() == null ? "" : oPW.getClaveRastreo()).Append("|");
            sB.Append(oPW.getInstitucionOperante() == 0 ? "" : oPW.getInstitucionOperante()).Append("|");
            sB.Append(String.Equals(oPW.getMonto(), "0") ? "" : oPW.getMonto()).Append("|");
            sB.Append(oPW.getTipoPago() == 0 ? "" : oPW.getTipoPago()).Append("|");
            sB.Append(oPW.getTipoCuentaOrdenante() == 0 ? "" : oPW.getTipoCuentaOrdenante()).Append("|");
            sB.Append(oPW.getNombreOrdenante() == null ? "" : oPW.getNombreOrdenante()).Append("|");
            sB.Append(oPW.getCuentaOrdenante() == null ? "" : oPW.getCuentaOrdenante()).Append("|");
            sB.Append(oPW.getRfcCurpOrdenante() == null ? "" : oPW.getRfcCurpOrdenante()).Append("|");
            sB.Append(oPW.getTipoCuentaBeneficiario() == 0 ? "" : oPW.getTipoCuentaBeneficiario()).Append("|");
            sB.Append(oPW.getNombreBeneficiario() == null ? "" : oPW.getNombreBeneficiario()).Append("|");
            sB.Append(oPW.getCuentaBeneficiario() == null ? "" : oPW.getCuentaBeneficiario()).Append("|");
            sB.Append(oPW.getRfcCurpBeneficiario() == null ? "" : oPW.getRfcCurpBeneficiario()).Append("|");
            sB.Append(oPW.getEmailBeneficiario() == null ? "" : oPW.getEmailBeneficiario()).Append("|");
            sB.Append(oPW.getTipoCuentaBeneficiario2() == 0 ? "" : oPW.getTipoCuentaBeneficiario2()).Append("|");
            sB.Append(oPW.getNombreBeneficiario2() == null ? "" : oPW.getNombreBeneficiario2()).Append("|");
            sB.Append(oPW.getCuentaBeneficiario2() == null ? "" : oPW.getCuentaBeneficiario2()).Append("|");
            sB.Append(oPW.getRfcCurpBeneficiario2() == null ? "" : oPW.getRfcCurpBeneficiario2()).Append("|");
            sB.Append(oPW.getConceptoPago() == null ? "" : oPW.getConceptoPago()).Append("|");
            sB.Append(oPW.getConceptoPago2() == null ? "" : oPW.getConceptoPago2()).Append("|");
            sB.Append(oPW.getClaveCatUsuario1() == null ? "" : oPW.getClaveCatUsuario1()).Append("|");
            sB.Append(oPW.getClaveCatUsuario2() == null ? "" : oPW.getClaveCatUsuario2()).Append("|");
            sB.Append(oPW.getClavePago() == null ? "" : oPW.getClavePago()).Append("|");
            sB.Append(oPW.getReferenciaCobranza() == null ? "" : oPW.getReferenciaCobranza()).Append("|");
            sB.Append(oPW.getReferenciaNumerica() == 0 ? "" : oPW.getReferenciaNumerica()).Append("|");
            sB.Append(oPW.getTipoOperacion() == 0 ? "" : oPW.getTipoOperacion()).Append("|");
            sB.Append(oPW.getTopologia() == null ? "" : oPW.getTopologia()).Append("|");
            sB.Append(oPW.getUsuario() == null ? "" : oPW.getUsuario()).Append("|");
            sB.Append(oPW.getMedioEntrega() == 0 ? "" : oPW.getMedioEntrega()).Append("|");
            sB.Append(oPW.getPrioridad() == 0 ? "" : oPW.getPrioridad()).Append("|");
            sB.Append(oPW.getIva() == 0 ? "" : oPW.getIva()).Append("||");
            String cadena = sB.ToString();
            Console.WriteLine("Cadena original: " + cadena);
            return new CryptoHandler().firma(cadena);
        }
    }
}