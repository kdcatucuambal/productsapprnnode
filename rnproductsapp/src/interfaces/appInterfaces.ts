export interface LoginResponse {
    usuario: Usuario;
    token:   string;
}

export interface RegisterData{
    correo: string,
    password: string,
    nombre: string
}

export interface Usuario {
    rol:    string;
    estado: boolean;
    google: boolean;
    nombre: string;
    correo: string;
    uid:    string;
}

export interface LoginData{
    email: string,
    password: string
}


export interface ProductsResponse {
    total:     number;
    productos: Producto[];
}

export interface Producto {
    precio:    number;
    _id:       string;
    nombre:    string;
    categoria: Categoria;
    usuario:   Categoria;
    img?:      string;
}


export interface CategoriesResponse {
    total:      number;
    categorias: Categoria[];
}

export interface Categoria {
    _id:     string;
    nombre:  string;
    usuario?: CreadoPor;
}

export interface CreadoPor {
    _id:    string;
    nombre: string;
}



