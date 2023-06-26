import Header from '@/components/Header'
import DisplacementDetails from './components/DisplacementDetails'

export default function Home({ params }: { params: { id: string } }) {
  return (
    <>
      <Header title="" />
      <DisplacementDetails id={params.id} />
    </>
  )
}
