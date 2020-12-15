import useGlobalState from 'hooks/useGlobalState'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Dropdown from 'components/Dropdown'

export function formatAccountAddress(fullAddress) {
  return fullAddress.substring(0, 6) + '...' + fullAddress.substring(fullAddress.length - 4, fullAddress.length)
}

export default function WalletConnectButton() {
  const [{ address, ensName }, { connect, logout }] = useGlobalState()

  if (address) {
    return (
      <Dropdown
        trigger={
          <a className='px-6 pl-12 button'>
            <span className='absolute' style={{ top: '7px', left: '20px' }}>
              <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
            </span>
            {ensName || formatAccountAddress(address)}
          </a>
        }>
        <a
          className='block px-4 py-2 text-sm leading-5 text-gray-700 text-red-600 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
          role='menuitem'
          onClick={logout}>
          Log out
        </a>
      </Dropdown>
    )
  } else {
    return (
      <a className='px-6 button' onClick={connect}>
        Connect Wallet
      </a>
    )
  }
}
