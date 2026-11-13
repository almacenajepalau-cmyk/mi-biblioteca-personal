class Libro {
    constructor(titulo, autor, genero, leido = false) {
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.leido = leido;
        this.id = Date.now();
    }

    marcarComoLeido() {
        this.leido = true;
    }

    marcarComoNoLeido() {
        this.leido = false;
    }
}