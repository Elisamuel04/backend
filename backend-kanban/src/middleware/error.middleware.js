export default function errorHandler(err, req, res, next) {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
}
