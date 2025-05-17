const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
require('pdfkit-table');
const ReportesModel = require('../models/reportesModel');

exports.getHorasExtraPorMes = (req, res) => {
  const { mes, anio } = req.params;
  ReportesModel.obtenerHorasExtraPorMes(mes, anio, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
};

exports.getGastoNominaPorDepartamento = (req, res) => {
  const { mes, anio } = req.params;
  ReportesModel.obtenerGastoNominaPorDepartamento(mes, anio, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
};

exports.generarPlanilla = async (req, res) => {
  const {
    mes,
    anio,
    id_tipo_nomina,
    id_departamento,
    formato,
    incluirDesglose,
    encabezado
  } = req.body;

  try {
    const planilla = await new Promise((resolve, reject) => {
      ReportesModel.generarPlanilla(mes, anio, id_tipo_nomina, id_departamento, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    if (incluirDesglose === true || incluirDesglose === 'true') {
      for (let p of planilla) {
        const detalle = await new Promise((resolve, reject) => {
          ReportesModel.detallePlanillaPorNomina(p.id_nomina, (err, data) =>
            err ? reject(err) : resolve(data)
          );
        });
        p.detalle = detalle;
      }
    }

    const primer = planilla[0];
    const fecha_inicio = new Date(primer?.fecha_inicio).toLocaleDateString();
    const fecha_fin = new Date(primer?.fecha_fin).toLocaleDateString();
    const fecha_actual = new Date().toLocaleString();
    const total_neto = planilla.reduce((acc, p) => acc + Number(p.salario_neto), 0);

    // ✅ GENERAR PDF
   if (formato === 'pdf') {
  const doc = new PDFDocument({ margin: 40 });
  const pdfPath = path.join(__dirname, '..', 'exports', 'planilla.pdf');
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // 🏢 Encabezado
  doc.fontSize(16).font('Helvetica-Bold').text('RRHH', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica').text(`Rango cubierto: ${fecha_inicio} - ${fecha_fin}`, { align: 'center' });
  doc.text(`Generado el: ${fecha_actual}`, { align: 'center' });
  doc.moveDown();
  if (encabezado) {
    doc.fontSize(11).text(encabezado, { align: 'left' });
    doc.moveDown(0.5);
  }

  // 🧾 Tabla manual
  const headers = ['Empleado', 'DPI', 'Puesto', 'Departamento', 'Bruto', 'Deducciones', 'Neto'];
  const colWidths = [110, 90, 90, 90, 60, 70, 60];
  const startX = doc.page.margins.left;
  let posY = doc.y;

  // Dibujar encabezado
  headers.forEach((h, i) => {
    doc.font('Helvetica-Bold').fontSize(9).text(h, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), posY, { width: colWidths[i] });
  });

  posY += 15;
  doc.moveTo(startX, posY - 5).lineTo(startX + colWidths.reduce((a, b) => a + b), posY - 5).stroke();

  // Dibujar filas
  for (let p of planilla) {
    const row = [
      p.nombre_completo,
      p.dpi,
      p.nombre_puesto,
      p.nombre_departamento,
      `Q${Number(p.salario_bruto).toFixed(2)}`,
      `Q${Number(p.deducciones).toFixed(2)}`,
      `Q${Number(p.salario_neto).toFixed(2)}`
    ];

    row.forEach((cell, i) => {
      doc.font('Helvetica').fontSize(9).text(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), posY, { width: colWidths[i] });
    });

    posY += 15;
    if (posY > doc.page.height - 50) {
      doc.addPage();
      posY = doc.y;
    }
  }

  // Total
  doc.moveDown(2);
  doc.fontSize(11).font('Helvetica-Bold')
  .text(`Total Neto a Pagar: Q${total_neto.toFixed(2)}`, doc.page.width - 220, doc.y, {
    width: 200,
    align: 'right',
    lineBreak: false
  });

  doc.end();

  writeStream.on('close', () => res.download(pdfPath, 'planilla.pdf'));
  writeStream.on('error', err => {
    console.error('❌ Error al escribir PDF:', err);
    return res.status(500).json({ error: 'No se pudo generar el PDF.' });
  });

  return;
}


    // ✅ EXCEL
    if (formato === 'excel') {
      const wb = XLSX.utils.book_new();

      const hojaDatos = planilla.map(p => ({
        Empleado: p.nombre_completo,
        DPI: p.dpi,
        Puesto: p.nombre_puesto,
        Departamento: p.nombre_departamento,
        'Fecha Nómina': p.fecha_nomina,
        'Salario Bruto': Number(p.salario_bruto),
        Deducciones: Number(p.deducciones),
        'Salario Neto': Number(p.salario_neto)
      }));

      const hoja = XLSX.utils.json_to_sheet([
        { Empresa: 'RRHH' },
        { 'Fecha de generación': fecha_actual },
        { 'Rango de nómina': `${fecha_inicio} - ${fecha_fin}` },
        encabezado ? { Comentario: encabezado } : {},
        {},
        ...hojaDatos,
        {},
        { 'TOTAL NETO PAGADO': total_neto }
      ]);

      XLSX.utils.book_append_sheet(wb, hoja, 'Planilla');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      const pathExcel = path.join(__dirname, '..', 'exports', 'planilla.xlsx');
      fs.writeFileSync(pathExcel, buffer);
      return res.download(pathExcel, 'planilla.xlsx');
    }

    // ✅ Vista previa
    return res.json(planilla);

  } catch (err) {
    console.error('❌ Error al generar planilla:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDetallePlanilla = (req, res) => {
  const { id_nomina } = req.params;
  ReportesModel.obtenerDetallePlanilla(id_nomina, (err, detalle) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(detalle);
  });
};
