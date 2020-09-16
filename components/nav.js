import Link from 'next/link'

const links = [
  // { href: 'https://github.com/vercel/next.js', label: 'GitHub' },
  // { href: 'https://nextjs.org/docs', label: 'Docs' },
]

export default function Nav() {
  return (
    <nav>
      <ul className='flex items-center justify-between p-8'>
        <li>
          <Link href='/'>
            <a className='text-blue-500 no-underline'>Home</a>
          </Link>
        </li>
        <h1 className='text-2xl text-center'>QDH</h1>
        <ul className='flex items-center justify-between space-x-4'>
          {links.map(({ href, label }) => (
            <li key={`${href}${label}`}>
              <a href={href} className='no-underline btn-blue'>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </ul>
    </nav>
  )
}
