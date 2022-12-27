let _PDFService = null;

class PDFController {

    constructor({ PDFService}) {
        _PDFService = PDFService;
        this.data = '';
    }

    async generatePDFMantenimiento(req, res) {

        let {anio} = req.params;

        await _PDFService.getMantenimientosReporte(anio)
            .then(result=>{
                this.data = result;
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send(error);
            });

        var result = await _PDFService.generateHtml(this.data, anio);

        // res.json(result);

        await _PDFService.generatePDF()
            .then(result=>{
                res.send(result);
            })
            .catch(error=>{
                console.dir(error);
                res.status(500).send('Error en la operacion!');
            });
    }

}

module.exports = PDFController;