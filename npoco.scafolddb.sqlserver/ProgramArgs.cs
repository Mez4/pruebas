using CommandLineParser.Arguments;

/// <summary>
/// Argumentos del programa
/// </summary>
public class ProgramArgs
{
    /// <summary>
    /// Archivo de configuración, debe de seguir el lineamiento de DBItem
    /// </summary>
    [ValueArgument(typeof(string), 'i', "in", Description = "Archivo de configuración")]
    public string InFile { get; set; }

    /// <summary>
    /// Carpeta de desitno, la misma debe de existir al menos la carpeta padre de la misma
    /// </summary>
    [ValueArgument(typeof(string), 'c', "out_csharp", Description = "Carpeta de destino para C#")]
    public string OutFolder { get; set; }

    /// <summary>
    /// Carpeta de desitno, la misma debe de existir al menos la carpeta padre de la misma
    /// </summary>
    [ValueArgument(typeof(string), 't', "out_ts", Description = "Carpeta de destino para TypeScript")]
    public string OutFolderTS { get; set; }
}