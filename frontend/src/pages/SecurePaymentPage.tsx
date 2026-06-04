import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  createVietQrPaymentWithApi,
  fetchRoom,
  updateBookingWithApi,
  verifyVietQrPaymentWithApi,
} from '../api/vipBookingApi'
import { BookingSummary } from '../components/booking/BookingSummary'
import { Icon } from '../components/icons/Icon'
import { PageIntro } from '../components/ui/PageIntro'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { rooms as defaultRooms } from '../data/rooms'
import type { Navigate, Room } from '../types'
import { getSelectedAddOns, getSelectedRoomId, getSelectedStay, getStayNights } from '../utils/bookingSelections'
import { clearActivePaymentId, getActiveBookingId, setActivePaymentId, updateActiveBookingStatus } from '../utils/appStorage'
import { getRoomTaxAmount } from '../utils/pricing'

const vietQrMethod = {
  id: 'vietqr',
  label: 'VietQR',
  icon: 'card' as const,
}

export function SecurePaymentPage({ navigate }: { navigate: Navigate }) {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [room, setRoom] = useState<Room>(defaultRooms[0])
  const [isRoomReady, setIsRoomReady] = useState(false)
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [gatewayPayment, setGatewayPayment] = useState<{
    paymentId: string
    qrImageUrl?: string
    transferContent?: string
    bank?: string
    account?: string
    amount?: number
  } | null>(null)
  const { addOnTotal } = getSelectedAddOns()
  const nights = getStayNights(getSelectedStay())
  const displayTotal = room.price * nights + addOnTotal + getRoomTaxAmount(room, nights)

  const createGatewayPayment = useCallback(async () => {
    const activeBookingId = getActiveBookingId()

    if (!activeBookingId) {
      return null
    }

    setIsCreatingPayment(true)

    try {
      const payload = { bookingId: activeBookingId, amount: String(displayTotal) }
      const paymentRequest = await createVietQrPaymentWithApi(payload)
      const nextGatewayPayment = {
        paymentId: paymentRequest.payment.id,
        qrImageUrl: paymentRequest.qrImageUrl,
        transferContent: paymentRequest.transferContent,
        bank: paymentRequest.bank,
        account: paymentRequest.account,
        amount: paymentRequest.amount,
      }

      setGatewayPayment(nextGatewayPayment)
      setActivePaymentId(paymentRequest.payment.id)
      return nextGatewayPayment
    } catch (error) {
      const message = error instanceof Error ? error.message : t('payment.createFailedMessage')
      showToast({ title: t('payment.createFailedTitle'), message, variant: 'error' })
      return null
    } finally {
      setIsCreatingPayment(false)
    }
  }, [displayTotal, showToast, t])

  useEffect(() => {
    const roomId = getSelectedRoomId()
    if (!roomId) {
      setIsRoomReady(true)
      return
    }

    fetchRoom(roomId)
      .then((nextRoom) => {
        setRoom(nextRoom)
        setIsRoomReady(true)
      })
      .catch((loadError) => {
        const message = loadError instanceof Error ? loadError.message : t('bookingInfo.couldNotLoadRoom')
        showToast({ title: t('bookingInfo.couldNotLoadRoomTitle'), message, variant: 'error' })
        setIsRoomReady(true)
      })
  }, [showToast, t])

  useEffect(() => {
    if (!isRoomReady) {
      return
    }

    setGatewayPayment(null)
    void createGatewayPayment()
  }, [createGatewayPayment, isRoomReady])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isPaymentConfirmed) {
      showToast({
        title: t('payment.confirmRequiredTitle'),
        message: t('payment.confirmRequiredMessage'),
        variant: 'warning',
      })
      return
    }

    window.localStorage.setItem('vip-booking:preferred-payment', vietQrMethod.id)
    const activeBookingId = getActiveBookingId()

    if (!activeBookingId) {
      showToast({
        title: t('payment.missingBookingTitle'),
        message: t('payment.missingBookingMessage'),
        variant: 'warning',
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (!gatewayPayment) {
        await createGatewayPayment()
        return
      }

      const checkedPayment = await verifyVietQrPaymentWithApi(gatewayPayment.paymentId)

      if (checkedPayment.status !== 'success') {
        updateActiveBookingStatus('Pending')
        showToast({
          title: t('payment.notReceivedTitle'),
          message: t('payment.notReceivedMessage'),
          variant: 'warning',
        })
        navigate('failed')
        return
      }

      await updateBookingWithApi(activeBookingId, { status: 'Confirmed' })
      updateActiveBookingStatus('Confirmed')
      clearActivePaymentId()
      showToast({
        title: t('payment.receivedTitle'),
        message: t('payment.receivedMessage'),
        variant: 'success',
      })
      navigate('success')
    } catch (error) {
      const message = error instanceof Error ? error.message : t('payment.checkFailedMessage')
      showToast({ title: t('payment.checkFailedTitle'), message, variant: 'error' })
      navigate('failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <PageIntro
        eyebrow={t('payment.eyebrow')}
        title={t('payment.title')}
        copy={t('payment.copy')}
      />

      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >
        <section className="form-panel">
          <h2>{t('payment.methodTitle')}</h2>
          <div className="payment-tabs">
            <button className="active" type="button">
              <Icon name={vietQrMethod.icon} />
              {vietQrMethod.label}
            </button>
          </div>
          <div className="wallet-panel">
            <div className="qr-box">
              {gatewayPayment?.qrImageUrl ? (
                <img src={gatewayPayment.qrImageUrl} alt="VietQR" />
              ) : isCreatingPayment ? (
                <span>{t('payment.loading')}</span>
              ) : (
                <span>QR</span>
              )}
            </div>
            <div>
              <h3>{t('payment.vietQrTitle')}</h3>
              <p>{t('payment.vietQrDetail')}</p>
              {gatewayPayment ? (
                <small>
                  {gatewayPayment.bank && gatewayPayment.account
                    ? `${t('payment.bank')}: ${gatewayPayment.bank} - ${t('payment.account')}: ${gatewayPayment.account}. `
                    : ''}
                  {gatewayPayment.transferContent ? `${t('payment.transferContent')}: ${gatewayPayment.transferContent}` : ''}
                </small>
              ) : (
                <small>
                  {isCreatingPayment
                    ? t('payment.loadingData')
                    : t('payment.dataMissing')}
                </small>
              )}
            </div>
          </div>
          <label className="check-row consent-row">
            <input
              checked={isPaymentConfirmed}
              disabled={isSubmitting}
              type="checkbox"
              onChange={(event) => {
                setIsPaymentConfirmed(event.target.checked)
              }}
            />
            <span>{t('payment.completedLabel')}</span>
          </label>
          <button className="primary-button full-width" disabled={isSubmitting} type="submit">
            <Icon name="lock" />
            {isSubmitting
              ? t('payment.processing')
              : gatewayPayment
                ? t('payment.checkButton')
                : isCreatingPayment
                  ? t('payment.loadingButton')
                  : t('payment.retryButton')}
          </button>
        </section>
        <BookingSummary room={room} buttonLabel={t('payment.summaryButton')} addOnTotal={addOnTotal} />
      </form>
    </main>
  )
}
