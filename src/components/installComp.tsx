
export default function InstallAppBanner() {
  
  return (
    // showBanner && (
      <div className=" top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center">
        <span className="pr-5 tracking-tighter"> x </span>
        <span className=" text-sm font-semibold">Install StreetByte for a better experience!</span>
        <button
        //   onClick={handleInstallClick}
          className="bg-white text-red-500 py-1 px-3 w-32 rounded hover:bg-gray-100">
          Install App
        </button>
      </div>
    )
}
