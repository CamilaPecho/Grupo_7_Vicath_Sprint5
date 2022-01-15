const fs = require('fs');
const path = require('path');
// Recibo por parámetro la entidad para reutilizarlo


const modelController = function (name) {
    console.log('entre al modelo')
    console.log(name)
    console.log(path.resolve(__dirname, '../data/', `${name}.json`))
    return {
        tablePath: path.resolve(__dirname, '../data/', `${name}.json`),

        // Leo el archivo Json y lo transformo en Array de objeto literal     
        readFile: function () {
            let tableContents = fs.readFileSync(this.tablePath, 'utf-8');
            return JSON.parse(tableContents) || [];
        },
        // Grabo el array que recibo por parámetro y lo paso a formato Json
        writeFile: function (contents) {
            let tableContents = JSON.stringify(contents, null, ' ');
            fs.writeFileSync(this.tablePath, tableContents);
        },
        // Averiguo el próximo id
        nextId: function () {
            let rows = this.readFile();
            let lastRow = rows.pop();

            return lastRow.id ? ++lastRow.id : 1;
        },
        // Leo todos los registros del archivo
        all: function () {
            return this.readFile();
        },
        // Busco por id
        find: function (id) {
            let rows = this.readFile();

            return rows.find(i => i.id == id);
        },

        // agrego un registro que paso por parámetro
        create: function (row) {
            let rows = this.readFile();
            // Averiguo el último id y lo actualizo
            row.id = this.nextId();
            // Agrego en el array
            rows.push(row);
            // grabo el array en el archivo
            this.writeFile(rows);
            //Retorno el último id generado
            return row.id;
        },
        // Actualizo el archivo
        update: function (row) {
            let rows = this.readFile();

            let updatedRows = rows.map(oneRow => {
                if (oneRow.id == row.id) {
                    return row;
                }

                return oneRow;
            });
            // escribo el archivo
            this.writeFile(updatedRows);

            return row.id;
        },

        // Elimino el registro en el archivo según un id    
        delete: function (id) {

            let rows = this.readFile();
            let updatedRows = rows.filter(row => {
                return row.id != id;
            });

            this.writeFile(updatedRows);
        },

        buscardorPorCategoriaIndividual: function(categoria, valor)
        {
            let rows = this.readFile();
            let resultadoBuscado = rows.find( (objeto) =>
            {
                return objeto[categoria] === valor; 
                //Se usa un comparador estricto porque como es un objeto 
                //literal queremos que el tipo de dato y el valor coincidan 👍
            }
            )

            return resultadoBuscado;
        },

        buscardorPorCategoria: function(categoria, valor)
        {
            let rows = this.readFile();
            let resultadoBuscado = rows.filter( (objeto) =>
            {
                return objeto[categoria] === valor; 
                //Se usa un comparador estricto porque como es un objeto 
                //literal queremos que el tipo de dato y el valor coincidan 👍
            }
            )

            return resultadoBuscado;
        }

    }
}

module.exports = modelController