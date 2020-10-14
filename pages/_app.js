import '../styles/index.css'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
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
