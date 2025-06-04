using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace Demo
{
    static class Program
    {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            if (System.Diagnostics.Process.GetProcessesByName(System.IO.Path.GetFileNameWithoutExtension(System.Reflection.Assembly.GetEntryAssembly().Location)).Count() > 1)
            {
                MessageBox.Show("Ya tiene abierto el lector de huellas", "Lector abierto", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            Application.Run(new Form1(args));
        }
    }
}
