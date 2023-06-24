import Header from '@/components/Header'
import VehicleDetails from './components/VehicleDetails'

export default function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <Header title="" />
      <VehicleDetails id={params.id} />
    </>
  )
}
