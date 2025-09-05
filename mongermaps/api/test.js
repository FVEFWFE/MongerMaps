export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Root API directory test',
    timestamp: new Date().toISOString()
  })
}