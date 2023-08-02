const BaseService = require("./Base.service");
const puppeteer = require("puppeteer");
const report = require('puppeteer-report')
const path = require('path');
const fs = require('fs');

let _mantenimientoService = null;

class PDFService extends BaseService{

    constructor({MantenimientoRepository}){
      super(MantenimientoRepository);
      _mantenimientoService = MantenimientoRepository;
      this.htmlMantenimiento = '';
      this.htmlHV = '';
      this.query = '';
    }

    async getMantenimientosReporte(anio){
      return new Promise(async (resolve, reject)=>{
        this.query = `SELECT  M.id_mantenimiento, M.tipo, M.fecha_mantenimiento, M.observaciones, M.id_activo_fijo, T.nombre As Tecnico, E.tipo As Equipo, E.nombre, E.serie, F.nombre AS marca, N.nombre AS modelo, A.nombre_asignado, A.regional, A.id_asignacion, A.fecha_asignacion,
                  STUFF(
                      (SELECT ', ' + A.nombre FROM [dbo].[actividades] A 
                      RIGHT JOIN [dbo].[detalle_mantenimiento] D ON A.id_actividad = D.id_actividad
                      WHERE D.id_mantenimiento = M.id_mantenimiento
                      FOR XML PATH('')),
                      1, 2, '') AS Actividad,
            CASE
            WHEN A.fecha_asignacion IN (SELECT MAX(fecha_asignacion) FROM asignacion WHERE (fecha_asignacion <= M.fecha_mantenimiento AND fecha_retiro > M.fecha_mantenimiento) AND id_activo_fijo = A.id_activo_fijo)
              THEN 'ASIGNADO'
            WHEN (SELECT MAX(fecha_asignacion) FROM asignacion WHERE (fecha_asignacion <= M.fecha_mantenimiento AND fecha_retiro > M.fecha_mantenimiento) AND id_activo_fijo = A.id_activo_fijo) IS NULL
              THEN 'NO ASIGNADO'
            ELSE ''
            END AS ASIGNACION
                  FROM [dbo].[mantenimiento] M LEFT JOIN [dbo].[tecnicos] T ON M.id_tecnico = T.id_tecnico
            LEFT JOIN [dbo].[equipo] E ON M.id_activo_fijo = E.id_activo_fijo
            LEFT JOIN [dbo].[fabricante] F ON E.id_fabricante = F.id_fabricante
            LEFT JOIN [dbo].[modelo] N ON E.id_modelo = N.id_modelo
            LEFT JOIN [dbo].[asignacion] A ON M.id_activo_fijo = A.id_activo_fijo
            WHERE
            M.fecha_mantenimiento BETWEEN '${anio}-01-01' AND '${anio}-06-30'
            OR
            M.fecha_mantenimiento BETWEEN '${anio}-07-01' AND '${anio}-12-31'`;

          await super.execute(this.query)
            .then(result=>{

                resolve(result)
            })
            .catch(error=>{
                console.dir(error);
                reject(error);
            });
        
        });
    }

    async generateHtml(data, anio){

      return new Promise((resolve, reject)=>{

        if (!data) {
          reject('No hay datos para generar el PDF');
        }

        var mesEjecucion = '';
        var idMant = '';
        var fechaMant = '';
        var noAsignadosFilter = [];

        var asignados = data.filter(element=>
          element.ASIGNACION == 'ASIGNADO'
        );

        var noAsignados = data.filter(element=>
          element.ASIGNACION == 'NO ASIGNADO'
        );

        for (var i = 0; i < noAsignados.length; i++) {
          
          if ( !(noAsignados[i].id_mantenimiento == idMant && new Date(noAsignados[i].fecha_mantenimiento).getTime() == fechaMant) ) {
            noAsignadosFilter.push(noAsignados[i]);
          }

          idMant = noAsignados[i].id_mantenimiento;
          fechaMant = new Date(noAsignados[i].fecha_mantenimiento).getTime();
        }

        // resolve({asignados, noAsignadosFilter});

        this.htmlMantenimiento = `
        <html>
            <head>
              <title>Test PDF</title>
              <style>
              @page{
                size: landscape;
              }
    
              body {
                font-family: "Hevletica Neue", "Helvetica", "Arial", sans-serif;
                font-size: 12px;
                line-height: 24px;
              }
        
              body > h4 {
                font-size: 24px;
                line-height: 24px;
                text-transform: uppercase;
                margin-bottom: 60px;
              }
        
              body > header {
                display: flex;
              }
        
              body > header > .address-block:nth-child(2) {
                margin-left: 100px;
              }
        
              .address-block address {
                font-style: normal;
              }
        
              .address-block > h5 {
                font-size: 14px;
                line-height: 14px;
                margin: 0px 0px 15px;
                text-transform: uppercase;
                color: #aaa;
              }
        
              .sectionTable {
                width: 100%;
                margin-top: 10px;
              }
        
              .sectionTable table {
                width: 100%;
                border: 1px solid #eee;
                border-collapse: collapse;
              }
        
              .sectionTable table tr th,
              .sectionTable table tr td {
                font-size: 12px;
                padding: 10px;
                border: 1px solid #000;
                border-collapse: collapse;
              }

              
              .sectionTable table tfoot tr td {
                border-top: 3px solid #eee;
              }

              .sectionTable table tr th{
                background-color: #94b2d6;
              }
    
            .layout {
              width: 100%;
              height: auto;
                
              display: flex;
              gap: 16px;
              flex-wrap: wrap;
                
              align-items: flex-start;
              flex-direction: row;
              justify-content: flex-start;
            }
            .firmas {
              width: 100%;
              height: auto;
                
              display: flex;
              gap: 16px;
              flex-wrap: wrap;
                
              align-items: center;
              flex-direction: row;
              justify-content: center;
            }
    
            table.info{
              border: 1px solid black !important; 
              vertical-align: middle;
              text-align: center;
              width: 100%;
              border-collapse: collapse;
          }
    
            table.cabecera tr th, table.cabecera tr td{
              padding: 5px;
            }
            
            .imgSM {
                flex-grow: 2;
                display: flex;
                justify-content: center;
            }
    
            .headerPDF {
                flex-grow: 8;
                display: flex;
                justify-content: center;
            }

            #camposCabecera{
              flex-grow: 1;
              display: flex;
              justify-content: left;
            }

            .elaborador{
              flex-grow: 4;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .aprobador{
              flex-grow: 4;
              display: flex;
              justify-content: flex-end;
              align-items: center;
            }

            #colaboradorImg, #jefeImg  {
              object-fit: contain; 
              width: 30%; 
              border-bottom: 1px solid black;
            }

            </style>   
            <body>
            <header>
            <div id="header">
            <section class="layout">
                <div class="imgSM"> <img src="logoSM.png" alt=""> </div>
                <div class="headerPDF">
                    <table class="cabecera info">
                        <thead>
                            <tr>
                                <th colspan="5" style="border-bottom: 1px solid black; text-align:center;">  CONTROL Y MANTENIMIENTO DE EQUIPOS DE CÓMPUTO  </th>
                            </tr>
                            <tr>
                                <th style="border-bottom: 1px solid black;">CÓDIGO</th>
                                <th style="border-bottom: 1px solid black; border-left: 1px solid black;">VERSIÓN</th>
                                <th style="border-bottom: 1px solid black; border-left: 1px solid black;">VIGENTE A PARTIR DE</th>
                                <th style="border-bottom: 1px solid black; border-left: 1px solid black;">PÁGINA</th>
                                <th style="border-bottom: 1px solid black; border-left: 1px solid black;">DE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>GTI-RG-02</td>
                                <td style="border-left: 1px solid black;">2</td>
                                <td style="border-left: 1px solid black;">7/02/2019</td>
                                <td style="border-left: 1px solid black;"><span class="pageNumber"></span></td>
                                <td style="border-left: 1px solid black;"><span class="totalPages"></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
          </div>
          <div class="layout">
            <div id="camposCabecera">
              <table class="cabecera">
                <tr>
                  <th>Año</th>
                  <td style="border:1px solid black;">${anio}</td>
                </tr>
                <tr>
                  <th>Fecha de actualización <br> (aaaa-mm-dd)</th>
                  <td style="border:1px solid black;">${new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()}</td>
                </tr>
              </table>
            </div>
          </div>
            </header>
              <div class="sectionTable">
                <table>
                  <thead>
                    <tr>
                      <th colspan="8" style="background-color: #94b2d6;">INVENTARIO</th>
                      <th colspan="2">PROGRAMACIÓN</th>
                      <th>ACTIVIDADES MANTENIMIENTO</th>
                    </tr>
                    <tr>
                        <th>Identificación CPU</th>
                        <th>Tipo</th>
                        <th>Nombre Equipo</th>
                        <th>Serial</th>
                        <th>Marca</th>
                        <th>Características</th>
                        <th>Regional</th>
                        <th>Usuario</th>
                        <th>Fecha ejecución <br> primer trimestre</th>
                        <th>Fecha de ejecución <br> segundo trimestre</th>
                        <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>`;

              asignados.forEach(element => {
                mesEjecucion = new Date(element.fecha_mantenimiento).getMonth() + 1

                this.htmlMantenimiento += 
                  `<tr>
                    <td style="text-align:left;">${element.id_activo_fijo == null ? 'No Aplica' : element.id_activo_fijo}</td>
                    <td style="text-align:center;">${element.Equipo}</td>
                    <td style="text-align:center;">${element.nombre == null ? 'No Aplica' : element.nombre }</td>
                    <td style="text-align:center;">${element.serie == null ? 'No Aplica' : element.serie}</td>
                    <td style="text-align:left;">${element.marca == null ? 'No Aplica' : element.marca}</td>
                    <td style="text-align:center;">${element.modelo == null ? 'No Aplica' : element.modelo}</td>
                    <td style="text-align:center;">${element.regional == null ? 'Sin Asignar' : element.regional}</td>
                    <td style="text-align:center;">${element.nombre_asignado == null ? 'Sin Asignar' : element.nombre_asignado}</td>
                    <td style="text-align:left;">${ mesEjecucion < 7 ? new Date(element.fecha_mantenimiento).toLocaleDateString() : '' }</td>
                    <td style="text-align:left;">${ mesEjecucion >= 7 ? new Date(element.fecha_mantenimiento).toLocaleDateString() : '' }</td>
                    <td style="text-align:center;">Observaciones: ${element.observaciones == null ? 'No Aplica' : element.observaciones}, Actividades: ${element.Actividad == null ? 'No Aplica' : element.Actividad}</td>
                  </tr>`
              });

              noAsignadosFilter.forEach(element => {
                mesEjecucion = new Date(element.fecha_mantenimiento).getMonth() + 1
                this.htmlMantenimiento += 
                  `<tr>
                    <td style="text-align:left;">${element.id_activo_fijo == null ? 'No Aplica' : element.id_activo_fijo}</td>
                    <td style="text-align:center;">${element.Equipo}</td>
                    <td style="text-align:center;">${element.nombre == null ? 'No Aplica' : element.nombre }</td>
                    <td style="text-align:center;">${element.serie == null ? 'No Aplica' : element.serie}</td>
                    <td style="text-align:left;">${element.marca == null ? 'No Aplica' : element.marca}</td>
                    <td style="text-align:center;">${element.modelo == null ? 'No Aplica' : element.modelo}</td>
                    <td style="text-align:center;">${element.regional == null ? 'Sin Asignar' : element.regional}</td>
                    <td style="text-align:center;">${element.nombre_asignado == null ? 'Sin Asignar' : element.nombre_asignado}</td>
                    <td style="text-align:left;">${ mesEjecucion < 7 ? new Date(element.fecha_mantenimiento).toLocaleDateString() : '' }</td>
                    <td style="text-align:left;">${ mesEjecucion >= 7 ? new Date(element.fecha_mantenimiento).toLocaleDateString() : '' }</td>
                    <td style="text-align:center;">Observaciones: ${element.observaciones == null ? 'No Aplica' : element.observaciones}, Actividades: ${element.Actividad == null ? 'No Aplica' : element.Actividad}</td>
                  </tr>`
              });
                  
            this.htmlMantenimiento += `
                      </tbody>
                    </table>
                  </div>
                  <div class="firmas">
                    <div class="elaborador">
                      <table class="cabecera" style="text-align: center">
                        <tr>
                          <th>Elaborado Por:</th>
                          <td><img id="colaboradorImg" src="Firma_col1.jpeg" ></td>
                          <th>Aprobador Por:</th>
                          <td><img id="jefeImg" src="Firma_Jefe.png" ></td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </body>
              </html>`;

        try {
          fs.writeFileSync(path.join(__dirname, '../../public/mant.html'), this.htmlMantenimiento);
          resolve(true);
        } catch (error) {
          console.log("Cannot write file ", error);
          reject(error);
        }
      });
        
    }

    async generatePDF(){
        return new Promise(async (resolve, reject)=>{
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setContent(this.htmlMantenimiento);
            const file = path.join(__dirname, "../../public/mant.html");

            // const pdfBuffer = 
            await report.pdf(browser, file, {
              path: "./public/report.pdf",
              format: "A4",
              margin: {
                bottom: "10mm",
                left: "5mm",
                right: "5mm",
                top: "5mm",
              },
              omitBackground: false,
              printBackground: true
            });

            await page.close();
            await browser.close();

            resolve(true);
        });
    }
}

module.exports =  PDFService;