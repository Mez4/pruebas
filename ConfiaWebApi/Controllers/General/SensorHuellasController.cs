using DBContext.DBConfia;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using libzkfpcsharp;
using System.IO;
using System.Threading;
using System.Runtime.InteropServices;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    // [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class SensorHuellasController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private IntPtr _deviceHandle;
        private IntPtr _dbHandle;

        const int FP_IMAGE_WIDTH = 2048;
        const int FP_IMAGE_HEIGHT = 2048;


        public SensorHuellasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
            // zkfp2.Init();
            // _deviceHandle = zkfp2.OpenDevice(0); // Abre el primer dispositivo
            // _dbHandle = zkfp2.DBInit();
        }

        // [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("registrar")]
        public async Task<IActionResult> Registrar(ConfiaWebApi.PeticionesRest.SOMA.HuellasDigitales.Post parData)
        {
            try
            {
                parData.SucursalID = 0;
                string getFinger = "EXEC Sistema.pa_GetHuellaDigital @Curp,@ProductoID,@SucursalID";
                var huella = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.General.HuellasDigitales.ValidarHuellas>(getFinger, parData).ToArrayAsync();

                if (huella.Length > 0)
                {
                    return Ok(new
                    {
                        msj = "USUARIO YA EXISTENTE",
                        data = huella[0],
                        code = 1
                    });

                }

                string storeFinger = "EXEC Sistema.pa_GuardarHuellasDigitales @ProductoID,@SucursalID,@UsuarioRegistro,@Curp,@ArrayBits";

                var spData = new
                {
                    ProductoID = parData.ProductoID,
                    SucursalID = parData.SucursalID,
                    UsuarioRegistro = parData.UsuarioRegistro,
                    Curp = parData.Curp,
                    ArrayBits = parData.ArrayBits
                };
                var resS = await DBContext.database.QueryAsync<dynamic>(storeFinger, spData).FirstOrDefaultAsync();
                await DBContext.Destroy();

                zkfp2.Terminate();
                return Ok(new
                {
                    msj = "PERSONA REGISTRADA CORRECTAMENTE",
                    data = resS,
                    code = 0
                });
            }
            catch (Exception ex)
            {
                zkfp2.Terminate();
                await DBContext.Destroy();
                return BadRequest(new
                {
                    msj = "HA HABIDO UN ERROR EX: " + ex.Message,
                    data = new { },
                    code = -2
                });
            }
        }
        [HttpGet]
        [Route("leerHuella")]
        public async Task<IActionResult> LeerHuella(ConfiaWebApi.PeticionesRest.SOMA.HuellasDigitales.ValidarHuellaVsBD parData)
        {
            try
            {
                parData.SucursalID = 2;
                string getFinger = "EXEC Sistema.pa_GetHuellaDigital @Curp,@ProductoID,@SucursalID";
                var huella = await DBContext.database
                    .QueryAsync<ConfiaWebApi.ModlesSP.General.HuellasDigitales.ValidarHuellas>(getFinger, parData)
                    .ToArrayAsync();

                if (huella.Length == 0 || huella[0].ArrayBits == null || huella[0].ArrayBits.Length == 0)
                {
                    return Ok(new { msj = "NO SE ENCONTRARON HUELLAS", data = new { }, code = 1 });
                }

                if (string.IsNullOrEmpty(parData.Image64))
                {
                    return Ok(new { msj = "NO SE ENCONTRÓ HUELLA ENVIADA", data = new { }, code = 1 });
                }

                // Convertir base64 a byte[]
                byte[] huellaEntrada = HexStringToByteArray(parData.Image64);
                byte[] huellaBD = huella[0].ArrayBits;



                // Inicializar base de datos biométrica
                IntPtr mDBHandle = IntPtr.Zero;
                if (IntPtr.Zero == (mDBHandle = zkfp2.DBInit()))
                {
                    return BadRequest(new { msj = "No se pudo inicializar la base de datos biométrica.", data = new { }, code = -3 });

                }

                // Comparar huellas
                int matchResult = zkfp2.DBMatch(mDBHandle, huellaEntrada, huellaBD);

                // Liberar base de datos
                zkfp2.DBFree(mDBHandle);

                if (matchResult > 0)
                {
                    return Ok(new { msj = "HUELLA COINCIDE", data = new { Coincidencia = true }, code = 0 });
                }
                else if (matchResult == 0)
                {
                    return Ok(new { msj = "HUELLA NO COINCIDE", data = new { Coincidencia = false }, code = 0 });
                }
                else
                {
                    return BadRequest(new { msj = "ERROR AL COMPARAR HUELLA", data = new { }, code = -4 });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    msj = "ERROR EN PROCESO: " + ex.Message,
                    data = new { },
                    code = -2
                });
            }
        }

        [HttpPost]
        [Route("lectorHuellaByCurp")]
        public async Task<IActionResult> LectorHuellaByCurp(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.SensorHuellasCurp parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.RespHuellas>(
                    @"SELECT count(*) as 'LectorHuellas' FROM Sistema.HuellasDigitales hd WHERE hd.Curp = @Curp", parData)
                    .FirstOrDefaultAsync();

                return Ok(res);
            }
            catch (Exception ex)
            {
                // You may want to log the exception here for debugging purposes
                // Log.Error(ex, "Error occurred in LectorHuellaByCurp");

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                await DBContext.Destroy();
            }
        }
        [HttpPost]
        [Route("excepcionHuellas")]
        public async Task<IActionResult> ExcepcionHuellas(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.SensorHuellasRequest parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.RespHuellas>(
                    @"SELECT p.NoTomarHuella  as 'LectorHuellas' FROM General.Personas p WHERE p.PersonaID = @DistribuidorID", parData)
                    .FirstOrDefaultAsync();

                return Ok(res);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                await DBContext.Destroy();
            }
        }

        private static byte[] HexStringToByteArray(string hex)
        {
            if (hex.StartsWith("0x", StringComparison.OrdinalIgnoreCase))
                hex = hex.Substring(2);

            int length = hex.Length;
            byte[] bytes = new byte[length / 2];
            for (int i = 0; i < length; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            }
            return bytes;
        }

    }


    public class BitmapFormat
    {
        public struct BITMAPFILEHEADER
        {
            public ushort bfType;
            public int bfSize;
            public ushort bfReserved1;
            public ushort bfReserved2;
            public int bfOffBits;
        }

        public struct MASK
        {
            public byte redmask;
            public byte greenmask;
            public byte bluemask;
            public byte rgbReserved;
        }

        public struct BITMAPINFOHEADER
        {
            public int biSize;
            public int biWidth;
            public int biHeight;
            public ushort biPlanes;
            public ushort biBitCount;
            public int biCompression;
            public int biSizeImage;
            public int biXPelsPerMeter;
            public int biYPelsPerMeter;
            public int biClrUsed;
            public int biClrImportant;
        }

        /***************
        * �������ƣ�RotatePic       
        * �������ܣ���תͼƬ��Ŀ���Ǳ������ʾ��ͼƬ�밴��ָ�Ʒ���ͬ     
        * ������Σ�BmpBuf---��תǰ��ָ���ַ���
        * �������Σ�ResBuf---��ת���ָ���ַ���
        * �������أ���
        ***************/
        public static void RotatePic(byte[] BmpBuf, int width, int height, ref byte[] ResBuf)
        {
            int RowLoop = 0;
            int ColLoop = 0;
            int BmpBuflen = width * height;

            try
            {
                for (RowLoop = 0; RowLoop < BmpBuflen;)
                {
                    for (ColLoop = 0; ColLoop < width; ColLoop++)
                    {
                        ResBuf[RowLoop + ColLoop] = BmpBuf[BmpBuflen - RowLoop - width + ColLoop];
                    }

                    RowLoop = RowLoop + width;
                }
            }
            catch (Exception ex)
            {
                //ZKCE.SysException.ZKCELogger logger = new ZKCE.SysException.ZKCELogger(ex);
                //logger.Append();
            }
        }

        /***************
        * �������ƣ�StructToBytes       
        * �������ܣ����ṹ��ת�����޷����ַ�������     
        * ������Σ�StructObj---��ת���Ľṹ��
        *           Size---��ת���Ľṹ��Ĵ�С
        * �������Σ���
        * �������أ��ṹ��ת���������
        ***************/
        public static byte[] StructToBytes(object StructObj, int Size)
        {
            int StructSize = Marshal.SizeOf(StructObj);
            byte[] GetBytes = new byte[StructSize];

            try
            {
                IntPtr StructPtr = Marshal.AllocHGlobal(StructSize);
                Marshal.StructureToPtr(StructObj, StructPtr, false);
                Marshal.Copy(StructPtr, GetBytes, 0, StructSize);
                Marshal.FreeHGlobal(StructPtr);

                if (Size == 14)
                {
                    byte[] NewBytes = new byte[Size];
                    int Count = 0;
                    int Loop = 0;

                    for (Loop = 0; Loop < StructSize; Loop++)
                    {
                        if (Loop != 2 && Loop != 3)
                        {
                            NewBytes[Count] = GetBytes[Loop];
                            Count++;
                        }
                    }

                    return NewBytes;
                }
                else
                {
                    return GetBytes;
                }
            }
            catch (Exception ex)
            {
                //ZKCE.SysException.ZKCELogger logger = new ZKCE.SysException.ZKCELogger(ex);
                //logger.Append();

                return GetBytes;
            }
        }

        /***************
        * �������ƣ�GetBitmap       
        * �������ܣ��������������ݱ���ΪͼƬ     
        * ������Σ�buffer---ͼƬ����
        *           nWidth---ͼƬ�Ŀ���
        *           nHeight---ͼƬ�ĸ߶�
        * �������Σ���
        * �������أ���
        ***************/
        public static void GetBitmap(byte[] buffer, int nWidth, int nHeight, ref MemoryStream ms)
        {
            int ColorIndex = 0;
            ushort m_nBitCount = 8;
            int m_nColorTableEntries = 256;
            byte[] ResBuf = new byte[nWidth * nHeight * 2];

            try
            {
                BITMAPFILEHEADER BmpHeader = new BITMAPFILEHEADER();
                BITMAPINFOHEADER BmpInfoHeader = new BITMAPINFOHEADER();
                MASK[] ColorMask = new MASK[m_nColorTableEntries];

                int w = (((nWidth + 3) / 4) * 4);

                //ͼƬͷ��Ϣ
                BmpInfoHeader.biSize = Marshal.SizeOf(BmpInfoHeader);
                BmpInfoHeader.biWidth = nWidth;
                BmpInfoHeader.biHeight = nHeight;
                BmpInfoHeader.biPlanes = 1;
                BmpInfoHeader.biBitCount = m_nBitCount;
                BmpInfoHeader.biCompression = 0;
                BmpInfoHeader.biSizeImage = 0;
                BmpInfoHeader.biXPelsPerMeter = 0;
                BmpInfoHeader.biYPelsPerMeter = 0;
                BmpInfoHeader.biClrUsed = m_nColorTableEntries;
                BmpInfoHeader.biClrImportant = m_nColorTableEntries;

                //�ļ�ͷ��Ϣ
                BmpHeader.bfType = 0x4D42;
                BmpHeader.bfOffBits = 14 + Marshal.SizeOf(BmpInfoHeader) + BmpInfoHeader.biClrUsed * 4;
                BmpHeader.bfSize = BmpHeader.bfOffBits + ((((w * BmpInfoHeader.biBitCount + 31) / 32) * 4) * BmpInfoHeader.biHeight);
                BmpHeader.bfReserved1 = 0;
                BmpHeader.bfReserved2 = 0;

                ms.Write(StructToBytes(BmpHeader, 14), 0, 14);
                ms.Write(StructToBytes(BmpInfoHeader, Marshal.SizeOf(BmpInfoHeader)), 0, Marshal.SizeOf(BmpInfoHeader));

                //���԰���Ϣ
                for (ColorIndex = 0; ColorIndex < m_nColorTableEntries; ColorIndex++)
                {
                    ColorMask[ColorIndex].redmask = (byte)ColorIndex;
                    ColorMask[ColorIndex].greenmask = (byte)ColorIndex;
                    ColorMask[ColorIndex].bluemask = (byte)ColorIndex;
                    ColorMask[ColorIndex].rgbReserved = 0;

                    ms.Write(StructToBytes(ColorMask[ColorIndex], Marshal.SizeOf(ColorMask[ColorIndex])), 0, Marshal.SizeOf(ColorMask[ColorIndex]));
                }

                //ͼƬ��ת�����ָ��ͼƬ����������
                RotatePic(buffer, nWidth, nHeight, ref ResBuf);

                byte[] filter = null;
                if (w - nWidth > 0)
                {
                    filter = new byte[w - nWidth];
                }
                for (int i = 0; i < nHeight; i++)
                {
                    ms.Write(ResBuf, i * nWidth, nWidth);
                    if (w - nWidth > 0)
                    {
                        ms.Write(ResBuf, 0, w - nWidth);
                    }
                }
            }
            catch (Exception ex)
            {
                // ZKCE.SysException.ZKCELogger logger = new ZKCE.SysException.ZKCELogger(ex);
                // logger.Append();
            }
        }

        /***************
        * �������ƣ�WriteBitmap       
        * �������ܣ��������������ݱ���ΪͼƬ     
        * ������Σ�buffer---ͼƬ����
        *           nWidth---ͼƬ�Ŀ���
        *           nHeight---ͼƬ�ĸ߶�
        * �������Σ���
        * �������أ���
        ***************/
        public static void WriteBitmap(byte[] buffer, int nWidth, int nHeight)
        {
            int ColorIndex = 0;
            ushort m_nBitCount = 8;
            int m_nColorTableEntries = 256;
            byte[] ResBuf = new byte[nWidth * nHeight];

            try
            {

                BITMAPFILEHEADER BmpHeader = new BITMAPFILEHEADER();
                BITMAPINFOHEADER BmpInfoHeader = new BITMAPINFOHEADER();
                MASK[] ColorMask = new MASK[m_nColorTableEntries];
                int w = (((nWidth + 3) / 4) * 4);
                //ͼƬͷ��Ϣ
                BmpInfoHeader.biSize = Marshal.SizeOf(BmpInfoHeader);
                BmpInfoHeader.biWidth = nWidth;
                BmpInfoHeader.biHeight = nHeight;
                BmpInfoHeader.biPlanes = 1;
                BmpInfoHeader.biBitCount = m_nBitCount;
                BmpInfoHeader.biCompression = 0;
                BmpInfoHeader.biSizeImage = 0;
                BmpInfoHeader.biXPelsPerMeter = 0;
                BmpInfoHeader.biYPelsPerMeter = 0;
                BmpInfoHeader.biClrUsed = m_nColorTableEntries;
                BmpInfoHeader.biClrImportant = m_nColorTableEntries;

                //�ļ�ͷ��Ϣ
                BmpHeader.bfType = 0x4D42;
                BmpHeader.bfOffBits = 14 + Marshal.SizeOf(BmpInfoHeader) + BmpInfoHeader.biClrUsed * 4;
                BmpHeader.bfSize = BmpHeader.bfOffBits + ((((w * BmpInfoHeader.biBitCount + 31) / 32) * 4) * BmpInfoHeader.biHeight);
                BmpHeader.bfReserved1 = 0;
                BmpHeader.bfReserved2 = 0;

                Stream FileStream = File.Open("finger.bmp", FileMode.Create, FileAccess.Write);
                BinaryWriter TmpBinaryWriter = new BinaryWriter(FileStream);

                TmpBinaryWriter.Write(StructToBytes(BmpHeader, 14));
                TmpBinaryWriter.Write(StructToBytes(BmpInfoHeader, Marshal.SizeOf(BmpInfoHeader)));

                //���԰���Ϣ
                for (ColorIndex = 0; ColorIndex < m_nColorTableEntries; ColorIndex++)
                {
                    ColorMask[ColorIndex].redmask = (byte)ColorIndex;
                    ColorMask[ColorIndex].greenmask = (byte)ColorIndex;
                    ColorMask[ColorIndex].bluemask = (byte)ColorIndex;
                    ColorMask[ColorIndex].rgbReserved = 0;

                    TmpBinaryWriter.Write(StructToBytes(ColorMask[ColorIndex], Marshal.SizeOf(ColorMask[ColorIndex])));
                }

                //ͼƬ��ת�����ָ��ͼƬ����������
                RotatePic(buffer, nWidth, nHeight, ref ResBuf);

                //дͼƬ
                //TmpBinaryWriter.Write(ResBuf);
                byte[] filter = null;
                if (w - nWidth > 0)
                {
                    filter = new byte[w - nWidth];
                }
                for (int i = 0; i < nHeight; i++)
                {
                    TmpBinaryWriter.Write(ResBuf, i * nWidth, nWidth);
                    if (w - nWidth > 0)
                    {
                        TmpBinaryWriter.Write(ResBuf, 0, w - nWidth);
                    }
                }

                FileStream.Close();
                TmpBinaryWriter.Close();
            }
            catch (Exception ex)
            {
                //ZKCE.SysException.ZKCELogger logger = new ZKCE.SysException.ZKCELogger(ex);
                //logger.Append();
            }
        }
    }

}