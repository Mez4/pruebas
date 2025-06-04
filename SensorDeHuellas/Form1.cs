using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using libzkfpcsharp;
using System.Runtime.InteropServices;
using System.Threading;
using System.IO;
using Sample;
using System.Security.Cryptography;
using System.Net.Http;
using System.Drawing.Imaging;
using System.Collections;
using System.Net;
using System.Web;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Demo.Classes;
using System.Drawing.Drawing2D;
using System.Configuration;
using static System.Net.WebRequestMethods;
using System.Data.SqlTypes;

namespace Demo
{
    public partial class Form1 : Form
    {
        
        IntPtr mDevHandle = IntPtr.Zero;
        IntPtr mDBHandle = IntPtr.Zero;
        IntPtr FormHandle = IntPtr.Zero;
        bool bIsTimeToDie = false;
        bool IsRegister = false;
        bool bIdentify = true;
        byte[] FPBuffer;
        int RegisterCount = 0;
        int REGISTER_FINGER_COUNT = 3;

        byte[][] RegTmps = new byte[3][];
        byte[] RegTmp = new byte[2048];
        byte[] CapTmp = new byte[2048];
        int cbCapTmp = 2048;
        int cbRegTmp = 0;
        int iFid = 1;

        private ClientWebSocket _webSocket;
        private Uri _serverUri;

        private int mfpWidth = 0;
        private int mfpHeight = 0;

        string curp;
        int product;
        Int64 usuarioid=0;

        bool sent = false;

        const int MESSAGE_CAPTURED_OK = 0x0400 + 6;

        [DllImport("user32.dll", EntryPoint = "SendMessageA")]
        public static extern int SendMessage(IntPtr hwnd, int wMsg, IntPtr wParam, IntPtr lParam);

        public Form1(string[] args)
        {
            InitializeComponent();
            GetArgs(args);
            int ret = zkfperrdef.ZKFP_ERR_OK;
            for (int attempts =0 ; attempts < 5; attempts++)
            {
                
            if ((ret = zkfp2.Init()) == zkfperrdef.ZKFP_ERR_OK)
            {

                int nCount = zkfp2.GetDeviceCount();
                while (nCount == 0)
                {
                    zkfp2.Terminate();
                    MessageBox.Show("¡Dispositivo de huellas desconectado!");

                    nCount = zkfp2.GetDeviceCount();
                }
                textRes.Text = "Presione su huella en el escaner";


                if (IntPtr.Zero == (mDevHandle = zkfp2.OpenDevice(0)))
                {
                    MessageBox.Show("Dispositivo de huellas no encontrado, verifique que esté conectado correctamente", "Dispositivo de huellas no encontrado", MessageBoxButtons.RetryCancel, MessageBoxIcon.Warning);
                    return;
                }
                if (IntPtr.Zero == (mDBHandle = zkfp2.DBInit()))
                {
                    MessageBox.Show("Error al iniciar base de datos");
                    zkfp2.CloseDevice(mDevHandle);
                    mDevHandle = IntPtr.Zero;
                    return;
                }
                    attempts = 6;
                RegisterCount = 0;
                cbRegTmp = 0;
                iFid = 1;
                for (int i = 0; i < 3; i++)
                {
                    RegTmps[i] = new byte[2048];
                }
                byte[] paramValue = new byte[4];
                int size = 4;
                zkfp2.GetParameters(mDevHandle, 1, paramValue, ref size);
                zkfp2.ByteArray2Int(paramValue, ref mfpWidth);

                size = 4;
                zkfp2.GetParameters(mDevHandle, 2, paramValue, ref size);
                zkfp2.ByteArray2Int(paramValue, ref mfpHeight);

                FPBuffer = new byte[mfpWidth * mfpHeight];

                Thread captureThread = new Thread(new ThreadStart(DoCapture));
                captureThread.IsBackground = true;
                captureThread.Start();
                bIsTimeToDie = false;
                //textRes.Text = "Presiona el dedo indice 3 veces para el reconocimiento";

            }
            else
            {
                DialogResult response = MessageBox.Show("Dispositivo de huellas no encontrado, verifique que esté conectado correctamente", "Dispositivo de huellas no encontrado", MessageBoxButtons.RetryCancel, MessageBoxIcon.Warning);
                if (response.Equals(DialogResult.Retry) && attempts<4)
                {

                    Thread.Sleep(1000);
                }
                else
                {
                        attempts = 6;
                        Fingerprint post = new Fingerprint()
                        {
                            ArrayBits = RegTmp,
                            Image64 = "error",
                            Curp = curp,
                            ProductoID = product,
                            UsuarioRegistro = usuarioid
                        };


                        // Send the message to the WebSocket server

                        var formData = System.Text.Json.JsonSerializer.Serialize<Fingerprint>(post);
                        if (!sent)
                        {
                            WebSocketServer.SendMessageToClient(formData);
                        }
                        Thread.Sleep(1000);
                        Close();
                }
                
                
            }
                //MessageBox.Show(attempts.ToString());
            }
        }
        CurpResponse detailCurp;
        private void GetArgs(string[] args)
        {
            // Check if arguments were passed
            if (args.Length > 0)
            {
                // Get the full URL (cv://client=123&distributor=ABC&storeLocation=XYZ)
                string url = args[0];

                // Extract parameters from the URL
                Uri uri = new Uri(url);
                var queryParameters = HttpUtility.ParseQueryString(uri.Query);
                try
                {
                    // Get individual parameters
                    curp = queryParameters["curp"];

                    HttpClient httpCurp = new HttpClient();

                    var postCurp = new
                    {
                        Curp = curp
                    };


                    // Send the message to the WebSocket server

                    var formData = System.Text.Json.JsonSerializer.Serialize(postCurp);
                    HttpContent content = new StringContent(formData, System.Text.Encoding.UTF8, "application/json");


                    ServicePointManager.Expect100Continue = true;
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    // Skip validation of SSL/TLS certificate
                    ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                    textRes.Text = "ENVIANDO DATOS...";
                //https://localhost:5001/api/Distribuidores/SolicitudesPrestamosPersonales/lectorHuellaByCurp
                    HttpResponseMessage response = httpCurp.PostAsync($"https://{ConfigurationManager.AppSettings["url"]}/api/General/SensorHuellas/lectorHuellaByCurp", content).Result;


                    if (response.IsSuccessStatusCode)

                    {
                        textRes.Text = "DATOS ENVIADOS";
                        string responseStr = response.Content.ReadAsStringAsync().Result.ToString();

                        detailCurp = System.Text.Json.JsonSerializer.Deserialize<CurpResponse>(responseStr);
                        if (detailCurp.LectorHuellas)
                        {
                            textRes.Text = "Presiona el dedo índice";
                            REGISTER_FINGER_COUNT = 1;
                        }
                    }

                        product = int.Parse(queryParameters["productoid"]);
                    usuarioid = int.Parse(queryParameters["usuarioid"]);


                }
                catch (Exception ex)
                {
                    MessageBox.Show("Hubo un error al abrir el lector de huellas, intente nuevamente.", "Error en parámetros", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    Close();
                }
            }
            else
            {
                MessageBox.Show("Por favor abra este programa desde el navegador", "Acción no permitida", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Close();
            }
        }
        private void DoCapture()
        {
            while (!bIsTimeToDie)
            {
                cbCapTmp = 2048;
                int ret = zkfp2.AcquireFingerprint(mDevHandle, FPBuffer, CapTmp, ref cbCapTmp);
                if (ret == zkfp.ZKFP_ERR_OK)
                {
                    SendMessage(FormHandle, MESSAGE_CAPTURED_OK, IntPtr.Zero, IntPtr.Zero);
                }
                Thread.Sleep(200);
            }
        }
        protected override void WndProc(ref Message message)
        {
            const int WM_SYSCOMMAND = 0x0112;
            const int SC_MOVE = 0xF010;

            switch (message.Msg)
            {
                case WM_SYSCOMMAND:
                    int command = message.WParam.ToInt32() & 0xfff0;
                    if (command == SC_MOVE)
                        return;
                    break;
            }

            base.WndProc(ref message);
        }

        protected override void DefWndProc(ref Message m)
        {
            try
            {
                switch (m.Msg)
            {
                case MESSAGE_CAPTURED_OK:
                    {
                        


                            MemoryStream ms = new MemoryStream();
                            BitmapFormat.GetBitmap(FPBuffer, mfpWidth, mfpHeight, ref ms);
                            Bitmap bmp = new Bitmap(ms);
                            this.picFPImg.Image = bmp;


                            int retMsj = zkfp.ZKFP_ERR_OK;
                            int fid = 0, score = 0;
                            var identify = zkfp2.DBIdentify(mDBHandle, CapTmp, ref fid, ref score);


                            if (RegisterCount > 0 && zkfp2.DBMatch(mDBHandle, CapTmp, RegTmps[RegisterCount - 1]) <= 0)
                            {
                                textRes.Text = "Presiona el dedo índice 3 veces para el reconocimiento";
                                return;
                            }
                            
                            Array.Copy(CapTmp, RegTmps[RegisterCount], cbCapTmp);
                            String strBase64 = zkfp2.BlobToBase64(CapTmp, cbCapTmp);
                            byte[] blob = zkfp2.Base64ToBlob(strBase64);
                            RegisterCount++;

                            if (RegisterCount >= REGISTER_FINGER_COUNT)
                            {
                                int combineHuellas;
                                if (detailCurp.LectorHuellas)
                                {
                                    combineHuellas = (retMsj = zkfp2.DBMerge(mDBHandle, RegTmps[0], RegTmps[0], RegTmps[0], RegTmp, ref cbRegTmp));
                                }
                                else
                                {
                                    combineHuellas = (retMsj = zkfp2.DBMerge(mDBHandle, RegTmps[0], RegTmps[1], RegTmps[2], RegTmp, ref cbRegTmp));
                                }
                                
                                if (zkfp.ZKFP_ERR_OK == combineHuellas &&
                                        zkfp.ZKFP_ERR_OK == (retMsj = zkfp2.DBAdd(mDBHandle, iFid, RegTmp)))
                                {

                                    textRes.Text = "GUARDANDO DATOS...";
                                    try
                                    {
                                        iFid++;
                                        HttpClient http = new HttpClient();

                                        MemoryStream ms1 = new MemoryStream();

                                        bmp.Save(ms1, ImageFormat.Bmp);
                                        byte[] imageBytes = RegTmp;
                                        string base64String = Convert.ToBase64String(imageBytes);
                                        

                                       

                                        Fingerprint post = new Fingerprint()
                                        {
                                            ArrayBits = RegTmp,
                                            Image64 = "",
                                            Curp = curp,
                                            ProductoID = product,
                                            UsuarioRegistro = usuarioid
                                        };


                                        // Send the message to the WebSocket server

                                        var formData = System.Text.Json.JsonSerializer.Serialize<Fingerprint>(post);
                                        HttpContent content = new StringContent(formData, System.Text.Encoding.UTF8, "application/json");
                                        

                                        ServicePointManager.Expect100Continue = true;
                                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                                        // Skip validation of SSL/TLS certificate
                                        ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                                        textRes.Text = "ENVIANDO DATOS...";
                                        HttpResponseMessage response = http.PostAsync($"https://{ConfigurationManager.AppSettings["url"]}/api/General/SensorHuellas/registrar", content).Result;
                                        
                                        if (response.IsSuccessStatusCode)

                                        {
                                            textRes.Text = "DATOS ENVIADOS";
                                            string responseStr = response.Content.ReadAsStringAsync().Result.ToString();

                                            ApiResponse detailMsj = System.Text.Json.JsonSerializer.Deserialize<ApiResponse>(responseStr);
                                            if (detailMsj.code == 1)
                                            {
                                                byte[] huellaGuardada = detailMsj.data.ArrayBits;
                                                textRes.Text = "COMPARANDO HUELLAS...";
                                                int isSame = zkfp2.DBIdentify(mDBHandle, huellaGuardada, ref fid, ref score);

                                                if (zkfp.ZKFP_ERR_OK == isSame)
                                                {
                                                    textRes.Text = "USUARIO YA EXISTENTE";




                                                    RegisterCount = 0;
                                                    textRes.Text = "" + detailMsj.msj;
                                                    sent = true;
                                                    // Check if message is not empt

                                                    Console.WriteLine("Mandando: ");

                                                    WebSocketServer.SendMessageToClient(System.Text.Json.JsonSerializer.Serialize(detailMsj));
                                                    Thread.Sleep(1000);
                                                    Close();
                                                }
                                                else
                                                {
                                                    textRes.Text = "LAS HUELLAS NO COINCIDEN \n Vuelva a intentar";
                                                    RegisterCount = 0;
                                                    base.DefWndProc(ref m);
                                                }

                                            }
                                            else
                                            {
                                                textRes.Text = detailMsj.msj;
                                                sent = true;

                                                WebSocketServer.SendMessageToClient(System.Text.Json.JsonSerializer.Serialize(detailMsj));
                                                Thread.Sleep(1000);
                                                 Close();
                                            }


                                        }
                                        else
                                        {
                                            string errorBody = response.Content.ReadAsStringAsync().Result;
                                            var detailErr = System.Text.Json.JsonSerializer.Deserialize<ApiResponse>(errorBody);

                                            textRes.Text = detailErr != null ? detailErr.msj : "HA HABIDO UN ERROR ERR: -99";
                                            if (detailErr.code == 0)
                                            {

                                                RegisterCount = 0;
                                                base.DefWndProc(ref m);
                                            }
                                            else
                                            {
                                                RegisterCount--;
                                            }
                                        }
                                    }
                                    catch (Exception ex)
                                    {
                                        MessageBox.Show(ex.Message);
                                    }
                                }
                                else
                                {
                                    textRes.Text = "enroll fail, error code=" + retMsj;
                                }
                                IsRegister = false;
                                return;
                            }
                            else
                            {
                                textRes.Text = "Presiona " + (REGISTER_FINGER_COUNT - RegisterCount) + " veces más la huella en el lector";
                            }
                        
                    }
                    break;

                default:
                    base.DefWndProc(ref m);
                    break;
            }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            FormHandle = this.Handle;
            Task.Run(() => WebSocketServer.StartServer());
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            Fingerprint post = new Fingerprint()
            {
                ArrayBits = RegTmp,
                Image64 = "error",
                Curp = curp,
                ProductoID = product,
                UsuarioRegistro = usuarioid
            };


            // Send the message to the WebSocket server

            var formData = System.Text.Json.JsonSerializer.Serialize<Fingerprint>(post);
            if (!sent)
            {
                WebSocketServer.SendMessageToClient(formData);
                WebSocketServer.Close("error");
            }
            else
            {
                WebSocketServer.Close("normal");
            }
            
        }
    }

    class ApiResponse
    {
        public string msj { get; set; }
        public int code { set; get; }
        public Fingerprint data { set; get; }
    }
    class CurpResponse{
        public bool LectorHuellas {  get; set; }
    }

    class Fingerprint
    {
        public int PersonaID {  get; set; }
        public DateTime FechaRegistro { get; set; }
        public byte[] ArrayBits { get; set; }
        public string Image64 { get; set; }
        public Int64 UsuarioRegistro { set; get; }

        public string Curp { get; set; }

        public int ProductoID { set; get; }

        public int SucursalID { set; get; }
    }
    class CurpClass
    {
        public string Curp { set; get; }
    }
}
