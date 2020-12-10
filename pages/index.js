import Nav from 'components/nav'
import Canvas from 'components/Canvas'
import NotEligibleToSignUpPopup from 'components/NotEligibleToSignUpPopup'

export default function IndexPage() {
  return (
    <>
      <Nav />
      <Canvas />
      <NotEligibleToSignUpPopup />
    </>
  )
}
