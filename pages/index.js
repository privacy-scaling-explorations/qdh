import Nav from 'components/nav'
import Canvas from 'components/Canvas'

import dynamic from 'next/dynamic'
const Stars = dynamic(() => import('components/Stars'), { ssr: false })

export default function IndexPage() {
  return (
    <>
      <Nav />
      <Canvas />
      <Stars />
    </>
  )
}
