import { Spinner } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, type Dispatch, type FC, type SetStateAction } from 'react'
import { HiX } from 'react-icons/hi'
import { capitalize } from 'src/utils/helper'
import { trpc } from 'src/utils/trpc'

interface CartProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  products: { id: string; quantity: number }[]
  removeFromCart: (id: string) => void
}

const Cart: FC<CartProps> = ({ open, setOpen, products, removeFromCart }) => {
  const router = useRouter()

  // tRPC
  const { data: itemsInCart } = trpc.menu.getCartItems.useQuery(products)
  const { mutate: checkout, isLoading } = trpc.checkout.checkoutSession.useMutation({
    onSuccess: ({ url }) => {
      router.push(url)
    },
    onMutate: ({ products }) => {
      localStorage.setItem('products', JSON.stringify(products))
    },
  })

  const subtotal = (
    itemsInCart?.reduce(
      (acc, item) => acc + item.price * itemsInCart.find((i) => i.id === item.id)!.quantity!,
      0
    ) ?? 0
  ).toFixed(2)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'>
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                    <div className='flex-1 overflow-y-auto py-6 px-4 sm:px-6'>
                      <div className='flex items-start justify-between'>
                        <Dialog.Title className='text-lg font-medium text-gray-900'>
                          Shopping cart
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='-m-2 p-2 text-gray-400 hover:text-gray-500'
                            onClick={() => setOpen(false)}>
                            <span className='sr-only'>Close panel</span>
                            <HiX className='h-6 w-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>

                      <div className='mt-8'>
                        <div className='flow-root'>
                          <ul role='list' className='-my-6 divide-y divide-gray-200'>
                            {itemsInCart?.map((item) => {
                              const thisItem = products.find((product) => product.id === item.id)
                              return (
                                <li key={item.id} className='flex py-6'>
                                  <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                                    <img
                                      src={item.url}
                                      alt={item.name}
                                      className='h-full w-full object-cover object-center'
                                    />
                                  </div>

                                  <div className='ml-4 flex flex-1 flex-col'>
                                    <div>
                                      <div className='flex justify-between text-base font-medium text-gray-900'>
                                        <h3>
                                          <p>{item.name}</p>
                                        </h3>
                                        <p className='ml-4'>${item.price.toFixed(2)}</p>
                                      </div>
                                      <p className='mt-1 text-sm text-gray-500'>
                                        {item.categories.map((c) => capitalize(c)).join(', ')}
                                      </p>
                                    </div>
                                    <div className='flex flex-1 items-end justify-between text-sm'>
                                      <p className='text-gray-500'>Qty {thisItem?.quantity}</p>

                                      <div className='flex'>
                                        <button
                                          type='button'
                                          onClick={() => removeFromCart(item.id)}
                                          className='font-medium text-indigo-600 hover:text-indigo-500'>
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className='border-t border-gray-200 py-6 px-4 sm:px-6'>
                      <div className='flex justify-between text-base font-medium text-gray-900'>
                        <p>Subtotal</p>
                        <p>${subtotal}</p>
                      </div>
                      <p className='mt-0.5 text-sm text-gray-500'>
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className='mt-6'>
                        <button
                          onClick={() => checkout({ products })}
                          className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'>
                          {isLoading ? <Spinner /> : 'Checkout'}
                        </button>
                      </div>
                      <div className='mt-6 flex justify-center text-center text-sm text-gray-500'>
                        <p>
                          or
                          <button
                            type='button'
                            className='ml-1 font-medium text-indigo-600 hover:text-indigo-500'
                            onClick={() => setOpen(false)}>
                            Continue Shopping
                            <span aria-hidden='true'> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Cart
