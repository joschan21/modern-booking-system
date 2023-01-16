import { format, parseISO } from 'date-fns'
import Image from 'next/image'
import { type FC, useState } from 'react'
import Select from 'react-select'
import { capitalize, selectOptions } from 'src/utils/helper'
import { trpc } from 'src/utils/trpc'

interface MenuProps {
  selectedTime: string // as ISO string
}

const Menu: FC<MenuProps> = ({ selectedTime }) => {
  const { data: menuItems } = trpc.menu.getMenuItems.useQuery()

  const [filter, setFilter] = useState<string | undefined>(undefined)

  const filteredMenuItems = menuItems?.filter((menuItem) => {
    if (!filter) return true
    return menuItem.categories.includes(filter)
  })

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='flex w-full justify-between'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
            On our menu for {format(parseISO(selectedTime), 'MMM do, yyyy')}
          </h2>
          <Select
            onChange={(e) => {
              if (e?.value === 'all') setFilter(undefined)
              else setFilter(e?.value)
            }}
            className='border-none outline-none'
            placeholder='Filter by...'
            options={selectOptions}></Select>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {filteredMenuItems?.map((menuItem) => (
            <div key={menuItem.id} className='group relative'>
              <div className='min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80'>
                <div className='relative h-full w-full object-cover object-center lg:h-full lg:w-full'>
                  <Image src={menuItem.url} alt={menuItem.name} fill style={{objectFit: 'cover'}} />
                </div>
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <h3 className='text-sm text-gray-700'>
                    <a /*  href={product.href} */>
                      <span aria-hidden='true' className='absolute inset-0' />
                      {menuItem.name}
                    </a>
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {menuItem.categories.map((c) => capitalize(c)).join(', ')}
                  </p>
                </div>
                <p className='text-sm font-medium text-gray-900'>${menuItem.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// <div className='mx-auto grid max-w-3xl grid-cols-3'>
//   {menuItems?.map((menuItem) => (
//     <div className='flex flex-col items-center justify-center' key={menuItem.id}>
//       <p>{menuItem.name}</p>
//       <div className='relative h-40 w-40'>
//         <Image fill style={{ objectFit: 'contain' }} alt={menuItem.name} src={menuItem.url} />
//       </div>
//     </div>
//   ))}
// </div>

export default Menu
