import random from 'lodash/random'

const starsArr = Array.from({ length: 30 }).map((_, index) => (
  <span
    key={index}
    className='star'
    style={{
      position: 'absolute',
      width: `${random(1, 4)}px`,
      height: `${random(1, 4)}px`,
      backgroundColor: 'hsl(282, 47%, 60%)',
      borderRadius: 1,
      boxShadow: '0 0 7px 2px hsl(282, 10%, 20%)',
      zIndex: -1,
      top: `${random(1, 60)}%`,
      left: `${random(1, 99)}%`,
      animation: `shine ${random(4, 10)}s alternate infinite`,
      animationDelay: `${random(1, 3)}`,
    }}
  />
))

export default function Stars() {
  return <div>{starsArr}</div>
}
