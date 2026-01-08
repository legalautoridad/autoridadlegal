'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Power, AlertTriangle, X, CheckCircle, CreditCard } from 'lucide-react'
import { toggleLawyerStatus, rechargeWallet } from '@/lib/actions/lawyer'

interface WalletHeaderProps {
    balance: number
    isActive: boolean
}

export function WalletHeader({ balance, isActive }: WalletHeaderProps) {
    const [active, setActive] = useState(isActive)
    const [isPending, startTransition] = useTransition()
    const [showRecharge, setShowRecharge] = useState(false)
    const [rechargeSuccess, setRechargeSuccess] = useState(false)

    const isLowBalance = balance <= 250

    const handleToggle = () => {
        const newState = !active
        setActive(newState) // Optimistic
        startTransition(async () => {
            try {
                await toggleLawyerStatus(newState)
            } catch (e) {
                setActive(!newState) // Revert on error
                console.error(e)
            }
        })
    }

    const handleRecharge = (amount: number) => {
        startTransition(async () => {
            try {
                await rechargeWallet(amount)
                setShowRecharge(false)
                setRechargeSuccess(true)
                setTimeout(() => setRechargeSuccess(false), 3000)
            } catch (e) {
                alert('Error en la recarga')
                console.error(e)
            }
        })
    }

    return (
        <>
            <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm relative">
                {/* ALERT BANNER */}
                {isLowBalance && !rechargeSuccess && (
                    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 text-center">
                        <p className="text-sm text-amber-800 flex items-center justify-center gap-2 font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            Tu saldo es bajo ({balance}€). Recarga para asegurar la asignación de nuevos casos.
                        </p>
                    </div>
                )}

                {rechargeSuccess && (
                    <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-center">
                        <p className="text-sm text-emerald-800 flex items-center justify-center gap-2 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            ¡Recarga realizada con éxito!
                        </p>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">

                        {/* LEFT: Balance & Action */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${isLowBalance ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                                    <Wallet className={`w-6 h-6 ${isLowBalance ? 'text-amber-600' : 'text-emerald-600'}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Saldo Disponible</p>
                                    <h2 className={`text-2xl font-bold ${isLowBalance ? 'text-amber-600' : 'text-gray-900'}`}>
                                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(balance)}
                                    </h2>
                                </div>
                            </div>

                            <button
                                onClick={() => isActive ? setShowRecharge(true) : null}
                                disabled={!isActive}
                                className={`hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <CreditCard className="w-4 h-4" />
                                Recargar
                            </button>
                        </div>

                        {/* RIGHT: Status Toggle */}
                        <div className="flex items-center space-x-3">
                            <span className={`text-sm font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {active ? 'RECIBIENDO CASOS' : 'PAUSADO'}
                            </span>
                            <button
                                onClick={handleToggle}
                                disabled={isPending || !isActive}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${!isActive ? 'bg-gray-200 cursor-not-allowed opacity-50' :
                                        active ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`${active ? 'translate-x-7' : 'translate-x-1'
                                        } inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECHARGE MODAL */}
            <AnimatePresence>
                {showRecharge && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Recargar Saldo</h3>
                                    <button onClick={() => setShowRecharge(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 mb-6">
                                    Selecciona un pack de créditos. El saldo se añadirá inmediatamente a tu cuenta.
                                </p>

                                <div className="space-y-3">
                                    {[500, 1000, 1500].map((amount) => (
                                        <button
                                            key={amount}
                                            disabled={isPending}
                                            onClick={() => handleRecharge(amount)}
                                            className="w-full group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                                        >
                                            <span className="font-bold text-lg text-gray-900 group-hover:text-emerald-700">
                                                {amount}€
                                            </span>
                                            <span className="text-sm font-medium text-gray-500 group-hover:text-emerald-600">
                                                Seleccionar
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-xs text-center text-gray-400">
                                        Simulación de Pago (Stripe Integration Pending)
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
