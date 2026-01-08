import { FaPlus } from 'react-icons/fa6';
import { TbBulbOff } from 'react-icons/tb';
import { HiLightBulb } from 'react-icons/hi';
import { GrCodeSandbox } from 'react-icons/gr';

import SuggestedProductCard from '../components/system/SuggestedProductCard';
import AddSuggestionCard from '../components/system/AddSuggestionCard';
import PageSectionTitle from '../components/ui/PageSectionTitle';
import ConfirmDecision from '../components/ui/ConfirmDecision';
import EmptyCardGrid from '../components/ui/EmptyCardGrid';
import CardsGrid from '../components/system/CardsGrid';
import PageTitle from '../components/ui/PageTitle';
import Loading from '../components/ui/Loading';
import AppLayout from '../layout/AppLayout';

import useSuggestionsLogic from '../utils/customHooks/useSuggestionsLogic';

const Suggestions = () => {

  const {
    flags,
    addSuggestions,
    openedSuggestionId,
    acceptedProductSuggestions,
    selectedSuggestedProductToSell,
    setSelectedSuggestedProductToSell,
    PutProductSuggestToSell,
    setOpenedSuggestionId,
    AddSuggestionDecision,
    setFlags,
  } = useSuggestionsLogic();

  return (
    <AppLayout pageSelected='suggestions'>
      {() => {

        const hasAcceptedProductSuggestions = acceptedProductSuggestions.length > 0;
        const hasAddSuggestions = addSuggestions.length > 0;

        const orderedAddSuggestions = [...addSuggestions].sort((a, b) => {
          return Number(b.accepted) - Number(a.accepted);
        });

        return (
          <>
            {flags.isLoading && <Loading size={50} style="text-cyan-500 translate-[-50%] fixed top-1/2 left-1/2"/>}

            <PageTitle style='!mb-1' title={'Sugestões'} IconSize={40} icon={HiLightBulb}/>
                       
            {!flags.isLoading && (
              <>
                <PageSectionTitle textSize='md:text-3xl text-lg mt-2' title='Sugestões de produtos aceitos' icon={GrCodeSandbox}/>

                <CardsGrid gridType='productSuggests' style='border-y-2 py-2 border-gray-200 px-2 custom-scroll max-h-[580px] overflow-y-auto'>
                  {hasAcceptedProductSuggestions ? (
                    acceptedProductSuggestions.map((acceptedProductSuggestions) => (
                      <SuggestedProductCard 
                        key={acceptedProductSuggestions.id}
                        suggestProduct={acceptedProductSuggestions} 
                        attributes={selectedSuggestedProductToSell}
                        accepted
                        isOpen={openedSuggestionId === acceptedProductSuggestions.id}
                        onClose={() => {
                          setOpenedSuggestionId(null)
                          setSelectedSuggestedProductToSell(prev => ({...prev, amount: 1, id: null}))
                        }}
                        onToggle={() => {
                          setOpenedSuggestionId(prev => prev === acceptedProductSuggestions.id ? null : acceptedProductSuggestions.id)
                          setSelectedSuggestedProductToSell(prev => ({...prev, amount: 1, id: acceptedProductSuggestions.id ?? 0}))
                        }}
                        actions={{
                          setSelectedSuggestedProductToSell,
                          setFlags,
                        }}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-10">
                      <EmptyCardGrid 
                        text={"Nenhuma sugestão aceita ainda"} 
                        icon={TbBulbOff}
                      />
                    </div>
                  )}
                </CardsGrid>

                <div className='md:hidden block'><PageSectionTitle position='centered' icon={FaPlus} title='Sugestões de adição'/></div>
                <div className='md:block hidden'><PageSectionTitle position='left' icon={FaPlus} title='Sugestões de adição'/></div>

                <CardsGrid gridType='addSuggestions' style='border-y-2 py-2 border-gray-200 px-2 custom-scroll max-h-[580px] overflow-y-auto'>
                  {hasAddSuggestions ? (
                    orderedAddSuggestions.map((addSuggestion) => (
                      <AddSuggestionCard
                        key={addSuggestion.id}
                        addSuggestion={addSuggestion}
                        actions={{AddSuggestionDecision}}
                      />                      
                    ))
                  ) : (
                    <div className="col-span-full py-10">
                      <EmptyCardGrid 
                        text={"Nenhuma sugestão de adição de algo ainda"} 
                        icon={FaPlus}
                      />
                    </div>
                  )}
                </CardsGrid>
              </>             
            )}

            {!flags.isLoading && flags.showPutToSellProductSuggestConfirm && (
              <ConfirmDecision 
                decisionTitle={'Confirmar pôr sugestão de produto à venda'} 
                decisionDescription={`Tem certeza que deseja por ${selectedSuggestedProductToSell.amount} unidade(s) dessa sugestão de produto à venda ?`} 
                onCancel={() => setFlags(prev => ({...prev, showPutToSellProductSuggestConfirm: false}))}
                onAcceptWithoutForm={PutProductSuggestToSell}
                processingState={flags.processingState}
                processingLabel='Pondo'
              />
            )}
          </>
        )
      }}
    </AppLayout>
  )
}

export default Suggestions