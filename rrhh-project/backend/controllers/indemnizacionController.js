const Indemnizacion = require('../models/indemnizacionModel');

exports.generarLiquidacion = async (req, res) => {
  const { id_empleado } = req.params;
  const { fecha_despido } = req.body;

  try {
    const datos = await Indemnizacion.calcularLiquidacion(id_empleado, fecha_despido);
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerLiquidaciones = async (req, res) => {
  try {
    const data = await Indemnizacion.listarLiquidaciones();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerDetalleLiquidacion = async (req, res) => {
  const { id } = req.params;
  try {
    const detalle = await Indemnizacion.obtenerLiquidacionPorId(id);
    res.json(detalle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
