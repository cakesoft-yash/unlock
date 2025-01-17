import { storage } from '~/config/storage'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, ToggleSwitch } from '@unlock-protocol/ui'
import { useState } from 'react'
import { EmailReplyToForm } from './EmailReplyToForm'

interface SubscriptionFormProps {
  lockAddress: string
  network: number
  isManager: boolean
  disabled: boolean
}

export const SendEmailForm = ({
  lockAddress,
  network,
  isManager,
  disabled,
}: SubscriptionFormProps) => {
  const [sendEmail, setSendEmail] = useState(true)
  const [changed, setChanged] = useState(false)

  const updateRequireEmail = async () => {
    if (!isManager) return
    return await storage.saveLockSetting(network, lockAddress, {
      sendEmail,
    })
  }

  const updateSettingsMutation = useMutation(updateRequireEmail, {
    onSuccess: () => {
      setChanged(false)
    },
  })

  const { isLoading, data: { data: lockSettings } = {} } = useQuery(
    ['getLockSettings', lockAddress, network, updateSettingsMutation.isSuccess],
    async () => await storage.getLockSettings(network, lockAddress),
    {
      enabled: lockAddress?.length > 0 && !!network && isManager,
      onSuccess: (res: any) => {
        setSendEmail(res?.data?.sendEmail ?? true)
      },
    }
  )
  const sendEmailValue = lockSettings?.sendEmail
  const disabledInput = disabled || isLoading || !isManager

  return (
    <div className="flex flex-col gap-6">
      <ToggleSwitch
        title="Send email"
        disabled={disabledInput}
        enabled={sendEmail}
        description={
          <span className="mt-2 text-base font-semibold text-black">
            {!sendEmailValue
              ? 'Emails are disabled, Unlock Labs will not send emails to users.'
              : 'Email are enabled, Unlock Labs will send emails to user when their membership status changes.'}
          </span>
        }
        setEnabled={(enabled: boolean) => {
          setSendEmail(enabled)
          setChanged(true)
        }}
      />
      {isManager && (
        <Button
          loading={updateSettingsMutation.isLoading}
          onClick={() => {
            updateSettingsMutation.mutateAsync()
          }}
          disabled={disabledInput || !changed || !isManager}
          className="w-full md:w-1/3"
        >
          Apply
        </Button>
      )}
      <div className="w-full p-4 border border-gray-500 rounded-lg">
        <EmailReplyToForm
          lockAddress={lockAddress}
          isManager={isManager}
          network={network}
          disabled={disabled || !sendEmailValue}
          lockSettings={lockSettings}
        />
      </div>
    </div>
  )
}
