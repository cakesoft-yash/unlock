// import UnlockAssets from '@unlock-protocol/unlock-assets'

// const { SvgComponents } = UnlockAssets

export function PoweredByUnlock() {
  return (
    <div className="flex justify-center py-4">
      <a
        className="inline-flex items-center gap-1 text-sm font-medium"
        href="https://nft-marketplace-v2.zocial.io/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by Zencafe
        {/* <SvgComponents.UnlockWordMark
          className="fill-black"
          fill="#000"
          height={14}
        /> */}
      </a>
    </div>
  )
}
