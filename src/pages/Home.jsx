import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-green-400">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="text-xl px-6 py-3 border border-green-400 rounded"
        onClick={() => navigate('/simulation')}
      >
        START
      </motion.button>
    </div>
  )
}
