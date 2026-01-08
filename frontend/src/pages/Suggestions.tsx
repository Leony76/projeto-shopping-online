import PageTitle from '../components/ui/PageTitle'
import AppLayout from '../layout/AppLayout'
import { HiLightBulb } from 'react-icons/hi'
import PageSectionTitle from '../components/ui/PageSectionTitle'
import { GrCodeSandbox } from 'react-icons/gr'
import CardsGrid from '../components/system/CardsGrid'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { ProductSuggest } from '../types/SuggestProduct'
import SuggestedProductCard from '../components/system/SuggestedProductCard'
import Loading from '../components/ui/Loading'
import { useCatchError } from '../utils/ui/useCatchError'
import ConfirmDecision from '../components/ui/ConfirmDecision'
import { useToast } from '../context/ToastContext'
import { useLockYScroll } from '../utils/customHooks/useLockYScroll'
import EmptyCardGrid from '../components/ui/EmptyCardGrid'
import { TbBulbOff } from 'react-icons/tb'
import { FaPlus, FaUser } from 'react-icons/fa6'
import type { AddSuggestions } from '../types/AddSuggestions'
import Date from '../components/ui/Date'
import { limitName } from '../utils/formatation/limitName'
import ProceedActionButton from '../components/ui/ProceedActionButton'
import { ImCheckboxChecked } from 'react-icons/im'
import ReturnActionButton from '../components/ui/ReturnActionButton'
import { FaCheckCircle, FaWindowClose } from 'react-icons/fa'
import DateTime from '../components/ui/DateTime'

const Suggestions = () => {
  
  const catchError = useCatchError();
  const { showToast } = useToast();

  const [acceptedProductSuggestions, setAcceptedProductSuggestions] = useState<ProductSuggest[]>([]);
  const [selectedSuggestedProductToSell, setSelectedSuggestedProductToSell] = useState<{ amount: number; id: number | null }>({
    amount: 1,
    id: null,
  });
  const [addSuggestions, setAddSuggestions] = useState<AddSuggestions[]>([]);
  const [openedSuggestionId, setOpenedSuggestionId] = useState<number | null | undefined>(null);

  const [flags, setFlags] = useState({
    isLoading: true,
    showPutToSellProductSuggestConfirm: false,
    processingState: false,
  });

  const handleAddSuggestionDecision = async(
    addSuggestionId: number,
    decision: 'accepted' | 'denied', 
  ) => {

    if (flags.processingState)return;
    setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.patch(`/add-suggestion-decision/${addSuggestionId}`, 
        {decision}
      );

      if (decision === 'denied') {
        setAddSuggestions(prev =>
          prev.filter(p => p.id !== addSuggestionId)
        )
      } else {
        setAddSuggestions(prev =>
          prev.map(p =>
            p.id === addSuggestionId
              ? {...p, accepted: true}
              : p
          )
        );
      } 

      showToast(response.data.message, response.data.type);
    } catch (err:unknown) { 
      catchError(err);
    } finally {
      setFlags(prev => ({...prev, processingState: false}));
    }
  }

  const handlePutToSellProductSuggestSubmit = async() => {

    if (selectedSuggestedProductToSell.id === null) return;

    if (flags.processingState)return;
    setFlags(prev => ({...prev, processingState: true}));

    try {
      const response = await api.post(`/add-suggested-product/${selectedSuggestedProductToSell.id}`, {
        amount: selectedSuggestedProductToSell.amount,
      });

      setAcceptedProductSuggestions(prev =>
        prev.map(suggestion =>
          suggestion.id === selectedSuggestedProductToSell.id
            ? { ...suggestion, for_sale: true }
            : suggestion
        )
      );

      setOpenedSuggestionId(null);
      setSelectedSuggestedProductToSell({ amount: 1, id: null });
      showToast(response.data.message, response.data.type);
    } catch (err:unknown) {
      catchError(err);
    } finally {
      setFlags(prev => ({...prev, 
        showPutToSellProductSuggestConfirm: false,
        processingState: false
      }))
    }
  }

  useEffect(() => {
    const getAcceptedProductSuggestions = async () => {
      try {
        const response = await api.get<{ accepted_suggestions: ProductSuggest[] }>('/accepted-suggested-products');
        setAcceptedProductSuggestions(response.data.accepted_suggestions);
      } catch (err:unknown) {
        catchError(err);
      } finally {
        setFlags(prev => ({ ...prev, isLoading: false }));
      }
    };

    getAcceptedProductSuggestions();
  }, []);

  useEffect(() => {
    const getAddSuggestions = async() => {
      try {
        const response = await api.get<{add_suggestions: AddSuggestions[]}>('/add-suggestions');
        setAddSuggestions(response.data.add_suggestions);
      } catch (err:unknown) {
          catchError(err);
      } finally {
         setFlags(prev => ({ ...prev, isLoading: false }));
      }
    }

    getAddSuggestions();
  },[])

  useLockYScroll(flags.showPutToSellProductSuggestConfirm);

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
                      <div className='relative border-y-8 border-double pb-2 pt-1 bg-gray-100 shadow-[0px_0px_3px_#0092B8] px-2 border-cyan-600' key={addSuggestion.id}>
                        {addSuggestion.accepted ? <FaCheckCircle title='Sugestão aceita' className='absolute text-green-700 right-3 top-2 text-2xl'/> : ''}
                        <div className='text-xl flex items-center gap-1 text-orange-700'><FaUser/>{limitName(addSuggestion.user.name.length > 25 ? addSuggestion.user.name.slice(0,25) : addSuggestion.user.name, 2)}</div>
                        <DateTime timeStamp={addSuggestion.created_at}/>
                        <div>
                          <label className='flex text-gray-600 items-center gap-1'><FaPlus/>
                            Sugestão de adição:
                          </label>
                          <p className='h-[fit] text-sm overflow-y-auto border-t-1 pb-1 text-orange-800 pt-0.5 mt-1 border-gray-300'>{addSuggestion.add_suggestion}</p>
                        </div>
                        {!addSuggestion.accepted && (
                          <div className='flex gap-3 border-t-1 pt-2 border-gray-400'>
                            <ProceedActionButton
                              iconButton={ImCheckboxChecked}
                              iconButtonSize={0}
                              buttonLabel={'Aceitar'}
                              styles='text-green-800 bg-green-100'
                              onClick={() => handleAddSuggestionDecision(addSuggestion.id, 'accepted')}
                            />
                            <ReturnActionButton 
                              onClick={() => handleAddSuggestionDecision(addSuggestion.id, 'denied')}
                              iconButton={FaWindowClose} 
                              iconButtonSize={0} 
                              buttonLabel={'Recusar'}
                            />
                          </div>
                        )}
                      </div>
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
                onAcceptWithoutForm={handlePutToSellProductSuggestSubmit}
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