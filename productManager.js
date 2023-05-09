import fs from "fs";
export default class ProductManager {
    constructor(fileName) {
        this.fileName = fileName;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.fileName, "utf-8");
            if (data) {
                this.products = JSON.parse(data);
            }
        } catch (err) {
            console.log(`Error al leer el archivo: ${err.message}`);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.fileName, JSON.stringify(this.products), "utf-8");
        } catch (err) {
            console.log(`Error al escribir archivo: ${err.message}`);
        }
    }

    addProduct(product) {
        // Valida que todos los campos sean obligatorios
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
        ) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        // Valida que no se repita el código
        const codeAlreadyExists = this.products.some(
            (prod) => prod.code === product.code
        );

        if (codeAlreadyExists) {
            console.log(`Ya existe un producto con el código ${product.code}`);
            return;
        }

        // Agrega el producto al arreglo con un id autoincrementable
        const newProduct = {
            ...product,
            id: this.products.length + 1,
        };

        this.products.push(newProduct);
        this.saveProducts();
        console.log(`Producto ${newProduct.id} - ${newProduct.title} agregado`);
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        if (product) {
            return product;
        }
    }

    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(
            (product) => product.id === id
        );
        if (productIndex === -1) {
            console.log(`Producto ${id} no encontrado`);
            return;
        }

        this.products[productIndex] = {
            ...updatedProduct,
            id,
        };

        this.saveProducts();
        console.log(`Producto ${id} actualizado`);
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(
            (product) => product.id === id
        );
        if (productIndex === -1) {
            console.log(`Producto ${id} no encontrado`);
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
        console.log(`Producto ${id} eliminado`);
    }
}