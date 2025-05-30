export default function AdminNotFoundPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white shadow rounded">
                <h1 className="text-4xl font-bold mb-4">404 – No Encontrado</h1>
                <p className="mb-6">Esa sección del admin no existe o no está disponible.</p>
                <a href="./" className="btn btn-primary">
                    Volver al panel
                </a>
            </div>
        </div>
    );
}
