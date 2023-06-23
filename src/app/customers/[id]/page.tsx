import Header from '@/components/Header'
import CustomerDetails from './components/CustomerDetails'

export default function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <Header title="" />
      <CustomerDetails id={params.id} />
    </>
  )
}
