#!/usr/bin/env python3
import os
import sys
import pathspec

# Diccionario que asocia extensiones de archivo a lenguajes de programación
EXTENSIONES = {
    ".ts": "TypeScript",
    ".tsx": "TypeScript (React)",
    ".py": "Python",
    ".js": "JavaScript",
    ".html": "HTML",
    ".css": "CSS",
}

def cargar_gitignore(directorio):
    """
    Carga el archivo .gitignore y devuelve un objeto pathspec.
    Si no existe, retorna None.
    """
    gitignore_path = os.path.join(directorio, '.gitignore')
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r', encoding='utf-8') as f:
            lineas = f.readlines()
        # Se utiliza el formato 'gitwildmatch' para interpretar correctamente las reglas
        return pathspec.PathSpec.from_lines('gitwildmatch', lineas)
    return None

def contar_archivos_y_lineas(directorio):
    total_archivos = 0
    total_lineas = 0
    detalles_lenguajes = {}
    
    # Cargar las reglas del .gitignore si existen
    spec = cargar_gitignore(directorio)

    for root, dirs, files in os.walk(directorio):
        # Calcular la ruta relativa desde el directorio base para comparar con las reglas
        relative_root = os.path.relpath(root, directorio)
        # Excluir directorios ignorados modificando la lista in situ
        if spec:
            dirs[:] = [d for d in dirs if not spec.match_file(os.path.join(relative_root, d))]
        for archivo in files:
            ruta_archivo = os.path.join(root, archivo)
            # Verificar si el archivo debe ser ignorado
            if spec:
                relative_path = os.path.relpath(ruta_archivo, directorio)
                if spec.match_file(relative_path):
                    continue

            total_archivos += 1
            _, ext = os.path.splitext(archivo)
            lenguaje = EXTENSIONES.get(ext.lower(), "Desconocido")
            try:
                with open(ruta_archivo, 'r', encoding='utf-8', errors='ignore') as f:
                    lineas = f.readlines()
                    conteo_lineas = len(lineas)
                    total_lineas += conteo_lineas
                    if lenguaje in detalles_lenguajes:
                        detalles_lenguajes[lenguaje]['archivos'] += 1
                        detalles_lenguajes[lenguaje]['lineas'] += conteo_lineas
                    else:
                        detalles_lenguajes[lenguaje] = {'archivos': 1, 'lineas': conteo_lineas}
            except Exception as e:
                print(f"Error leyendo {ruta_archivo}: {e}")

    return total_archivos, total_lineas, detalles_lenguajes

def main():
    if len(sys.argv) < 2:
        print("Uso: python conteo.py <directorio>")
        sys.exit(1)
    directorio = sys.argv[1]
    total_archivos, total_lineas, detalles = contar_archivos_y_lineas(directorio)
    
    print("Resumen:")
    print(f"Total de archivos: {total_archivos}")
    print(f"Total de líneas de código: {total_lineas}\n")
    
    print("Detalles por lenguaje:")
    for lang, info in detalles.items():
        print(f"{lang}: {info['archivos']} archivos, {info['lineas']} líneas")

if __name__ == '__main__':
    main()
