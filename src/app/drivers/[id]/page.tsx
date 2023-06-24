import Header from '@/components/Header'
import DriverDetails from './components/DriverDetails'

export default function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <Header title="" />
      <DriverDetails id={params.id} />
    </>
  )
}
