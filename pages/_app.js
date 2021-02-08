import 'styles/index.css'
import { useEffect } from 'react'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import useGlobalState from 'hooks/useGlobalState'
import { useHotkeys } from 'react-hotkeys-hook'

function MyApp({ Component, pageProps }) {
  const [state, { initWeb3, toggleBribeMode }] = useGlobalState()
  useEffect(initWeb3, []) // Making sure we are hitting initWeb3 only once
  useHotkeys('b', () => toggleBribeMode(true))
  useHotkeys('n', () => toggleBribeMode(false))

  return (
    <>
      <DefaultSeo title='Quadratic Dollar Homepage' />
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='shortcut icon' href='/ballot-box-emoji.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/ballot-box-emoji.png'></link>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
