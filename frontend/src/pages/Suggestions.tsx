import type { IconBaseProps } from 'react-icons'
import PageTitle from '../components/ui/PageTitle'
import AppLayout from '../layout/AppLayout'
import { HiLightBulb } from 'react-icons/hi'
import PageSectionTitle from '../components/ui/PageSectionTitle'
import { GrCodeSandbox } from 'react-icons/gr'

const Suggestions = () => {
  return (
    <AppLayout pageSelected='suggestions'>
      {({search}) => {search
        return (
          <>
            <PageTitle title={'Sugestões'} IconSize={40} icon={HiLightBulb}/>
            <PageSectionTitle title='Sugestões de produtos aceitos' icon={GrCodeSandbox}/>
          </>
        )
      }}
    </AppLayout>
  )
}

export default Suggestions